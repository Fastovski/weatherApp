import { MongoClient, Db, Collection } from 'mongodb';

export async function connectToDatabase(): Promise<{ db: Db; client: MongoClient }> {
    const client = await MongoClient.connect('mongodb://localhost:27017/');
    const db = client.db('animeService');
    return { db, client };
  }