import mongoose from "mongoose"
const schemaTypes = mongoose.Schema.Types

export const FolderSchema = mongoose.Schema({
    title: { type: schemaTypes.String, required: [true, "This field cannot be empty."] },
    parentFolder: { type: schemaTypes.ObjectId, required: false },
    openDate: { type: schemaTypes.String, required: false },
    closeDate: { type: schemaTypes.String, required: false },
})

export const FolderObject = mongoose.model('Folder', FolderSchema)