import mongoose from "mongoose"
const schemaTypes = mongoose.Schema.Types

const FileSchema = mongoose.Schema({
    title: { type: schemaTypes.String, required: [true, "This field cannot be empty."] },
    path: { type: schemaTypes.String, required: [true, "This field cannot be empty."] },
    size: { type: schemaTypes.Decimal128, required: [true, "This field cannot be empty."] },
    parentFolder: { type: schemaTypes.ObjectId, required: [true, "This field cannot be empty."] },
    openDate: { type: schemaTypes.String, required: false },
    closeDate: { type: schemaTypes.String, required: false },
})

export const FileObject = mongoose.model('File', FileSchema)