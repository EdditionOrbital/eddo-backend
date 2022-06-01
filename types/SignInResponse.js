import { createModule, gql } from "graphql-modules";
import { getStudent, Student } from "./Student.js";
import jwt from 'jsonwebtoken'
import { getStaff, Staff } from "./Staff.js";

export const SignInResponseModule = createModule({
  id: "sign-in-response",

  typeDefs: gql`
    type SignInResponse {
      token: String
      error: String
    }

    type Mutation {
      login(email: String!, password: String!): SignInResponse
      registerStudent(id: ID!, firstName: String!, lastName: String, email: String!, password: String!, mYear: Int!): SignInResponse
      registerStaff(id: ID!, firstName: String!, lastName: String, email: String!, password: String!, title: String!): SignInResponse
    }
  `,
  
  resolvers: {
    Mutation: {
      login: async (parent, args, context) => {
        const { email, password } = args;
        const student = await getStudent({email:email})
        const staff = await getStaff({email: email})
        const user = !student ? staff : student
        if (!user) return { error: "Email is not in our database." };
        const valid = password === user.password;
        if (!valid) return { error: "Incorrect password entered." };
        return { token: jwt.sign({ id: user.id }, "nnamdi") };
      },
      registerStudent: async (parent, args, context) => {
        var {id, firstName, lastName, email, password, mYear} = args
        if (!/^A\d{7}[A-Z]$/.test(id)) return { error: "Matriculation number is invalid."}
        if (!/.+@u.nus.edu/.test(email)) return { error: "Email is invalid."}
        firstName = firstName.trim()
        if (!/[A-Za-z ]+/.test(firstName)) return { error: "Invalid first name entered."}
        lastName = lastName.trim()
        if (!/[A-Za-z ]+/.test(lastName)) return { error: "Invalid last name entered."}
        if (lastName === '') lastName = null
        if (password.trim().length === 0) return { error: "Empty password entered."}
        if (![2018, 2019, 2020, 2021].includes(mYear)) return { error : "Invalid matriculation year." }
        var existingUser = await getStudent({$or:[ {email:email}, { id: id } ]})
        if (existingUser) return { error: 'Student already exists in Eddo.'}
        const emptyArray = []
        const userObj = new Student({
          id,
          firstName,
          lastName,
          emptyArray,
          email,
          password,
          mYear
        }).save().then(result => console.log(`Created new student with id ${id}`)).catch(err => console.log(`Unable to create student: ${err}`))
        return {
          token: jwt.sign({ id: id }, "nnamdi")
        }
      },
      registerStaff: async (parent, args, context) => {
        var {id, firstName, lastName, email, password, title} = args
        if (!/^B\d{7}[A-Z]$/.test(id)) return { error: "Staff ID is invalid."}
        if (!/.+@nus.edu.sg/.test(email)) return { error: "Email is invalid."}
        firstName = firstName.trim()
        if (!/[A-Za-z ]+/.test(firstName)) return { error: "Invalid first name entered."}
        lastName = lastName.trim()
        if (!/[A-Za-z ]+/.test(lastName)) return { error: "Invalid last name entered."}
        if (lastName === '') lastName = null
        if (password.trim().length === 0) return { error: "Empty password entered."}
        if (!["AProf", "Prof", "Dr", "Mr", "Ms"].includes(title)) return { error : "Invalid title." }
        var existingUser = await getStaff({$or:[ {email:email}, { id: id } ]})
        if (existingUser) return { error: 'Staff already exists in Eddo.'}
        const emptyArray = []
        const userObj = new Staff({
          id,
          firstName,
          lastName,
          emptyArray,
          email,
          password,
          title
        }).save().then(result => console.log(`Created new staff with id ${id}`)).catch(err => console.log(`Unable to create staff: ${err}`))
        return {
          token: jwt.sign({ id: id }, "nnamdi")
        }
      },
    }
  }

});
