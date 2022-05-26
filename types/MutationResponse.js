import { createModule, gql } from "graphql-modules";

export const MutationResponse = createModule({
	id: 'mutation-response',
	typeDefs: gql`
		type MutationResponse {
			completed: String
			error: String
		}
	`
})