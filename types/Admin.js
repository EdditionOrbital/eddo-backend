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
      readAdmins: [Admin]!
      readAdmin(id: ID!): Admin
    }

    type Mutation {
      createAdmin(email: String!, password: String!): HTTPResponse
    }
  `,
  resolvers: {
    Query: {
      readAdmins: () => readAdmins(),
      readAdmin: (_, args) => readAdmin(args)
    },
    Mutation: {
      createAdmin: (_, args) => createAdmin(args)
    }
  }
})