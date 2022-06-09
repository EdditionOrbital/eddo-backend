import jwt from "jsonwebtoken"
import mongoose from "mongoose"
import { unpackMultipleDocuments, unpackSingleDocument } from "../utils/unpackDocument.js"
import { ModuleTakenSchema } from "./ModuleTaken.js"
import uniqueValidator from 'mongoose-unique-validator'

const schemaTypes = mongoose.Schema.Types

export const StudentSchema = mongoose.Schema({
    id: { type: schemaTypes.String, required: true, unique: true },
    firstName: { type: schemaTypes.String, required: true },
    lastName: { type: schemaTypes.String, required: false },
    modules: { type: [ModuleTakenSchema], required: true, default: [] },
    email: { type: schemaTypes.String, required: true, unique: true },
    password: { type: schemaTypes.String, required: true },
    mYear: { type: schemaTypes.Number, required: true },
})

StudentSchema.plugin(uniqueValidator)

export const StudentObject = mongoose.model('Student', StudentSchema)

export const createStudent = (student) => {
	var {id, firstName, lastName, email, password, mYear} = student
	firstName = firstName.trim()
	lastName = lastName.trim()
	if (!/^A\d{7}[A-Z]$/.test(id)) return { error: "Matriculation number is invalid."}
    if (!/.+@u.nus.edu/.test(email)) return { error: "Email is invalid."}
	if (!/[A-Za-z ]+/.test(lastName)) return { error: "Invalid last name entered."}
	if (lastName === '') lastName = null
	if (password.trim().length === 0) return { error: "Empty password entered."}
	if (![2018, 2019, 2020, 2021].includes(mYear)) return { error : "Invalid matriculation year." }
	const httpResponse = new StudentObject({id, firstName, lastName, email, password, mYear}).save()
		.then(res => {
			console.log(`New student created with id ${res.id}`)
			const token = jwt.sign({ id: res.id }, "nnamdi")
			return { response: token }
		})
		.catch(err => {
			return { error: err }
		})
	return httpResponse
}

export const readStudents = (params) => {
	return StudentObject.find(params)
		.then(unpackMultipleDocuments)
		.catch(err => console.log('Error while getting students'))
}

export const readStudent = (params) => {
	return StudentObject.findOne(params)
		.then(unpackSingleDocument)
		.catch(err => console.log('Error while getting student'))
}

