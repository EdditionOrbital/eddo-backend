import { unpackMultipleDocuments, unpackSingleDocument } from "../utils/unpackDocument.js";

import mongoose from "mongoose"
const schemaTypes = mongoose.Schema.Types

const LessonSchema = mongoose.Schema({
    code: { type: schemaTypes.String, required: [true, "This field cannot be empty."]},
    moduleId: { type: schemaTypes.String, required: [true, "This field cannot be empty."] },
    startTime: { type: schemaTypes.String, required: [true, "This field cannot be empty."] },
    endTime: { type: schemaTypes.String, required: [true, "This field cannot be empty."] },
    venue: { type: schemaTypes.String, required: false },
    day: { type: schemaTypes.String, required: [true, "This field cannot be empty."] },
    weeks: { type: [schemaTypes.Number], required: [true, "This field cannot be empty."] },
    lessonType: { type: schemaTypes.String, required: [true, "This field cannot be empty."] },
})

export const LessonObject = mongoose.model('Lesson', LessonSchema)

export const readLessons = (params) => {
	return LessonObject.find(params)
		.then(unpackMultipleDocuments)
		.catch(err => console.log('Error while getting lessons'))
}

export const readLesson = (params) => {
	return LessonObject.findOne(params)
		.then(unpackSingleDocument)
		.catch(err => console.log('Error while getting lesson'))
}