import { createModule, gql } from "graphql-modules";
import { readFileSync } from "fs";

const readJsonFile = (path) => JSON.parse(readFileSync(path));

const modules = readJsonFile("./test-data/modules.json");
const lessons = readJsonFile("./test-data/lessons.json");
const students = readJsonFile("./test-data/students.json");

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
      students: [Student] # resolver field
    }
  `,
  resolvers: {
    Lesson: {
      students: (parent, args, context) => {
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
