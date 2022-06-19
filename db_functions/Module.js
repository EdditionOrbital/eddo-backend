import { unpackMultipleDocuments, unpackSingleDocument } from "../utils/unpackDocument.js";
import mongoose from "mongoose"
const schemaTypes = mongoose.Schema.Types

const ModuleSchema = mongoose.Schema({
	id: { type: schemaTypes.String, required: [true, "This field cannot be empty."] },
	title: { type: schemaTypes.String, required: [true, "This field cannot be empty."] },
	description: { type: schemaTypes.String, required: false },
	credits: { type: schemaTypes.Decimal128, required: false }
})

export const ModuleObject = mongoose.model('Module', ModuleSchema)

export const readModules = (params) => {
	return ModuleObject.find(params)
		.then(unpackMultipleDocuments)
		.catch((err) => console.log("Error while getting modules"));
}

export const readModule = (params) => {
	return ModuleObject.findOne(params)
		.then(unpackSingleDocument)
		.catch((err) => console.log("Error while getting module"));
}