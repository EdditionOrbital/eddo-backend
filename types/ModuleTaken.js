import { createModule, gql } from "graphql-modules";
import mongoose from "mongoose";
const schemaTypes = mongoose.Schema.Types

export const ModuleTakenSchema = mongoose.Schema({
    moduleId: { type: schemaTypes.String, required: true },
    lessons: { type: [schemaTypes.String], required: true },
    role: { type: schemaTypes.String, required: true },
})

export const ModuleTaken = mongoose.model('ModuleTaken', ModuleTakenSchema)

export const ModuleTakenModule = createModule({
  id: "module-taken",
  typeDefs: [
    gql`
      type ModuleTaken {
        moduleId: ID!
        lessons: [ID!]!
        role: Role!
      }
    `,
  ],
});
