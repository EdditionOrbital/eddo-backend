import { createModule, gql } from "graphql-modules";
import { createAssignmentSubmission, deleteAssignmentSubmission, readAssignmentSubmission, updateAssignmentSubmission } from "../db_functions/AssignmentSubmission.js";
import { readStudent } from "../db_functions/Student.js";

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
			student: Student
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
		AssignmentSubmission: {
			student: (parent) => readStudent({ id: parent.studentId })
		},
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