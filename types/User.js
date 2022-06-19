import { createModule, gql } from "graphql-modules";
import { readStaff } from "../db_functions/Staff.js";
import { readStudent } from "../db_functions/Student.js";
import jwt from 'jsonwebtoken'

export const UserModule = createModule({
	id: "user",
	typeDefs: gql`
		interface User {
			id: ID!
			firstName: String!
			lastName: String
			email: String!
			password: String!
			modules: [ModuleTaken!]!
		}

		type EddoAppContext {
			currentUser: User
			dbInitialised: Boolean
		}

		type Query {
			currentUser: User
		}

		type Mutation {
			login(email: String!, password: String!): HTTPResponse
		}
	`,
	resolvers: {
		User: {
			__resolveType: (obj) => obj.mYear ? 'Student' : 'Staff'
		},
		Query: {
			currentUser: async (_, __, context) => {
				var user = await readStudent({ id: context.id })
				if (!user) { user = await readStaff({ id:context.id })}
				return user
			}
		},
		Mutation: {
			login: async (_, args) => {
				const { email, password } = args;
				var user = await readStudent({email: email})
				if (!user) user = await readStaff({email: email})
				if (!user) return { error: "Email is not in our database." };
				const valid = password === user.password;
				if (!valid) return { error: "Incorrect password entered." };
				return { response: jwt.sign({ id: user.id }, "nnamdi") };
			}
		}
	}
});