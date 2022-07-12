import { createModule, gql } from "graphql-modules";
import { createQuiz, deleteQuiz, readQuiz, updateQuiz } from "../db_functions/Quiz.js";

export const QuizModule = createModule({
	id: "quiz",
	typeDefs: gql`
		type Quiz {
			_id: ID!
			title: String!
			moduleId: ID!
			open: String!
			close: String!
			questions: [QuizQuestion!]!
			displayScore: Boolean!
			numQuestions: Int!
		}
		type QuizQuestion {
			_id: ID!
			type: String!
			order: Int!
			body: String!
			explanation: String!
			options: [MCOption!]!
			answers: [ID!]!
		}
		input QuizQuestionInput {
			_id: ID!
			type: String!
			order: Int!
			body: String!
			explanation: String!
			options: [MCOptionInput!]!
			answers: [ID!]!
		}
		type MCOption {
			_id: ID!
			value: String!
		}
		input MCOptionInput {
			_id: ID!
			value: String!
		}
		type Query {
			readQuiz(_id: ID!): Quiz
		}
		type Mutation {
			createQuiz(title: String!, moduleId: ID!, open: String!, close: String!, questions: [QuizQuestionInput!]!, displayScore: Boolean!): HTTPResponse
			updateQuiz(_id: ID!, title: String!, open: String!, close: String!, questions: [QuizQuestionInput!]!, displayScore: Boolean!): HTTPResponse
			deleteQuiz(_id: ID!): HTTPResponse
		}
	`,
	resolvers: {
		Quiz: {
			numQuestions: (parent) => parent.questions.length
		},
		Query: {
			readQuiz: (_, args) => readQuiz(args)
		},
		Mutation: {
			createQuiz: (_, args) => createQuiz(args),
			updateQuiz: (_, args) => updateQuiz({ _id: args._id }, args),
			deleteQuiz: (_, args) => deleteQuiz(args)
		}
	}
})