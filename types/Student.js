import { createModule, gql } from "graphql-modules";
import { readAssignmentSubmission, readAssignmentSubmissions } from "../db_functions/AssignmentSubmission.js";
import { readQuizSubmissions } from "../db_functions/QuizSubmission.js";
import { createStudent, readStudent, readStudents } from "../db_functions/Student.js";
import { readTasks } from "../db_functions/Task.js";

export const StudentModule = createModule({
	id: "student",
	typeDefs: gql`
		type Student implements User {
			id: ID!
			firstName: String!
			lastName: String
			modules: [ModuleTaken!]!
			email: String!
			password: String!
			mYear: Int!
			tasks: [Task!]!
			assignmentSubmissions: [AssignmentSubmission!]!
			quizSubmissions: [QuizSubmission!]!
		}

		type Query {
			readStudents: [Student]! # resolver field
			readStudent(id: ID!): Student # resolver field
		}

		type Mutation {
			createStudent(id: ID!, firstName: String!, lastName: String, email: String!, password: String!, mYear: Int!): HTTPResponse
		}
	`,
	resolvers: {
		Student: {
			tasks: (parent) => readTasks({studentId: parent.id}),
			assignmentSubmissions: (parent, args) => readAssignmentSubmissions({ studentId: parent.id }),
			quizSubmissions: (parent) => readQuizSubmissions({ studentId: parent.id })
		},
		Query: {
			readStudents: (_, args) => readStudents(args),
			readStudent: (_, args) => readStudent(args)
		},
		Mutation: {
			createStudent: (_, args) => createStudent(args)
		}
	}
})