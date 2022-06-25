import { createModule, gql } from "graphql-modules";
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
			tasks: (parent) => readTasks({studentId: parent.id})
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