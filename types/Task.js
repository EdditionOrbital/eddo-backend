import { createModule, gql } from "graphql-modules";
import { createTask, deleteTask, readTasks, updateTask } from "../db_functions/Task.js";

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
        newTask(title: String, status: String): HTTPResponse
        updateTask(_id: ID!, title: String, status: String): HTTPResponse
        deleteTask(_id: ID!): HTTPResponse
    }
  `,
  resolvers: {
      Query: {
          currentUserTasks: (_, __, context) => readTasks({studentId: context.id})
      },
      Mutation: {
          newTask: (_, args, context) => createTask({...args, studentId: context.id}),
          updateTask: async (_, args) => updateTask({_id: args._id}, args),
          deleteTask: (_, args) => deleteTask(args)
      }
  }
})