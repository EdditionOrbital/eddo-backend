import { createModule, gql } from "graphql-modules";
import mongoose from "mongoose"
const schemaTypes = mongoose.Schema.Types

export const FolderSchema = mongoose.Schema({
    title: { type: schemaTypes.String, required: true },
    parentFolder: { type: schemaTypes.ObjectId, required: false },
    openDate: { type: schemaTypes.String, required: false },
    closeDate: { type: schemaTypes.String, required: false },
})

export const Folder = mongoose.model('Folder', FolderSchema)

export const FolderModule = createModule({
  id: "folder",

  typeDefs: gql`
    type Folder {
      _id: ID!
      title: String!
      parentFolder: ID
      openDate: String
      closeDate: String
    }
  `,
});
