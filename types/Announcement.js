import { createModule, gql } from "graphql-modules";
import { readAnnouncements } from "../db_functions/Announcement.js";
import { readStudent } from "../db_functions/Student.js";

export const AnnouncementModule = createModule({
  id: "announcement",
  typeDefs: gql`
	type Announcement {
		title: String!
		moduleId: String!
		authorId: String!
		content: String
		date: String!
		readBy: [String!]!
	}

	type Query {
		contextAnnouncements: [Announcement!]!
	}
  `,
  resolvers: {
	  Query: {
		  contextAnnouncements: async (_, __, context) => {
			const student = await readStudent({id:context.id})
			const moduleIds = student.modules.map(x => x.moduleId)
			const announcements = await readAnnouncements()
			if (!moduleIds.length) return []
			return announcements.filter(a => (moduleIds.includes(a.moduleId) && a.readBy.includes(student.firstName)))
		  }
	  }
  }
})