import { createModule, gql } from "graphql-modules";
import Lesson from "../schema/LessonSchema.js";
import Student from "../schema/StudentSchema.js";
import { unpackMultipleDocuments } from "./unpackDocument.js";

export const Module = createModule({
  id: "module",
  typeDefs: [
    gql`
      type Module {
        id: ID!
        title: String!
        description: String
        credits: Float
        files: Folder
        code: String # resolver field
        year: Int # resolver field
        semester: Int # resolver field
        lessons(type: String): [Lesson] # resolver field
        lesson(code: String!): Lesson # resolver field
        students: [Student] # resolver field
      }
    `,
  ],
  resolvers: {
    Module: {
      code: (parent, args, context) => parent.id.split("-")[0],
      year: (parent, args, context) => parent.id.split("-")[1],
      semester: (parent, args, context) => parent.id.split("-")[2],
      lessons: (parent, args, context) => {
        const { type } = args;
        const typeFilter = (lesson) =>
          type === null || type === undefined
            ? true
            : lesson.lessonType === type;
        const lessons = Lesson.find().then(unpackMultipleDocuments)
        return lessons.filter(
          (lesson) => typeFilter(lesson) && lesson.moduleId === parent.id
        );
      },
      lesson: (parent, args, context) => {
        const { code } = args;
        const lessons = Lesson.find().then(unpackMultipleDocuments)
        return lessons.filter(
          (lesson) => lesson.moduleId === parent.id && lesson.code === code
        );
      },
      students: (parent, args, context) => {
        const students = Student.find().then(unpackMultipleDocuments)
        return students.filter((student) =>
          student.modules.map((mt) => mt.moduleId).includes(parent.id)
        )
      },
    },
  },
});
