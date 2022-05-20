import { createModule, gql } from "graphql-modules";
import mongoose from "mongoose";
import { unpackMultipleDocuments, unpackSingleDocument } from "../utils/unpackDocument.js";
import { ModuleTakenSchema } from "./ModuleTaken.js";
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

export const Student = mongoose.model('Student', StudentSchema)

export const getAllStudents = () => Student.find({}).then(unpackMultipleDocuments).catch(err => console.log('Error while getting all students'))
export const getMultipleStudents = (params) => Student.find(params).then(unpackMultipleDocuments).catch(err => console.log('Error while getting selected students'))
export const getStudent = (params) => Student.findOne(params).then(unpackSingleDocument).catch(err => console.log('Error while getting student'))

export const StudentModule = createModule({
  id: "student",
  typeDefs: gql`
    type Student implements User {
      id: ID!
      firstName: String!
      lastName: String
      modules: [ModuleTaken!]!
      email: String!
      password: String!
      mYear: Int!
    }

    type Query {
      students: [Student]! # resolver field
      student(id: ID!): Student # resolver field
    }
  `,
  resolvers: {
    Query: {
      students: getAllStudents,
      student: (parent, args, context) => getStudent({id:args.id})
    }
  }

})