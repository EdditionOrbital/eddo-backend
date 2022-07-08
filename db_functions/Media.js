import mongoose from "mongoose";
import { unpackMultipleDocuments, unpackSingleDocument } from "../utils/unpackDocument.js";
const schemaTypes = mongoose.Schema.Types

export const MediaSchema = mongoose.Schema({
	date: { type: schemaTypes.String, required: [true, "This field cannot be empty."] },
	moduleId: { type: schemaTypes.String, required: [true, "This field cannot be empty."] },
	title: { type: schemaTypes.String, required: [true, "This field cannot be empty."] },
	url: { type: schemaTypes.String, required: [true, "This field cannot be empty."] },
	tags: { type: [schemaTypes.String], required: [true, "This field cannot be empty."], default: [] },
})

export const MediaObject = mongoose.model('Media', MediaSchema)

export const createMedia = (Media) => {
	const httpResponse = new MediaObject({...Media, date: new Date().toISOString()}).save()
		.then(res => ({ response: res._id}))
		.catch(err => ({ error: err}))
	return httpResponse
}

export const readMedias = (params) => {
	return MediaObject.find(params)
		.then(unpackMultipleDocuments)
		.catch(err => console.log('Error while getting media'))
}

export const readMedia = (params) => {
	return MediaObject.findOne(params)
		.then(unpackSingleDocument)
		.catch(err => console.log('Error while getting media'))
}

export const updateMedia = (query, update) => {
	return MediaObject.findOneAndUpdate(query, update, {upsert: true, new: true})
		.then(res => ({ response: res._id }))
		.catch(err => ({ error: err}))
}

export const deleteMedia = (params) => {
	return MediaObject.findOneAndDelete(params)
		.then(res => ({ response: "Deleted" }))
		.catch(err => ({ error: err}))
}