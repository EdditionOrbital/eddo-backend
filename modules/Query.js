import { createModule, gql } from "graphql-modules";
import { readFileSync } from "fs";

const readJsonFile = (path) => JSON.parse(readFileSync(path));

const modules = readJsonFile("./test-data/modules.json");
const lessons = readJsonFile("./test-data/lessons.json");
const students = readJsonFile("./test-data/students.json");

export const Query = createModule({
  id: "query",
  typeDefs: [
    gql`
      type Query {
        students: [Student] # resolver field
        student(id: ID!): Student # resolver field
        modules(year: Int, sem: Int): [Module] # resolver field
        module(id: ID!): Module # resolver field
        currentUser: Student # resover field
      }
    `,
  ],
  resolvers: {
    Query: {
      students: () => students,
      modules: (parent, args, context) => {
        const { year, sem } = args;
        const yearFilter = (module) =>
          year === null || year === undefined
            ? true
            : parseInt(module.id.split("-")[1]) === year;
        const semFilter = (module) =>
          sem === null || sem === undefined
            ? true
            : parseInt(module.id.split("-")[2]) === sem;
        return modules.filter(
          (module) => yearFilter(module) && semFilter(module)
        );
      },
      student: (parent, args, context) =>
        students.find((student) => student.id === args.id),
      module: (parent, args, context) =>
        modules.find((module) => module.id === args.id),
      currentUser: (parent, args, context) => {
        const student = students.find((student) => student.id === context.id);
        return student;
      },
    },
  },
});
