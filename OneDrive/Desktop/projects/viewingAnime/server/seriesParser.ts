import axios from 'axios';
import { MongoClient,Db, Collection } from 'mongodb';
import cheerio from 'cheerio';

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