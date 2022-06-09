import { createModule, gql } from "graphql-modules";
import { readAnnouncements } from "../db_functions/Announcement.js";
import { readStudent } from "../db_functions/Student.js";

export const AnnouncementModule = createModule({
  id: "announcement",
  typeDefs: gql`
    type Announcement {
        title: String!
        moduleId: String!
        content: String
        authorId: String!
        date: String!
        readBy: [String!]!
    }

    type Query {
        currentUserAnnouncements: [Announcement!]!
    }
  `,
  resolvers: {
      Query: {
          currentUserAnnouncements: async (_, __, context) => {
            const student = await readStudent({id:context.id})
            const lst = student.modules.map(x => x.moduleId)
            const allAnnouncements = await readAnnouncements()
            if (!lst.length) return []
            return allAnnouncements.filter(a => (lst.includes(a.moduleId) && a.readBy.includes(student.firstName)))
          }
      }
  }
})