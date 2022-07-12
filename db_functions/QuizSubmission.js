import mongoose from "mongoose";
import { unpackMultipleDocuments, unpackSingleDocument } from "../utils/unpackDocument.js";
const schemaTypes = mongoose.Schema.Types

export const QuizResponseSchema = mongoose.Schema({
	questionId: { type: schemaTypes.String, required: [true, "This field cannot be empty."] },
	options: { type: [schemaTypes.String], required: [true, "This field cannot be empty."], default: [] },
})

export const QuizSubmissionSchema = mongoose.Schema({
	date: { type: schemaTypes.String, required: [true, "This field cannot be empty."] },
	studentId: { type: schemaTypes.String, required: [true, "This field cannot be empty."] },
	quizId: { type: schemaTypes.String, required: [true, "This field cannot be empty."] },
	responses: { type: [QuizResponseSchema], required: [true, "This field cannot be empty."], default: [] },
	time: { type: schemaTypes.Number, required: [true, "This field cannot be empty."]},
	status: { type: schemaTypes.String, required: true }
})

export const QuizSubmissionObject = mongoose.model('QuizSubmission', QuizSubmissionSchema)

export const createQuizSubmission = (quizsub) => {
	const httpResponse = new QuizSubmissionObject({...quizsub, date: new Date().toISOString()}).save()
		.then(res => ({ response: res._id}))
		.catch(err => ({ error: err}))
	return httpResponse
}

export const readQuizSubmissions = (params) => {
	return QuizSubmissionObject.find(params)
		.then(unpackMultipleDocuments)
		.catch(err => console.log('Error while getting QuizSubmission'))
}

export const readQuizSubmission = (params) => {
	return QuizSubmissionObject.findOne(params)
		.then(unpackSingleDocument)
		.catch(err => console.log('Error while getting QuizSubmission'))
}

export const updateQuizSubmission = (query, update) => {
	return QuizSubmissionObject.findOneAndUpdate(query, update, {upsert: true, new: true})
		.then(res => ({ response: res._id }))
		.catch(err => ({ error: err}))
}

export const deleteQuizSubmission = (params) => {
	return QuizSubmissionObject.findOneAndDelete(params)
		.then(res => ({ response: "Deleted" }))
		.catch(err => ({ error: err}))
}