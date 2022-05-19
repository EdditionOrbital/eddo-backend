import { createModule, gql } from "graphql-modules";
import Student from "../schema/StudentSchema.js";
import { unpackMultipleDocuments } from "./unpackDocument.js";

export const Lesson = createModule({
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
