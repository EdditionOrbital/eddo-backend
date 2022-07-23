import { createModule, gql } from "graphql-modules";
import { createAssignment, deleteAssignment, readAssignment, updateAssignment } from "../db_functions/Assignment.js";
import { readAssignmentSubmissions } from "../db_functions/AssignmentSubmission.js";

export const AssignmentModule = createModule({
	id: "assignment",
	typeDefs: gql`
		type Assignment {
			_id: ID!
			open: String!
			close: String!
			title: String!
			moduleId: String!
			instructions: String!
			files: [String!]!
			maxScore: Float!
			submissions: [AssignmentSubmission!]!
		}
		type Query {
			readAssignment(_id: ID!): Assignment
		}
		type Mutation {
			createAssignment(open: String!, close: String!, title: String!, moduleId: String!, instructions: String!, files: [String!]!, maxScore: Float): HTTPResponse
			updateAssignment(_id: ID!, open: String, close: String, title: String, instructions: String, files: [String!], maxScore: Float): HTTPResponse
			deleteAssignment(_id: ID!): HTTPResponse
		}
	`,
	resolvers: {
		Assignment: {
			submissions: (parent) => readAssignmentSubmissions({ assignmentId: parent._id })
		},
		Query: {
			readAssignment: (_, args) => readAssignment(args)
		},
		Mutation: {
			createAssignment: (_, args) => createAssignment(args),
			updateAssignment: (_, args) => updateAssignment({ _id: args._id }, args),
			deleteAssignment: (_, args) => deleteAssignment(args)
		}
	}
})