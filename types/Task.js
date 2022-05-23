import { createModule, gql } from "graphql-modules";
import mongoose from "mongoose";
import { unpackMultipleDocuments, unpackSingleDocument } from "../utils/unpackDocument.js";
import { ModuleTakenSchema } from "./ModuleTaken.js";
import { getStudent } from "./Student.js";
const schemaTypes = mongoose.Schema.Types

export const TaskSchema = mongoose.Schema({
    studentId: { type: schemaTypes.String, required: true },
    title: { type: schemaTypes.String, required: true },
    status: { type: schemaTypes.String, required: true },
    date: { type: schemaTypes.String, required: false },
})

export const Task = mongoose.model('Task', StudentSchema)

export const getAllTasks = () => Task.find({}).then(unpackMultipleDocuments).catch(err => console.log('Error while getting all tasks'))
export const getUserTasks = (id) => Task.find({id:id}).then(unpackMultipleDocuments).catch(err => console.log('Error while getting student tasks'))

export const TaskModule = createModule({
  id: "task",
  typeDefs: gql`
    type Task {
        studentId: String!
        title: String!
        status: String!
        date: String
    }


    type Query {
        currentUserTasks: [Task!]!
    }
  `,
  resolvers: {
      Query: {
          currentUserTasks: (parent, args, context) => {
            return getUserTasks(context.id)
          }
      }
  }

})