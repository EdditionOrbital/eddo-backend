import mongoose from "mongoose";
import { unpackMultipleDocuments, unpackSingleDocument } from "../utils/unpackDocument.js";
const schemaTypes = mongoose.Schema.Types

export const TaskSchema = mongoose.Schema({
    studentId: { type: schemaTypes.String, required: [true, "This field cannot be empty."] },
    title: { type: schemaTypes.String, required: [true, "This field cannot be empty."] },
    status: { type: schemaTypes.String, required: [true, "This field cannot be empty."] },
    date: { type: schemaTypes.String, required: false },
})

export const TaskObject = mongoose.model('Task', TaskSchema)

export const createTask = (task) => {
	const httpResponse = new TaskObject({...task, date: new Date().toTimeString()}).save()
		.then(res => ({ response: res._id}))
		.catch(err => ({ error: err}))
	return httpResponse
}

export const readTasks = (params) => {
	return TaskObject.find(params)
		.then(unpackMultipleDocuments)
		.catch(err => console.log('Error while getting tasks'))
}

export const updateTask = (query, update) => {
	return TaskObject.findOneAndUpdate(query, update, {upsert: true, new: true})
		.then(res => ({ response: res._id }))
		.catch(err => ({ error: err}))
}

export const deleteTask = (params) => {
	return TaskObject.findOneAndDelete(params)
		.then(res => ({ response: "Deleted" }))
		.catch(err => ({ error: err}))
}