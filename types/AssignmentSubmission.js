import { createModule, gql } from "graphql-modules";
import { createAssignmentSubmission, deleteAssignmentSubmission, readAssignmentSubmission, updateAssignmentSubmission } from "../db_functions/AssignmentSubmission.js";

export const AssignmentSubmissionModule = createModule({
	id: "assignment-submission",
	typeDefs: gql`
		type AssignmentSubmission {
			_id: ID!
			date: String!
			studentId: String!
			assignmentId: ID!
			files: [String!]!
			score: Float!
		}
		type Query {
			readAssignmentSubmission(_id: ID!): AssignmentSubmission
		}
		type Mutation {
			createAssignmentSubmission(assignmentId: ID!, files: [String!]!): HTTPResponse
			updateAssignmentSubmission(_id: ID!, score: Float!): HTTPResponse
			deleteAssignmentSubmission(_id: ID!): HTTPResponse
		}
	`,
	resolvers: {
		Query: {
			readAssignmentSubmission: (_, args) => readAssignmentSubmission(args)
		},
		Mutation: {
			createAssignmentSubmission: (_, args, context) => createAssignmentSubmission({...args, studentId: context.id }),
			updateAssignmentSubmission: (_, args) => updateAssignmentSubmission({ _id: args._id }, args),
			deleteAssignmentSubmission: (_, args) => deleteAssignmentSubmission(args)
		}
	}
})