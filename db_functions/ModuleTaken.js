import mongoose from "mongoose";
const schemaTypes = mongoose.Schema.Types

export const ModuleTakenSchema = mongoose.Schema({
    moduleId: { type: schemaTypes.String, required: true },
    lessons: { type: [schemaTypes.String], required: true },
    role: { type: schemaTypes.String, required: true },
})

export const ModuleTakenbject = mongoose.model('ModuleTaken', ModuleTakenSchema)