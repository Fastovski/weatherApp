import axios from 'axios';
import { MongoClient,Db, Collection } from 'mongodb';
import cheerio from 'cheerio';

const URL = 'https://jut.su/anime/action-demons/2024/';

const MongoUrl = "mongodb://127.0.0.1:27017";
const dbName = 'animeService';
const collectionName = 'animeLinks';

async function fetchHTML(url: string): Promise<string> {
    const { data } = await axios.get(url, {
        headers: {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
        }
    });
    return data;
}

async function extractLinks(html: string): Promise<string[]> {
    const $ = cheerio.load(html);
    const links: string[] = [];

    $('div.all_anime_global a').each((index, element) => {
        const href = $(element).attr('href');
        if (href) {
            links.push(`https://jut.su${href}`);
        }
    });

    try {
        await saveLinksToMongoDB(links);
    } catch (error) {
        console.error('Error saving links to MongoDB:', error);
    }

    return links;
}

async function saveLinksToMongoDB(links:string[]){
    let client: MongoClient | null = null;
    try{
        client = await MongoClient.connect(MongoUrl);
        const db: Db = client.db(dbName);
        const collection: Collection = db.collection(collectionName);

        await collection.insertMany(links.map(link => ({ link })));
        console.log(`Saved ${links.length} to MongoDB`);
    } catch (error) {
        console.error('Error saving links to MongoDB:', error);
    } finally {
        if (client) {
            await client.close();
        }
    }
}

export async function main(): Promise<string[]> {
    try {
        const html = await fetchHTML(URL);
        const links = await extractLinks(html);
        console.log('Extracted links:', links);
        return links;
    } catch (error) {
        console.error('Error:', error);
        return [];
    }
}

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
