import mongoose from "mongoose";
import { unpackMultipleDocuments, unpackSingleDocument } from "../utils/unpackDocument.js";
import { ModuleTakenSchema } from "./ModuleTaken.js";
import jwt from 'jsonwebtoken'
const schemaTypes = mongoose.Schema.Types

export const StaffSchema = mongoose.Schema({
    id: { type: schemaTypes.String, required: true, unique: true },
    firstName: { type: schemaTypes.String, required: true },
    lastName: { type: schemaTypes.String, required: false },
    modules: { type: [ModuleTakenSchema], required: true, default: [] },
    email: { type: schemaTypes.String, required: true, unique: true },
    password: { type: schemaTypes.String, required: true },
    title: { type: schemaTypes.String, required: true },
})

export const StaffObject = mongoose.model('Staff', StaffSchema)

export const createStaff = (staff) => {
	var {id, firstName, lastName, email, password, title} = staff
	firstName = firstName.trim()
	lastName = lastName.trim()
	if (!/^B\d{7}[A-Z]$/.test(id)) return { error: "Matriculation number is invalid."}
    if (!/.+@nus.edu.sg/.test(email)) return { error: "Email is invalid."}
	if (!/[A-Za-z ]+/.test(lastName)) return { error: "Invalid last name entered."}
	if (lastName === '') lastName = null
	if (password.trim().length === 0) return { error: "Empty password entered."}
	if (!["AProf", "Prof", "Dr", "Mr", "Ms"].includes(title)) return { error : "Invalid title." }
	const httpResponse = new StaffObject({id, firstName, lastName, email, password, title}).save()
		.then(res => {
			console.log(`New staff created with id ${res.id}`)
			const token = jwt.sign({ id: res.id }, "nnamdi")
			return { response: token }
		})
		.catch(err => {
			return { error: err }
		})
	return httpResponse
}

export const readStaffs = (params) => {
	return StaffObject.find(params)
		.then(unpackMultipleDocuments)
		.catch(err => console.log('Error while getting staffs'))
}

export const readStaff = (params) => {
	return StaffObject.findOne(params)
		.then(unpackSingleDocument)
		.catch(err => console.log('Error while getting staff'))
}