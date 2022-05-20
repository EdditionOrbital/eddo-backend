import { createModule, gql } from "graphql-modules";
import mongoose from "mongoose"
const schemaTypes = mongoose.Schema.Types

const FileSchema = mongoose.Schema({
    title: { type: schemaTypes.String, required: true },
    path: { type: schemaTypes.String, required: true },
    size: { type: schemaTypes.Decimal128, required: true },
    parentFolder: { type: schemaTypes.ObjectId, required: true },
    openDate: { type: schemaTypes.String, required: false },
    closeDate: { type: schemaTypes.String, required: false },
})

export const File = mongoose.model('File', FileSchema)

export const FileModule = createModule({
  id: "file",
  typeDefs: gql`
    type File {
      _id: ID!
      title: String!
      path: String!
      size: Float!
      parentFolder: ID!
      openDate: String
      closeDate: String
    }
  `,
});