import { createModule, gql } from "graphql-modules";
import { readStudent, readStudents } from "../db_functions/Student.js";
import { readLesson, readLessons } from "../db_functions/Lesson.js";

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

		type Query {
			contextLessons: [Lesson!]!
			readLessons(moduleId: ID): [Lesson!]!
			readLesson(moduleId: ID!, code: ID!): Lesson
		}
	`,
	resolvers: {
		Lesson: {
			students: async (parent) => {
				const students = await readStudents()
				const moduleStudents = students.filter((student) =>
					student.modules.map((mt) => mt.moduleId).includes(parent.moduleId)
				);
				const lessonsTakenBy = (student) => student.modules.find((modTaken) => modTaken === parent.moduleId).lessons
				return moduleStudents.filter((student) =>
					lessonsTakenBy(student).includes(parent.code)
				);
			},
		},
		Query: {
			readLessons: (_, args) => readLessons(args),
			readLesson: (_, args) => readLesson(args),
			contextLessons: async (_, __, context) => {
				const student = await readStudent({id: context.id})
				const lst = student.modules.map(x => x.moduleId)
				const allLessons = await readLessons()
				if (!lst.length) return []
				return allLessons.filter(l => lst.includes(l.moduleId))
		}
	},
}})
