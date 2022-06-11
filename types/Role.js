import { createModule, gql } from "graphql-modules";

export const RoleModule = createModule({
	id: "role",
	typeDefs: [
		gql`
			enum Role {
				Student
				TA
				Prof
				AProf
			}
		`,
	],
});