import { createModule, gql } from "graphql-modules";
import { readFileSync } from "fs";

const readJsonFile = (path) => JSON.parse(readFileSync(path));

const modules = readJsonFile("./test-data/modules.json");
const lessons = readJsonFile("./test-data/lessons.json");
const students = readJsonFile("./test-data/students.json");

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
        return lessons.filter(
          (lesson) => typeFilter(lesson) && lesson.moduleId === parent.id
        );
      },
      lesson: (parent, args, context) => {
        const { code } = args;
        return lessons.filter(
          (lesson) => lesson.moduleId === parent.id && lesson.code === code
        );
      },
      students: (parent, args, context) =>
        students.filter((student) =>
          student.modules.map((mt) => mt.moduleId).includes(parent.id)
        ),
    },
  },
});
