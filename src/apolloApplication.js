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
import { HTTPResponseModule } from "../types/HTTPResponse.js";
import { MediaModule } from "../types/Media.js";
import { AssignmentModule } from "../types/Assignment.js";
import { AssignmentSubmissionModule } from "../types/AssignmentSubmission.js";
import { QuizModule } from "../types/Quiz.js";
import { QuizSubmissionModule } from "../types/QuizSubmission.js";

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
		HTTPResponseModule,
		MediaModule,
		AssignmentModule,
		AssignmentSubmissionModule,
		QuizModule,
		QuizSubmissionModule
	]
});