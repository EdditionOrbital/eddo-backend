import { createModule, gql } from "graphql-modules";

export const Role = createModule({
  id: "role",
  typeDefs: [
    gql`
      enum Role {
        Student
        TA
        Prof
        AProf
      }
    `,
  ],
});
