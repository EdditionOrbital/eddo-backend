import { createModule, gql } from "graphql-modules";
import jwt from "jsonwebtoken";
import Student from "../schema/StudentSchema.js";
import { unpackSingleDocument } from "./unpackDocument.js";

export const Mutation = createModule({
  id: "mutation",

  typeDefs: gql`
    type Mutation {
      login(email: String!, password: String!): SignInResponse
      register(id: ID!, firstName: String!, lastName: String, email: String!, password: String!, mYear: Int!): SignInResponse
    }
  `,

  resolvers: {
    Mutation: {
      login: async (parent, args, context) => {
        const { email, password } = args;
        const user = await Student.findOne({ email: email }).then(unpackSingleDocument).catch(err => null);
        if (!user) return { error: "Email is not in our database." };
        const valid = password === user.password;
        if (!valid) return { error: "Incorrect password entered." };
        return {
          token: jwt.sign({ id: user.id }, "nnamdi"),
        };
      },
      register: async (parent, args, context) => {
        var {id, firstName, lastName, email, password, mYear} = args
        if (!/A\d\d\d\d\d\d\dA/.test(id)) return { error: "Matriculation number is invalid."}
        if (!/.+@u.nus.edu/.test(email)) return { error: "Email is invalid."}
        firstName = firstName.trim()
        if (!/[A-Za-z ]+/.test(firstName)) return { error: "Invalid first name entered."}
        lastName = lastName.trim()
        if (!/[A-Za-z ]+/.test(lastName)) return { error: "Invalid last name entered."}
        if (lastName === '') lastName = null
        if (password.trim().length === 0) return { error: "Empty password entered."}
        if (![2018, 2019, 2020, 2021].includes(mYear)) return { error : "Invalid matriculation year." }
        var existingUser = await Student.findOne({ email: email }).then(unpackSingleDocument).catch(err => null)
        if (existingUser) return { error: 'User already exists in Eddo.'}
        var existingUser = await Student.findOne({ id: id }).then(unpackSingleDocument).catch(err => null)
        if (existingUser) return { error: 'User already exists in Eddo.'}
        const emptyArray = []
        const userObj = new Student({
          id,
          firstName,
          lastName,
          emptyArray,
          email,
          password,
          mYear
        }).save().then(result => console.log(`Created new user with id ${id}`)).catch(err => console.log(`Unable to create user: ${err}`))
        return {
          token: jwt.sign({ id: id}, "nnamdi")
        }
      }
    },
  },
});