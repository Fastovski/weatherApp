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


//сначала решить прикол что записывает по две ссылки
//после переделать парсер, чтобы все было в одном файле
//а именно:
// пишем некий "цикл" который сначала проходится по странице и лутает первую ссылку на первое аниме
// затем переходит по этой ссылке и лутает ссылки на каждую серию
// и после уже в каждой ссылке на серию получаем ссылку на видосик этой серии
// ------
// если парс аниме успешен - записать в бд
// и потом уже переходить на другую ссылку аниме