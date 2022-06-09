import { createModule, gql } from "graphql-modules";
import { createStudent, readStudent, readStudents } from "../db_functions/Student.js";

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

    type Mutation {
      registerStudent(id: ID!, firstName: String!, lastName: String, email: String!, password: String!, mYear: Int!): HTTPResponse
    }
  `,
  resolvers: {
    Query: {
      students: readStudents(),
      student: (_, args) => readStudent(args)
    },
    Mutation: {
      registerStudent: (_, args) => createStudent(args)
    }
  }
})