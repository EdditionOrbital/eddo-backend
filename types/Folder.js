import { createModule, gql } from "graphql-modules";

export const FolderModule = createModule({
	id: "folder",
	typeDefs: gql`
		type Folder {
			_id: ID!
			title: String!
			parentFolder: ID
			openDate: String
			closeDate: String
		}
	`,
});