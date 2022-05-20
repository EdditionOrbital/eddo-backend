import { createModule, gql } from "graphql-modules";
import { Student } from "./Student.js";
import { unpackMultipleDocuments } from "../utils/unpackDocument.js";

import mongoose from "mongoose"
const schemaTypes = mongoose.Schema.Types

const LessonSchema = mongoose.Schema({
    code: { type: schemaTypes.String, required: true },
    moduleId: { type: schemaTypes.String, required: true },
    startTime: { type: schemaTypes.String, required: true },
    endTime: { type: schemaTypes.String, required: true },
    venue: { type: schemaTypes.String, required: false },
    day: { type: schemaTypes.String, required: true },
    weeks: { type: [schemaTypes.Number], required: true },
    lessonType: { type: schemaTypes.String, required: true },
})

export const Lesson = mongoose.model('Lesson', LessonSchema)

export const LessonModule = createModule({
  id: "lesson",

  typeDefs: gql`
    type Lesson {
      code: ID!
      moduleId: ID!
      startTime: String!
      endTime: String!
      venue: String
      day: String!
      weeks: [Int!]!
      lessonType: String!
      students: [Student!]! # resolver field
    }
  `,
  resolvers: {
    Lesson: {
      students: (parent, args, context) => {
        const students = Student.find().then(unpackMultipleDocuments)
        const moduleStudents = students.filter((student) =>
          student.modules.map((mt) => mt.moduleId).includes(parent.moduleId)
        );
        const lessonsTakenBy = (student) =>
          student.modules.find((modTaken) => modTaken === parent.moduleId)
            .lessons;
        return moduleStudents.filter((student) =>
          lessonsTakenBy(student).includes(parent.code)
        );
      },
    },
  },
});
