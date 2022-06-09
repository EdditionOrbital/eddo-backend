import { createModule, gql } from "graphql-modules";
import { readAdmins } from "../db_functions/Admin.js";
import { readStaff } from "../db_functions/Staff.js";
import { readStudent } from "../db_functions/Student.js";
import jwt from 'jsonwebtoken'

export const UserModule = createModule({
  id: "user",
  typeDefs: gql`
    interface User {
      id: ID!
      firstName: String!
      lastName: String
      email: String!
      password: String!
    }

    type CurrentUserResponse {
      user: User
      dbInitialised: Boolean
    }

    type Query {
      currentUser: CurrentUserResponse
    }

    type Mutation {
      login(email: String!, password: String!): HTTPResponse
    }
  `,
  resolvers: {
    User: {
      __resolveType: (obj) => obj.mYear === undefined || obj.mYear === null ? 'Staff' : 'Student'
    },
    Query: {
      currentUser: async (_, __, context) => {
        const admins = await readAdmins()
        if (!admins.length) return { dbInitialised: false }
        var user = await readStudent({id: context.id})
        if (!user) { user = await readStaff({id:context.id})}
        return { user: user, dbInitialised: true }
      }
    },
    Mutation: {
      login: async (_, args) => {
        const { email, password } = args;
        const student = await readStudent({email: email})
        const staff = await readStaff({email: email})
        const user = !student ? staff : student
        if (!user) return { error: "Email is not in our database." };
        const valid = password === user.password;
        if (!valid) return { error: "Incorrect password entered." };
        return { response: jwt.sign({ id: user.id }, "nnamdi") };
      }
    }
  }
});