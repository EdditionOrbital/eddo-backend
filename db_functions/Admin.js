import mongoose from "mongoose";
import { unpackMultipleDocuments, unpackSingleDocument } from "../utils/unpackDocument.js";
import jwt from 'jsonwebtoken'
import uniqueValidator from 'mongoose-unique-validator'

const schemaTypes = mongoose.Schema.Types

export const AdminSchema = mongoose.Schema({
    id: { type: schemaTypes.String, required: true, unique: true },
    firstName: { type: schemaTypes.String, required: true },
    lastName: { type: schemaTypes.String, required: false },
    email: { type: schemaTypes.String, required: true, unique: true },
    password: { type: schemaTypes.String, required: true }
})

AdminSchema.plugin(uniqueValidator)

export const AdminObject = mongoose.model('Admin', AdminSchema)

export const createAdmin = (admin) => {
	var { email, password } = admin
	if (!/.+@u.nus.edu/.test(email)) return { error: "Email is invalid."}
	if (password.trim().length === 0) return { error: "Empty password entered."}
	return new AdminObject({email, password, firstName: 'Admin', id: new mongoose.Types.ObjectId()})
		.save()
		.then(res => {
			console.log(`New admin created with id ${res.id}`)
			const token = jwt.sign({ id: res.id }, "nnamdi")
			return { response: token }
		})
		.catch(err => {
			return { error: err }
		})
}

export const readAdmins = (params) => {
	return AdminObject.find(params)
		.then(unpackMultipleDocuments)
		.catch(err => console.log('Error while getting admins'))
}

export const readAdmin = (params) => {
	return AdminObject.findOne(params)
		.then(unpackSingleDocument)
		.catch(err => console.log('Error while getting single admin'))
}