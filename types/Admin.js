import { createModule, gql } from "graphql-modules";
import { createAdmin, readAdmin, readAdmins } from "../db_functions/Admin.js";

export const AdminModule = createModule({
  id: "admin",
  typeDefs: gql`
    type Admin implements User {
      id: ID!
      firstName: String!
      lastName: String
      email: String!
      password: String!
    }

    type Query {
      allAdmins: [Admin]!
      admin(id: ID!): Admin
    }

    type Mutation {
      newAdmin(email: String!, password: String!): HTTPResponse
    }
  `,
  resolvers: {
    Query: {
      allAdmins: () => readAdmins(),
      admin: (_, args) => readAdmin(args)
    },
    Mutation: {
      newAdmin: (_, args) => createAdmin(args)
    }
  }
})