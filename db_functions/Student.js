import jwt from "jsonwebtoken";
import mongoose from "mongoose";
import {
  unpackMultipleDocuments,
  unpackSingleDocument,
} from "../utils/unpackDocument.js";
import { ModuleTakenSchema } from "./ModuleTaken.js";

const schemaTypes = mongoose.Schema.Types;

export const StudentSchema = mongoose.Schema({
  id: {
    type: schemaTypes.String,
    required: [true, "This field cannot be empty."],
    unique: [true, "A student with this ID already exists."],
    validate: {
      validator: function (id) {
        /^B\d{7}[A-Z]$/.test(id);
      },
      message: (props) => `Matriculation number is invalid.`,
    },
  },
  firstName: {
    type: schemaTypes.String,
    required: [true, "This field cannot be empty."],
  },
  lastName: {
    type: schemaTypes.String,
    required: false,
    validate: {
      validator: function (lastName) {
        /[A-Za-z ]+/.test(lastName);
      },
      message: (props) => `Inavlid last name entered.`,
    },
    default: [],
  },
  modules: {
    type: [ModuleTakenSchema],
    required: [true, "This field cannot be empty."],
    default: [],
  },
  email: {
    type: schemaTypes.String,
    required: [true, "This field cannot be empty."],
    unique: [true, "An account with this email already exists."],
    validate: {
      validator: function (email) {
        /.+@u.nus.edu/.test(email);
      },
      message: (props) => `Email is invalid.`,
    },
  },
  password: {
    type: schemaTypes.String,
    required: [true, "This field cannot be empty."],
    minLength: [1, "Empty password entered."],
  },
  mYear: {
    type: schemaTypes.Number,
    required: [true, "This field cannot be empty."],
    enum: {
      values: [2018, 2019, 2020, 2021, 2022],
      message: "Invalid matriculation year.",
    },
  },
});

export const StudentObject = mongoose.model("Student", StudentSchema);

export const createStudent = (student) => {
  var { id, firstName, lastName, email, password, mYear } = student;
  firstName = firstName.trim();
  lastName = lastName.trim();

  const httpResponse = new StudentObject({
    id,
    firstName,
    lastName,
    email,
    password,
    mYear,
  })
    .save()
    .then((res) => {
      console.log(`New student created with id ${res.id}`);
      const token = jwt.sign({ id: res.id }, "nnamdi");
      return { response: token };
    })
    .catch((err) => {
      return { error: err };
    });
  return httpResponse;
};

export const readStudents = (params) => {
  return StudentObject.find(params)
    .then(unpackMultipleDocuments)
    .catch((err) => console.log("Error while getting students"));
};

export const readStudent = (params) => {
  return StudentObject.findOne(params)
    .then(unpackSingleDocument)
    .catch((err) => console.log("Error while getting student"));
};
