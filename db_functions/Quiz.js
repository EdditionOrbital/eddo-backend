import mongoose from "mongoose";
import { unpackMultipleDocuments, unpackSingleDocument } from "../utils/unpackDocument.js";
const schemaTypes = mongoose.Schema.Types

export const MCOptionSchema = mongoose.Schema({
	_id: { type: schemaTypes.String, required: [true, "This field cannot be empty."] },
	value: { type: schemaTypes.String, required: [true, "This field cannot be empty."] },
})

export const QuizQuestionSchema = mongoose.Schema({
	_id: { type: schemaTypes.String, required: [true, "This field cannot be empty."] },
	type: { type: schemaTypes.String, required: [true, "This field cannot be empty."] },
	order: { type: schemaTypes.Number, required: [true, "This field cannot be empty."] },
	body: { type: schemaTypes.String, required: [true, "This field cannot be empty."] },
	explanation: { type: schemaTypes.String },
	options: { type: [MCOptionSchema], required: [true, "This field cannot be empty."], default: [] },
	answers: { type: [schemaTypes.String], required: [true, "This field cannot be empty."], default: [] },
})

export const QuizSchema = mongoose.Schema({
	open: { type: schemaTypes.String, required: [true, "This field cannot be empty."] },
	close: { type: schemaTypes.String, required: [true, "This field cannot be empty."] },
	title: { type: schemaTypes.String, required: [true, "This field cannot be empty."] },
	moduleId: { type: schemaTypes.String, required: [true, "This field cannot be empty."] },
	questions: { type: [QuizQuestionSchema], required: [true, "This field cannot be empty."], default: [] },
	displayScore: { type: schemaTypes.Boolean, required: true, default: false },
})

export const QuizObject = mongoose.model('Quiz', QuizSchema)

export const createQuiz = (quiz) => {
	const httpResponse = new QuizObject(quiz).save()
		.then(res => ({ response: res._id}))
		.catch(err => ({ error: err}))
	return httpResponse
}

export const readQuizzes = (params) => {
	return QuizObject.find(params)
		.then(unpackMultipleDocuments)
		.catch(err => console.log('Error while getting Quiz'))
}

export const readQuiz = (params) => {
	return QuizObject.findOne(params)
		.then(unpackSingleDocument)
		.catch(err => console.log('Error while getting Quiz'))
}

export const updateQuiz = (query, update) => {
	return QuizObject.findOneAndUpdate(query, update, {upsert: true, new: true})
		.then(res => ({ response: res._id }))
		.catch(err => ({ error: err}))
}

export const deleteQuiz = (params) => {
	return QuizObject.findOneAndDelete(params)
		.then(res => ({ response: "Deleted" }))
		.catch(err => ({ error: err}))
}