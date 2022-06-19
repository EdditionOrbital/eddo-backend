import { createModule, gql } from "graphql-modules";

export const FileModule = createModule({
	id: "file",
	typeDefs: gql`
		type File {
			_id: ID!
			title: String!
			path: String!
			size: Float!
			parentFolder: ID
			moduleId: ID!
			openDate: String
			closeDate: String
		}
	`,
	
});