import mongoose from "mongoose";
import { unpackMultipleDocuments, unpackSingleDocument } from "../utils/unpackDocument.js";
const schemaTypes = mongoose.Schema.Types

export const AssignmentSubmissionSchema = mongoose.Schema({
	date: { type: schemaTypes.String, required: [true, "This field cannot be empty."] },
	studentId: { type: schemaTypes.String, required: [true, "This field cannot be empty."] },
	assignmentId: { type: schemaTypes.String, required: [true, "This field cannot be empty."] },
	files: { type: [schemaTypes.String], required: [true, "This field cannot be empty."], default: [] },
	score: { type: schemaTypes.Number, required: true, default: -1 }
})

export const AssignmentSubmissionObject = mongoose.model('AssignmentSubmission', AssignmentSubmissionSchema)

export const createAssignmentSubmission = (assub) => {
	const httpResponse = new AssignmentSubmissionObject({...assub, date: new Date().toISOString()}).save()
		.then(res => ({ response: res._id}))
		.catch(err => ({ error: err}))
	return httpResponse
}

export const readAssignmentSubmissions = (params) => {
	return AssignmentSubmissionObject.find(params)
		.then(unpackMultipleDocuments)
		.catch(err => console.log('Error while getting AssignmentSubmission'))
}

export const readAssignmentSubmission = (params) => {
	return AssignmentSubmissionObject.findOne(params)
		.then(unpackSingleDocument)
		.catch(err => console.log('Error while getting AssignmentSubmission'))
}

export const updateAssignmentSubmission = (query, update) => {
	return AssignmentSubmissionObject.findOneAndUpdate(query, update, {upsert: true, new: true})
		.then(res => ({ response: res._id }))
		.catch(err => ({ error: err}))
}

export const deleteAssignmentSubmission = (params) => {
	return AssignmentSubmissionObject.findOneAndDelete(params)
		.then(res => ({ response: "Deleted" }))
		.catch(err => ({ error: err}))
}