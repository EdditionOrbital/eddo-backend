import mongoose from "mongoose"
import { unpackMultipleDocuments, unpackSingleDocument } from "../utils/unpackDocument.js"
const schemaTypes = mongoose.Schema.Types

export const FolderSchema = mongoose.Schema({
    title: { type: schemaTypes.String, required: [true, "This field cannot be empty."] },
    parentFolder: { type: schemaTypes.ObjectId, required: false },
    moduleId: { type: schemaTypes.String, required: true },
    openDate: { type: schemaTypes.String, required: false },
    closeDate: { type: schemaTypes.String, required: false },
})

export const FolderObject = mongoose.model('Folder', FolderSchema)

export const createFolder = (folder) => {
	const httpResponse = new FolderObject(folder).save()
		.then(res => ({ response: res._id}))
		.catch(err => ({ error: err}))
	return httpResponse
}

export const readFolders = (params) => {
	return FolderObject.find(params)
		.then(unpackMultipleDocuments)
		.catch(err => console.log('Error while getting folders'))
}

export const readFolder = (params) => {
	return FolderObject.findOne(params)
		.then(unpackSingleDocument)
		.catch(err => console.log('Error while getting folder'))
}