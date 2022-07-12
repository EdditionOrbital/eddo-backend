import { createModule, gql } from "graphql-modules";
import { createQuizSubmission, deleteQuizSubmission, readQuizSubmission, updateQuizSubmission } from "../db_functions/QuizSubmission.js";

export const QuizSubmissionModule = createModule({
	id: "quiz-submission",
	typeDefs: gql`
		type QuizResponse {
			questionId: String
			options: [String]
		}
		input QuizResponseInput {
			questionId: String
			options: [String]
		}
		type QuizSubmission {
			_id: ID!
			date: String!
			studentId: String!
			quizId: ID!
			responses: [QuizResponse!]!
			time: Int!
			status: String!
		}
		type Query {
			readQuizSubmission(_id: ID!): QuizSubmission
		}
		type Mutation {
			createQuizSubmission(quizId: ID!, responses: [QuizResponseInput!]!, time: Int!, status: String!): HTTPResponse
			updateQuizSubmission(_id: ID!, responses: [QuizResponseInput!]!, time: Int!, status: String!): HTTPResponse
			deleteQuizSubmission(_id: ID!): HTTPResponse
		}
	`,
	resolvers: {
		Query: {
			readQuizSubmission: (_, args) => readQuizSubmission(args)
		},
		Mutation: {
			createQuizSubmission: (_, args, context) => createQuizSubmission({...args, studentId: context.id }),
			updateQuizSubmission: (_, args) => updateQuizSubmission({ _id: args._id }, args),
			deleteQuizSubmission: (_, args) => deleteQuizSubmission(args)
		}
	}
})