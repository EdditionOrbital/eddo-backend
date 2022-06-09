import { unpackMultipleDocuments, unpackSingleDocument } from "../utils/unpackDocument.js";

import mongoose from "mongoose"
const schemaTypes = mongoose.Schema.Types

const LessonSchema = mongoose.Schema({
    code: { type: schemaTypes.String, required: true },
    moduleId: { type: schemaTypes.String, required: true },
    startTime: { type: schemaTypes.String, required: true },
    endTime: { type: schemaTypes.String, required: true },
    venue: { type: schemaTypes.String, required: false },
    day: { type: schemaTypes.String, required: true },
    weeks: { type: [schemaTypes.Number], required: true },
    lessonType: { type: schemaTypes.String, required: true },
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