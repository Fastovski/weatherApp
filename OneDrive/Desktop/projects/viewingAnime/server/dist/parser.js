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
exports.main = void 0;
const axios_1 = __importDefault(require("axios"));
const mongodb_1 = require("mongodb");
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
function extractLinks(html) {
    return __awaiter(this, void 0, void 0, function* () {
        const $ = cheerio_1.default.load(html);
        const links = [];
        $('div.all_anime_global a').each((index, element) => {
            const href = $(element).attr('href');
            if (href) {
                links.push(`https://jut.su${href}`);
            }
        });
        try {
            yield saveLinksToMongoDB(links);
        }
        catch (error) {
            console.error('Error saving links to MongoDB:', error);
        }
        return links;
    });
}
function saveLinksToMongoDB(links) {
    return __awaiter(this, void 0, void 0, function* () {
        let client = null;
        try {
            client = yield mongodb_1.MongoClient.connect(MongoUrl);
            const db = client.db(dbName);
            const collection = db.collection(collectionName);
            yield collection.insertMany(links.map(link => ({ link })));
            console.log(`Saved ${links.length} to MongoDB`);
        }
        catch (error) {
            console.error('Error saving links to MongoDB:', error);
        }
        finally {
            if (client) {
                yield client.close();
            }
        }
    });
}
function main() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const html = yield fetchHTML(URL);
            const links = yield extractLinks(html);
            console.log('Extracted links:', links);
            return links;
        }
        catch (error) {
            console.error('Error:', error);
            return [];
        }
    });
}
exports.main = main;
// import axios from 'axios';
// import cheerio from 'cheerio';
// const URL = 'https://jut.su/anime/action-demons/2024/';
// async function fetchHTML(url: string): Promise<string> {
//     const { data } = await axios.get(url, {
//         headers: {
//             'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
//         }
//     });
//     return data;
// }
// async function extractLinks(html: string): Promise<string[]> {
//     const $ = cheerio.load(html);
//     return $('div.all_anime_global a')
//         .map((index, element) => $(element).attr('href'))
//         .get();
// }
// // async function extractLinks(html: string): Promise<string[]> {
// //     const $ = cheerio.load(html);
// //     const links: string[] = [];
// //     $('div.all_anime_global a').each((index, element) => {
// //         const href = $(element).attr('href');
// //         if (href) {
// //             links.push(href);
// //         }
// //     });
// //     return links;
// // }
// export async function main(): Promise<string[]> {
//     try {
//         const html = await fetchHTML(URL);
//         const links = await extractLinks(html);
//         console.log('Extracted links:', links);
//         return links;
//     } catch (error) {
//         console.error('Error:', error);
//         return [];
//     }
// }
