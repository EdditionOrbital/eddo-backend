import { createModule, gql } from "graphql-modules";
import { createMedia, deleteMedia, readMedia, updateMedia } from "../db_functions/Media.js";

export const MediaModule = createModule({
	id: "media",
	typeDefs: gql`
		type Media {
			_id: ID!
			moduleId: ID!
			date: String!
			title: String!
			url: ID!
			tags: [String!]!
		}
		type Query {
			readMedia(_id: ID!): Media
		}
		type Mutation {
			createMedia(moduleId: ID!, title: String!, url: String!, tags: [String!]!): HTTPResponse
			updateMedia(_id: ID!, title: String, url: String, tags: [String!]): HTTPResponse
			deleteMedia(_id: ID!): HTTPResponse
		}
	`,
	resolvers: {
		Query: {
			readMedia: (_, args) => readMedia(args)
		},
		Mutation: {
			createMedia: (_, args) => createMedia(args),
			updateMedia: (_, args) => updateMedia({ _id: args._id }, args),
			deleteMedia: (_, args) => deleteMedia(args)
		}
	}
})