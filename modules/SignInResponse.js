import { createModule, gql } from "graphql-modules";

export const SignInResponse = createModule({
  id: "sign-in-response",

  typeDefs: gql`
    type SignInResponse {
      token: String
      error: String
    }
  `,
});
