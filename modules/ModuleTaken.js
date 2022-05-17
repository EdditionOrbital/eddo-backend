import { createModule, gql } from "graphql-modules";

export const ModuleTaken = createModule({
  id: "module-taken",
  typeDefs: [
    gql`
      type ModuleTaken {
        moduleId: ID!
        lessons: [ID!]!
        role: Role
      }
    `,
  ],
});
