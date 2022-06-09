import mongoose from "mongoose"
const schemaTypes = mongoose.Schema.Types

const FileSchema = mongoose.Schema({
    title: { type: schemaTypes.String, required: true },
    path: { type: schemaTypes.String, required: true },
    size: { type: schemaTypes.Decimal128, required: true },
    parentFolder: { type: schemaTypes.ObjectId, required: true },
    openDate: { type: schemaTypes.String, required: false },
    closeDate: { type: schemaTypes.String, required: false },
})

export const FileObject = mongoose.model('File', FileSchema)