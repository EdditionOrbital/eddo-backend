import { createModule, gql } from "graphql-modules";
import jwt from "jsonwebtoken";
import Student from "../schema/StudentSchema.js";
import { unpackSingleDocument } from "./unpackDocument.js";

export const Mutation = createModule({
  id: "mutation",

  typeDefs: gql`
    type Mutation {
      login(email: String!, password: String!): SignInResponse
    }
  `,

  resolvers: {
    Mutation: {
      login: async (parent, args, context) => {
        const { email, password } = args;
        const user = await Student.findOne({ email: email }).then(unpackSingleDocument);
        if (!user) return { error: "Email is not in our database." };
        const valid = password === user.password;
        if (!valid) return { error: "Incorrect password entered." };
        return {
          token: jwt.sign({ id: user.id }, "nnamdi"),
        };
      },
    },
  },
});
