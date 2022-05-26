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

export const Task = mongoose.model('Task', TaskSchema)

export const getAllTasks = () => Task.find({}).then(unpackMultipleDocuments).catch(err => console.log('Error while getting all tasks'))
export const getUserTasks = (id) => Task.find({studentId: id}).then(unpackMultipleDocuments).catch(err => console.log('Error while getting student tasks' + err))

export const TaskModule = createModule({

  id: "task",

  typeDefs: gql`
    type Task {
        _id: ID!
        studentId: String!
        title: String!
        status: String!
        date: String
    }

    type Query {
        currentUserTasks: [Task!]!
    }

    type Mutation {
        newTask(title: String, status: String): MutationResponse
        updateTask(_id: ID!, title: String, status: String): MutationResponse
        deleteTask(_id: ID!): MutationResponse
    }

  `,
  
  resolvers: {
      Query: {
          currentUserTasks: async (parent, args, context) => {
            const tasks = await getUserTasks(context.id)
            if (tasks === undefined || tasks === null) return []
            return tasks
          }
      },
      Mutation: {
          newTask: (parent, args, context) => {
            const studentId = context.id
            const { title, status } = args
            const date = null
            const resp = new Task({
              studentId,
              title,
              status,
              date
            }).save().then(result => ({ completed: result._id}))
            .catch(err => ({ error: err}))
            return resp
          },
          updateTask: async (parent, args, context) => {
            const { _id, title, status } = args
            const doc = await Task.findOne({_id: _id })
            doc.title = title
            doc.status = status
            return doc.save().then(result => ({ completed: result._id })).catch(err => ({ error: err })) 
          },
          deleteTask: (parent, args, context) => {
            return Task.deleteOne({_id: args._id}).then(() => ({completed: 'Deleted'})).catch(err => ({error:err}))
          }
      }
  }

})