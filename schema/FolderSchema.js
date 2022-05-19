import mongoose from "mongoose"
const schemaTypes = mongoose.Schema.Types

export const FolderSchema = mongoose.Schema({
    title: { type: schemaTypes.String, required: true },
    parentFolder: { type: schemaTypes.ObjectId, required: false },
    openDate: { type: schemaTypes.String, required: false },
    closeDate: { type: schemaTypes.String, required: false },
})

const Folder = mongoose.model('Folder', FolderSchema)

export default Folder
