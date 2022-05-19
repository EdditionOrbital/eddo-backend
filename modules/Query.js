import { createModule, gql } from "graphql-modules";
import Module from "../schema/ModuleSchema.js";
import Student from "../schema/StudentSchema.js";
import { unpackMultipleDocuments, unpackSingleDocument } from "./unpackDocument.js";

export const Query = createModule({
  id: "query",
  typeDefs: [
    gql`
      type Query {
        students: [Student]! # resolver field
        student(id: ID!): Student # resolver field
        modules(year: Int, sem: Int): [Module!]! # resolver field
        module(id: ID!): Module # resolver field
        currentUser: User # resolver field
      }
    `,
  ],
  resolvers: {
    Query: {
      students: () => Student.find({}).then(unpackMultipleDocuments),
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
        const modules = Module.find().then(unpackMultipleDocuments)
        return modules.filter(
          (module) => yearFilter(module) && semFilter(module)
        )
      },
      student: (parent, args, context) =>
        Student.findOne({ id: args.id }).then(unpackSingleDocument),
      module: (parent, args, context) =>
        Module.findOne({id: args.id}).then(unpackSingleDocument),
      currentUser: (parent, args, context) => {
        const student = Student.findOne({id : context.id}).then(unpackSingleDocument);
        return student;
      },
    },
  },
});
