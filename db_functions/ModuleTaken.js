import mongoose from "mongoose";
const schemaTypes = mongoose.Schema.Types;

export const ModuleTakenSchema = mongoose.Schema({
  moduleId: {
    type: schemaTypes.String,
    required: [true, "This field cannot be empty."],
  },
  lessons: {
    type: [schemaTypes.String],
    required: [true, "This field cannot be empty."],
  },
  role: {
    type: schemaTypes.String,
    required: [true, "This field cannot be empty."],
    enum: {
      values: ["Student", "TA", "Prof", "AProf"],
      message: "{VALUE} is not a valid role.",
    },
  },
});

export const ModuleTakenbject = mongoose.model(
  "ModuleTaken",
  ModuleTakenSchema
);
