import { createModule, gql } from "graphql-modules";
import { getStaff } from "./Staff.js";
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
        return obj.mYear === undefined || obj.mYear === null ? 'Staff' : 'Student'
      }
    },
    Query: {
      currentUser: async (parent, args, context) => {
        var user = await getStudent({id:context.id})
        if (!user) {
          user = await getStaff({id:context.id})
        }
        return user
      }
    }
  }

});