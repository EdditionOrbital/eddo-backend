import mongoose from "mongoose"
import { unpackMultipleDocuments, unpackSingleDocument } from "../utils/unpackDocument.js";
const schemaTypes = mongoose.Schema.Types

const FileSchema = mongoose.Schema({
	title: { type: schemaTypes.String, required: [true, "This field cannot be empty."] },
	path: { type: schemaTypes.String, required: [true, "This field cannot be empty."] },
	size: { type: schemaTypes.Number, required: [true, "This field cannot be empty."] },
	parentFolder: { type: schemaTypes.ObjectId, required: false },
	moduleId: { type: schemaTypes.String, required: true },
	openDate: { type: schemaTypes.String, required: false },
	closeDate: { type: schemaTypes.String, required: false },
})

export const FileObject = mongoose.model('File', FileSchema)

export const createFile = (file) => {
	const httpResponse = new FileObject(file).save()
		.then(res => ({ response: res._id}))
		.catch(err => ({ error: err}))
	return httpResponse
}

export const readFiles = (params) => {
	return FileObject.find(params)
		.then(unpackMultipleDocuments)
		.catch(err => console.log('Error while getting files'))
}

export const readFile = (params) => {
	return FileObject.findOne(params)
		.then(unpackSingleDocument)
		.catch(err => console.log('Error while getting file'))
}