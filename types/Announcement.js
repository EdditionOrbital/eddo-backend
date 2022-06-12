import { createModule, gql } from "graphql-modules";
import { createAnnouncement, deleteAnnouncement, readAnnouncements, updateAnnouncement } from "../db_functions/Announcement.js";
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
		author: String
	}

	type Query {
		contextAnnouncements: [Announcement!]!
	}

	type Mutation {
		createAnnouncement(title: String!, moduleId: String!, authorId: String!, content: String, date: String!, readBy: [String!]!): HTTPResponse
		updateAnnouncement(title: String!, content: String, date: String!): HTTPResponse
		deleteAnnouncement(title: String!): HTTPResponse
	}
  `,
  resolvers: {
	Announcement: {
		author: (p) => readStaff({id: p.authorId}).then(s => `${s.title}. ${s.firstName} ${s.lastName}`)
	},
	Query: {
		contextAnnouncements: async (_, __, context) => {
		const student = await readStudent({id:context.id})
		const moduleIds = student.modules.map(x => x.moduleId)
		const announcements = await readAnnouncements()
		if (!moduleIds.length) return []
		return announcements.filter(a => (moduleIds.includes(a.moduleId) && a.readBy.includes(student.firstName)))
		}
	},
	Mutation: {
		createAnnouncement: (_, args, context) => createAnnouncement({...args, authorId: context.id}),
		updateAnnouncement: async (_, args) => updateAnnouncement({title: args.title}, args),
		deleteAnnouncement: (_, args) => deleteAnnouncement(args)
	}
  }
})