import { createModule, gql } from "graphql-modules";

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
        const user = students.find((student) => student.email === email);
        if (!user) return { error: "Email is not in our database." };
        // const valid = await bcrypt.compare(password, user.password)
        const valid = password === user.password;
        if (!valid) return { error: "Incorrect password entered." };
        return {
          token: jwt.sign({ id: user.id }, "nnamdi"),
        };
      },
    },
  },
});
