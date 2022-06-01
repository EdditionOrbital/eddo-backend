import { createModule, gql } from "graphql-modules";
import mongoose from "mongoose";
import { unpackMultipleDocuments, unpackSingleDocument } from "../utils/unpackDocument.js";
import { ModuleTakenSchema } from "./ModuleTaken.js";
const schemaTypes = mongoose.Schema.Types

export const StaffSchema = mongoose.Schema({
    id: { type: schemaTypes.String, required: true },
    firstName: { type: schemaTypes.String, required: true },
    lastName: { type: schemaTypes.String, required: false },
    modules: { type: [ModuleTakenSchema], required: true },
    email: { type: schemaTypes.String, required: true },
    password: { type: schemaTypes.String, required: true },
    title: { type: schemaTypes.String, required: true },
})

export const Staff = mongoose.model('Staff', StaffSchema)

export const getAllStaff = () => Staff.find({}).then(unpackMultipleDocuments).catch(err => console.log('Error while getting all staff'))
export const getMultipleStaff = (params) => Staff.find(params).then(unpackMultipleDocuments).catch(err => console.log('Error while getting selected staff'))
export const getStaff = (params) => Staff.findOne(params).then(unpackSingleDocument).catch(err => console.log('Error while getting single staff'))

export const StaffModule = createModule({
  
  id: "staff",

  typeDefs: gql`
    type Staff implements User {
      id: ID!
      firstName: String!
      lastName: String
      modules: [ModuleTaken!]!
      email: String!
      password: String!
      title: String!
    }

    type Query {
      allStaff: [Staff]! # resolver field
      staff(id: ID!): Staff # resolver field
    }
  `,

  resolvers: {
    Query: {
      allStaff: getAllStaff,
      staff: (parent, args, context) => getStaff({id:args.id})
    }
  }

})