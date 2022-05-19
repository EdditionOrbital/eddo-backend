import mongoose from "mongoose";
import { ModuleTakenSchema } from "./ModuleTakenSchema.js";
const schemaTypes = mongoose.Schema.Types

export const StudentSchema = mongoose.Schema({
    id: { type: schemaTypes.String, required: true },
    firstName: { type: schemaTypes.String, required: true },
    lastName: { type: schemaTypes.String, required: false },
    modules: { type: [ModuleTakenSchema], required: true },
    email: { type: schemaTypes.String, required: true },
    password: { type: schemaTypes.String, required: true },
    mYear: { type: schemaTypes.Number, required: true },
})

const Student = mongoose.model('Student', StudentSchema)

export default Student