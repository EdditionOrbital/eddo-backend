import { createModule, gql } from "graphql-modules";
import { unpackMultipleDocuments, unpackSingleDocument } from "../utils/unpackDocument.js";
import mongoose from "mongoose"
import { FolderSchema } from "./Folder.js"
import { getStudent } from "./Student.js";
const schemaTypes = mongoose.Schema.Types

const ModuleSchema = mongoose.Schema({
    id: { type: schemaTypes.String, required: true },
    title: { type: schemaTypes.String, required: true },
    description: { type: schemaTypes.String, required: false },
    credits: { type: schemaTypes.Decimal128, required: false },
    files: { type: [FolderSchema], required: true },
})

export const Module = mongoose.model('Module', ModuleSchema)

export const getAllModules = () => Module.find().then(unpackMultipleDocuments)
export const getSelectedModules = (params) => Module.find(params).then(unpackMultipleDocuments)
export const getModule = (params) => Module.findOne(params).then(unpackSingleDocument)

export const ModuleModule = createModule({
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

      type Query {
        modules(year: Int, sem: Int): [Module!]!
        module(id: ID!): Module 
        currentUserModules: [Module!]!
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
    Query: {
      modules: (parent, args, context) => {
        const { year, sem } = args
        const yearFilter = (module) =>
          year === null || year === undefined
            ? true
            : parseInt(module.id.split("-")[1]) === year;
        const semFilter = (module) =>
          sem === null || sem === undefined
            ? true
            : parseInt(module.id.split("-")[2]) === sem;
        const modules = getAllModules()
        return modules.filter((m) => yearFilter(m) && semFilter(m))
      },
      module: (parent, args, context) => getModule({id:args.id}),
      currentUserModules: async (parent, args, context) => {
        const student = await getStudent({id:context.id})
        const lst = student.modules.map(x => x.moduleId)
        const modules = await getAllModules()
        if (!lst.length) return []
        return modules.filter((module) => lst.includes(module.id))
      }
    }
  },
});
