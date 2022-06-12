import mongoose from "mongoose";
import { unpackMultipleDocuments } from "../utils/unpackDocument.js";
const schemaTypes = mongoose.Schema.Types

export const AnnouncementSchema = mongoose.Schema({
    title: { type: schemaTypes.String, required: [true, "This field cannot be empty."] },
    moduleId: { type: schemaTypes.String, required: [true, "This field cannot be empty."] },
    content: { type: schemaTypes.String, required: false },
    authorId: { type: schemaTypes.String, required: [true, "This field cannot be empty."] },
    date: { type: schemaTypes.String, required: [true, "This field cannot be empty."] },
    readBy: { type: [schemaTypes.String], required: [true, "This field cannot be empty."] },
})

export const AnnouncementObject = mongoose.model('Announcement', AnnouncementSchema)

export const createAnnouncement = (announcement) => {
    const httpResponse = new AnnouncementObject({...announcement}).save()
        .then(res => ({completed: res.title}))
        .catch(err => ({error: err}))
    return httpResponse
}

export const readAnnouncements = (params) => {
	return AnnouncementObject.find(params)
		.then(unpackMultipleDocuments)
		.catch(err => console.log('Error while getting announcements'))
}

export const updateAnnouncement = (query, update) => {
    return AnnouncementObject.findOneAndUpdate(query, update, {upsert: true, new: true})
        .then(res => {response: res.title})
        .catch(err => {error: err})
}

export const deleteAnnouncement = (params) => {
    return AnnouncementObject.findOneAndDelete(params)
        .then(res => ({response: "Deleted"}))
        .catch(err => {error: err})
}