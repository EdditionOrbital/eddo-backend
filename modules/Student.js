import { createModule, gql } from "graphql-modules";

export const Student = createModule({
  id: "student",

  typeDefs: gql`
    type Student implements User {
      id: ID!
      firstName: String!
      lastName: String
      modules: [ModuleTaken!]!
      email: String!
      password: String!
      mYear: Int
    }
  `,
});
