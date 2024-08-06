"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.main = exports.fetchHTML = void 0;
const axios_1 = __importDefault(require("axios"));
const cheerio_1 = __importDefault(require("cheerio"));
const URL = 'https://jut.su/anime/action-demons/2024/';
const MongoUrl = "mongodb://127.0.0.1:27017";
const dbName = 'animeService';
const collectionName = 'animeLinks';
function fetchHTML(url) {
    return __awaiter(this, void 0, void 0, function* () {
        const { data } = yield axios_1.default.get(url, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
            }
        });
        return data;
    });
}
exports.fetchHTML = fetchHTML;
function extractAnimeLinks(html) {
    return __awaiter(this, void 0, void 0, function* () {
        const $ = cheerio_1.default.load(html);
        const links = new Set();
        $('div.all_anime_global a').each((index, element) => {
            const href = $(element).attr('href');
            if (href) {
                links.add(`https://jut.su${href}`);
            }
        });
        return Array.from(links);
    });
}
function extractEpisodeLinks(html) {
    return __awaiter(this, void 0, void 0, function* () {
        const $ = cheerio_1.default.load(html);
        const links = [];
        $('.short-btn.green.video.the_hildi, .short-btn.black.video.the_hildi').each((index, element) => {
            const href = $(element).attr('href');
            if (href) {
                links.push(`https://jut.su${href}`);
            }
        });
        return links;
    });
}
function main() {
    return __awaiter(this, void 0, void 0, function* () {
        let animeLinks = [];
        let episodeLinks = [];
        let currentIndex = 0;
        while (currentIndex < animeLinks.length || animeLinks.length === 0) {
            let currentAnimeLink;
            if (animeLinks.length === 0) {
                const html = yield fetchHTML(URL);
                animeLinks = yield extractAnimeLinks(html);
                currentAnimeLink = animeLinks[0];
            }
            else {
                currentAnimeLink = animeLinks[currentIndex];
            }
            const html = yield fetchHTML(currentAnimeLink);
            episodeLinks = yield extractEpisodeLinks(html);
            console.log(`Extracted ${episodeLinks.length} episode links for anime: ${currentAnimeLink}`);
            currentIndex++;
        }
        console.log('All links extracted successfully!');
        return animeLinks;
    });
}
exports.main = main;
// async function saveLinksToMongoDB(links:string[]){
//     let client: MongoClient | null = null;
//     try{
//         client = await MongoClient.connect(MongoUrl);
//         const db: Db = client.db(dbName);
//         const collection: Collection = db.collection(collectionName);
//         await collection.insertMany(links.map(link => ({ link })));
//         console.log(`Saved ${links.length} to MongoDB`);
//     } catch (error) {
//         console.error('Error saving links to MongoDB:', error);
//     } finally {
//         if (client) {
//             await client.close();
//         }
//     }
// }
// export async function main(): Promise<string[]> {
//     try {
//         const html = await fetchHTML(URL);
//         const links = await extractLinks(html);
//         // await saveLinksToMongoDB(links);
//         return links;
//     } catch (error) {
//         console.error('Error:', error);
//         return [];
//     }
// }
