import { createModule, gql } from "graphql-modules";

export const User = createModule({
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
  `,

  resolvers: {
    User: {
      __resolveType: (obj, context, info) => {
        return obj.mYear === undefined ? 'Professor' : 'Student'
      }
    }
  }

});