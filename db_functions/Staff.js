import mongoose from "mongoose";
import {
  unpackMultipleDocuments,
  unpackSingleDocument,
} from "../utils/unpackDocument.js";
import { ModuleTakenSchema } from "./ModuleTaken.js";
import jwt from "jsonwebtoken";
const schemaTypes = mongoose.Schema.Types;

export const StaffSchema = mongoose.Schema({
  id: {
    type: schemaTypes.String,
    required: [true, "This field cannot be empty."],
    unique: [true, "A staffer with this ID already exists."],
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
  lastName: { type: schemaTypes.String, required: false },
  modules: {
    type: [ModuleTakenSchema],
    required: [true, "This field cannot be empty."],
    validate: {
      validator: function (lastName) {
        /[A-Za-z ]+/.test(lastName);
      },
      message: (props) => `Inavlid last name entered.`,
    },
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
  title: {
    type: schemaTypes.String,
    required: [true, "This field cannot be empty."],
    enum: {
      values: ["AProf", "Prof", "Dr", "Mr", "Ms"],
      message: `Invalid title.`,
    },
  },
});

export const StaffObject = mongoose.model("Staff", StaffSchema);

export const createStaff = (staff) => {
  var { id, firstName, lastName, email, password, title } = staff;
  firstName = firstName.trim();
  lastName = lastName.trim();

  const httpResponse = new StaffObject({
    id,
    firstName,
    lastName,
    email,
    password,
    title,
  })
    .save()
    .then((res) => {
      console.log(`New staff created with id ${res.id}`);
      const token = jwt.sign({ id: res.id }, "nnamdi");
      return { response: token };
    })
    .catch((err) => {
      return { error: err };
    });
  return httpResponse;
};

export const readStaffs = (params) => {
  return StaffObject.find(params)
    .then(unpackMultipleDocuments)
    .catch((err) => console.log("Error while getting staffs"));
};

export const readStaff = (params) => {
  return StaffObject.findOne(params)
    .then(unpackSingleDocument)
    .catch((err) => console.log("Error while getting staff"));
};
