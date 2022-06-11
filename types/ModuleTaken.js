import { createModule, gql } from "graphql-modules";

export const ModuleTakenModule = createModule({
	id: "module-taken",
	typeDefs: [
		gql`
			type ModuleTaken {
				moduleId: ID!
				lessons: [ID!]!
				role: Role!
			}
		`,
	],
});