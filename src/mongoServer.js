import mongoose from 'mongoose';

var mongoServerName = process.env.NODE_ENV === 'production' ? 'eddo-mongo-1' : '0.0.0.0'
var MONGO_URL = `mongodb://${mongoServerName}:27017`

const DB_NAME = 'eddo'

const connectToMongo = (after) => mongoose.connect(
		MONGO_URL, 
		{ dbName: DB_NAME }
	)
	.then(() => console.log('MongoDB connected successfully'))
	.then(after)
	.catch((err) => console.log(err))

export default connectToMongo