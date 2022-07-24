import { createModule, gql } from "graphql-modules";
import { createAnnouncement, deleteAnnouncement, readAnnouncements, updateAnnouncement } from "../db_functions/Announcement.js";
import { readStaff } from "../db_functions/Staff.js";
import { readStudent } from "../db_functions/Student.js";

export const AnnouncementModule = createModule({
  id: "announcement",
  typeDefs: gql`
	type Announcement {
		_id: ID!
		title: String!
		moduleId: String!
		authorId: String!
		content: String!
		date: String!
		readBy: [String!]!
		author: String
	}

	type Mutation {
		createAnnouncement(title: String!, moduleId: String!, content: String!, date: String!): HTTPResponse
		updateAnnouncement(_id: ID!, title: String!, content: String!, date: String!): HTTPResponse
		deleteAnnouncement(_id: ID!): HTTPResponse
	}
  `,
  resolvers: {
	Announcement: {
		author: (p) => readStaff({id: p.authorId}).then(s => `${s.firstName} ${s.lastName}`)
	},
	Mutation: {
		createAnnouncement: (_, args, context) => createAnnouncement({...args, authorId: context.id}),
		updateAnnouncement: (_, args) => updateAnnouncement({_id: args._id}, args),
		deleteAnnouncement: (_, args) => deleteAnnouncement(args)
	}
  }
})