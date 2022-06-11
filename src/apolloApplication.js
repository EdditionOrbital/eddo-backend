import { createApplication } from "graphql-modules";
import { FileModule } from "../types/File.js";
import { FolderModule } from "../types/Folder.js";
import { LessonModule } from "../types/Lesson.js";
import { ModuleModule } from "../types/Module.js";
import { ModuleTakenModule } from "../types/ModuleTaken.js";
import { RoleModule } from "../types/Role.js";
import { StudentModule } from "../types/Student.js";
import { TaskModule } from "../types/Task.js";
import { UserModule } from "../types/User.js";
import { AnnouncementModule } from "../types/Announcement.js";
import { StaffModule } from "../types/Staff.js";
import { AdminModule } from "../types/Admin.js";
import { HTTPResponseModule } from "../types/HTTPResponse.js";

export const apolloApplication = createApplication({
	modules: [
		FileModule, 
		FolderModule, 
		LessonModule, 
		ModuleModule, 
		ModuleTakenModule, 
		RoleModule, 
		StudentModule, 
		UserModule,
		TaskModule,
		AnnouncementModule,
		StaffModule,
		AdminModule,
		HTTPResponseModule
	]
});