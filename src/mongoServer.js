import 'dotenv/config';
import mongoose from 'mongoose';

var MONGO_URL = process.env.MONGODB_URI

const DB_NAME = 'eddo'

const connectToMongo = (after) => mongoose.connect(
		MONGO_URL, 
		{ dbName: DB_NAME }
	)
	.then(() => console.log('MongoDB connected successfully'))
	.then(after)
	.catch((err) => console.log(err))

export default connectToMongo