import { createApplication } from "graphql-modules";
import { FileModule } from "../types/File.js";
import { FolderModule } from "../types/Folder.js";
import { LessonModule } from "../types/Lesson.js";
import { ModuleModule } from "../types/Module.js";
import { ModuleTakenModule } from "../types/ModuleTaken.js";
// import { MutationModule } from "../modules/Mutation.js";
// import { QueryModule } from "../modules/Query.js";
import { RoleModule } from "../types/Role.js";
import { SignInResponseModule } from "../types/SignInResponse.js";
import { StudentModule } from "../types/Student.js";
import { UserModule } from "../types/User.js";

export const apolloApplication = createApplication({
  modules: [
    FileModule, 
    FolderModule, 
    LessonModule, 
    ModuleModule, 
    ModuleTakenModule, 
    // MutationModule, 
    // QueryModule, 
    RoleModule, 
    SignInResponseModule, 
    StudentModule, 
    UserModule
  ],
});