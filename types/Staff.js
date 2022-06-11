import { createModule, gql } from "graphql-modules";
import { readStaffs, readStaff, createStaff } from "../db_functions/Staff.js";

export const StaffModule = createModule({  
	id: "staff",
	typeDefs: gql`
		type Staff implements User {
			id: ID!
			firstName: String!
			lastName: String
			modules: [ModuleTaken!]!
			email: String!
			password: String!
			title: String!
		}

		type Query {
			readStaffs: [Staff]! # resolver field
			readStaff(id: ID!): Staff # resolver field
		}

		type Mutation {
			createStaff(id: ID!, firstName: String!, lastName: String, email: String!, password: String!, title: String!): HTTPResponse
		}
	`,
	resolvers: {
		Query: {
			readStaffs: () => readStaffs(),
			readStaff: (_, args) => readStaff(args)
		},
		Mutation: {
			createStaff: (_, args) => createStaff(args)
		}
	}
})