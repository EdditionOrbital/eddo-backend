import mongoose from "mongoose";
import { unpackMultipleDocuments } from "../utils/unpackDocument.js";
const schemaTypes = mongoose.Schema.Types

export const AnnouncementSchema = mongoose.Schema({
    title: { type: schemaTypes.String, required: true },
    moduleId: { type: schemaTypes.String, required: true },
    content: { type: schemaTypes.String, required: false },
    authorId: { type: schemaTypes.String, required: true },
    date: { type: schemaTypes.String, required: true },
    readBy: { type: [schemaTypes.String], required: true },
})

export const AnnouncementObject = mongoose.model('Announcement', AnnouncementSchema)

export const readAnnouncements = (params) => {
	return AnnouncementObject.find(params)
		.then(unpackMultipleDocuments)
		.catch(err => console.log('Error while getting announcements'))
}