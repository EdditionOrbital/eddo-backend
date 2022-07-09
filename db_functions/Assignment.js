import mongoose from "mongoose";
import { unpackMultipleDocuments, unpackSingleDocument } from "../utils/unpackDocument.js";
const schemaTypes = mongoose.Schema.Types

export const AssignmentSchema = mongoose.Schema({
	open: { type: schemaTypes.String, required: [true, "This field cannot be empty."] },
	close: { type: schemaTypes.String, required: [true, "This field cannot be empty."] },
	title: { type: schemaTypes.String, required: [true, "This field cannot be empty."] },
	moduleId: { type: schemaTypes.String, required: [true, "This field cannot be empty."] },
	instructions: { type: schemaTypes.String, required: [true, "This field cannot be empty."] },
	files: { type: [schemaTypes.String], required: [true, "This field cannot be empty."], default: [] },
	maxScore: { type: schemaTypes.Number },

})

export const AssignmentObject = mongoose.model('Assignment', AssignmentSchema)

export const createAssignment = (Assignment) => {
	const httpResponse = new AssignmentObject(Assignment).save()
		.then(res => ({ response: res._id}))
		.catch(err => ({ error: err}))
	return httpResponse
}

export const readAssignments = (params) => {
	return AssignmentObject.find(params)
		.then(unpackMultipleDocuments)
		.catch(err => console.log('Error while getting Assignment'))
}

export const readAssignment = (params) => {
	return AssignmentObject.findOne(params)
		.then(unpackSingleDocument)
		.catch(err => console.log('Error while getting Assignment'))
}

export const updateAssignment = (query, update) => {
	return AssignmentObject.findOneAndUpdate(query, update, {upsert: true, new: true})
		.then(res => ({ response: res._id }))
		.catch(err => ({ error: err}))
}

export const deleteAssignment = (params) => {
	return AssignmentObject.findOneAndDelete(params)
		.then(res => ({ response: "Deleted" }))
		.catch(err => ({ error: err}))
}