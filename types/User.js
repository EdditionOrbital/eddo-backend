import { createModule, gql } from "graphql-modules";
import { getStudent } from "./Student.js";

export const UserModule = createModule({
  id: "user",
  typeDefs: gql`
    interface User {
      id: ID!
      firstName: String!
      lastName: String
      modules: [ModuleTaken!]!
      email: String!
      password: String!
    }

    type Query {
      currentUser: User
    }
  `,

  resolvers: {
    User: {
      __resolveType: (obj, context, info) => {
        return obj.mYear === undefined || obj.mYear === null ? 'Professor' : 'Student'
      }
    },
    Query: {
      currentUser: (parent, args, context) => getStudent({id:context.id})
    }
  }

});