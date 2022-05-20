import { MongoClient } from "mongodb";
import dotenv from "dotenv";

dotenv.config();

const mongoClient = new MongoClient(process.env.MONGO_URL);

await mongoClient.connect();

const db = mongoClient.db("drivencracy_database");

export default db;