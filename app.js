import { createApplication } from "graphql-modules";
import { File } from "./modules/File.js";
import { Folder } from "./modules/Folder.js";
import { Lesson } from "./modules/Lesson.js";
import { Module } from "./modules/Module.js";
import { ModuleTaken } from "./modules/ModuleTaken.js";
import { Mutation } from "./modules/Mutation.js";
import { Query } from "./modules/Query.js";
import { Role } from "./modules/Role.js";
import { SignInResponse } from "./modules/SignInResponse.js";
import { Student } from "./modules/Student.js";
import { User } from "./modules/User.js";

export const application = createApplication({
  modules: [File, Folder, Lesson, Module, ModuleTaken, Mutation, Query, Role, SignInResponse, Student, User],
});
