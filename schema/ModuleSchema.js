import mongoose from "mongoose"
import { FolderSchema } from "./FolderSchema.js"
const schemaTypes = mongoose.Schema.Types

const ModuleSchema = mongoose.Schema({
    id: { type: schemaTypes.String, required: true },
    title: { type: schemaTypes.String, required: true },
    description: { type: schemaTypes.String, required: false },
    credits: { type: schemaTypes.Decimal128, required: false },
    files: { type: [FolderSchema], required: true },
})

const Module = mongoose.model('Module', ModuleSchema)

export default Module