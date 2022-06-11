import mongoose from 'mongoose';

const MONGO_URL = 'mongodb://0.0.0.0:27017'
const DB_NAME = 'eddo'

const connectToMongo = (after) => mongoose.connect(
		MONGO_URL, 
		{ dbName: DB_NAME }
	)
	.then(() => console.log('MongoDB connected successfully'))
	.then(after)
	.catch((err) => console.log('Error while connecting to MongoDB'))

export default connectToMongo