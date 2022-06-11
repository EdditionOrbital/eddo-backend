import { createModule, gql } from "graphql-modules";
import { createStudent, readStudent, readStudents } from "../db_functions/Student.js";

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
		Query: {
			readStudents: readStudents(),
			readStudent: (_, args) => readStudent(args)
		},
		Mutation: {
			createStudent: (_, args) => createStudent(args)
		}
	}
})