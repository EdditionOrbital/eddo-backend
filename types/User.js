import { createModule, gql } from "graphql-modules";
import { readAdmin, readAdmins } from "../db_functions/Admin.js";
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
		}

		type EddoAppContext {
			currentUser: User
			dbInitialised: Boolean
		}

		type Query {
			eddoAppContext: EddoAppContext
		}

		type Mutation {
			login(email: String!, password: String!): HTTPResponse
		}
	`,
	resolvers: {
		User: {
			__resolveType: (obj) => obj.mYear || obj.title ? obj.mYear ? 'Student' : 'Staff' : 'Admin'
		},
		Query: {
			eddoAppContext: async (_, __, context) => {
				// const admins = await readAdmins()
				// if (!admins.length) return { dbInitialised: false }
				var user = await readStudent({id: context.id})
				if (!user) { user = await readStaff({id:context.id})}
				if (!user) { user = await readAdmin({id:context.id})}
				return { currentUser: user, dbInitialised: true }
			}
		},
		Mutation: {
			login: async (_, args) => {
				const { email, password } = args;
				const student = await readStudent({email: email})
				const staff = await readStaff({email: email})
				const admin = await readAdmin({email: email})
				const user = !student ? !staff ? admin : staff : student
				if (!user) return { error: "Email is not in our database." };
				const valid = password === user.password;
				if (!valid) return { error: "Incorrect password entered." };
				return { response: jwt.sign({ id: user.id }, "nnamdi") };
			}
		}
	}
});