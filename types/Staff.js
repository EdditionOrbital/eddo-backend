import { createModule, gql } from "graphql-modules";
import { readStaffs, readStaff, createStaff } from "../db_functions/Staff.js";

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

    type Mutation {
      registerStaff(id: ID!, firstName: String!, lastName: String, email: String!, password: String!, title: String!): HTTPResponse
    }
  `,
  resolvers: {
    Query: {
      allStaff: () => readStaffs(),
      staff: (_, args) => readStaff(args)
    },
    Mutation: {
      registerStaff: (_, args) => createStaff(args)
    }
  }
})