import { createModule, gql } from "graphql-modules";

export const Folder = createModule({
  id: "folder",

  typeDefs: gql`
    type Folder {
      id: ID!
      title: String!
      parentFolder: ID
      openDate: String
      closeDate: String
    }
  `,
});
