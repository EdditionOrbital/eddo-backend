import { createModule, gql } from "graphql-modules";
import { readAssignments } from "../db_functions/Assignment.js";
import { readFiles } from "../db_functions/File.js";
import { readFolders } from "../db_functions/Folder.js";
import { readLesson, readLessons } from "../db_functions/Lesson.js";
import { readMedias } from "../db_functions/Media.js";
import { readModule, readModules } from "../db_functions/Module.js";
import { readStaff, readStaffs } from "../db_functions/Staff.js";
import { readStudent, readStudents } from "../db_functions/Student.js";

export const ModuleModule = createModule({
	id: "module",
	typeDefs: [
		gql`
			type Module {
				id: ID!
				title: String!
				description: String
				credits: Float
				code: String # resolver field
				year: Int # resolver field
				semester: Int # resolver field
				lessons(lessonType: String): [Lesson] # resolver field
				lesson(code: String!): Lesson # resolver field
				students: [Student] # resolver field
				files: [File!]!
				folders: [Folder!]!
				media: [Media!]!
				assignments: [Assignment!]!
			}

			type Query {
				readModules(year: Int!, sem: Int!): [Module!]
				readModule(id: ID!): Module 
				contextModules: [Module!]!
			}
		`,
	],
	resolvers: {
		Module: {
			code: (parent) => parent.id.split("-")[0],
			year: (parent) => parent.id.split("-")[1],
			semester: (parent) => parent.id.split("-")[2],
			lessons: (parent, args) => readLessons({moduleId: parent.id, ...args}),
			lesson: (parent, args) => readLesson({moduleId: parent.id, code: args.code}),
			students: (parent) => readStudents().then(students => students.filter(s => s.modules.map(m => m.moduleId).includes(parent.id))),
			files: (parent) => readFiles({ moduleId: parent.id }),
			folders: (parent) => readFolders({ moduleId: parent.id }),
			media: (parent) => readMedias({ moduleId: parent.id }),
			assignments: (parent) => readAssignments({ moduleId: parent.id })
		},
		Query: {
			readModules: (_, args) => readModules({ id: { $regex: new RegExp(`${args.year}-${args.sem}`, 'g')}}),
			readModule: (_, args) => readModule(args),
			contextModules: async (_, __, context) => {
				var user = await readStudent({id:context.id})
				if (!user) user = await readStaff({ id: context.id })
				const lst = user.modules.map(x => x.moduleId)
				const modules = await readModules()
				if (!lst.length) return []
				return modules.filter((module) => lst.includes(module.id))
			}
		}
	},
});
