import { createModule, gql } from "graphql-modules";
import mongoose from "mongoose";
import { isCurrentSemMod } from "../utils/currentYearSemester.js";
import { unpackMultipleDocuments } from "../utils/unpackDocument.js";
import { getStudent } from "./Student.js";
const schemaTypes = mongoose.Schema.Types

export const AnnouncementSchema = mongoose.Schema({
    title: { type: schemaTypes.String, required: true },
    moduleId: { type: schemaTypes.String, required: true },
    content: { type: schemaTypes.String, required: false },
    authorId: { type: schemaTypes.String, required: true },
    date: { type: schemaTypes.String, required: true },
    readBy: { type: [schemaTypes.String], required: true },
})

export const Announcement = mongoose.model('Announcement', AnnouncementSchema)

export const getAllAnnouncements = () => Announcement.find({}).then(unpackMultipleDocuments).catch(err => console.log('Error while getting all announcements'))
export const getModuleAnnouncements = (modId) => Announcement.find({moduleId: modId}).then(unpackMultipleDocuments).catch(err => console.log('Error while getting module announcements'))

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
          currentUserAnnouncements: async (parent, args, context) => {
            const student = await getStudent({id:context.id})
            const lst = student.modules.map(x => x.moduleId).filter(x => isCurrentSemMod(x))
            const allAnnouncements = await getAllAnnouncements()
            return allAnnouncements.filter(a => lst.includes(a.moduleId))
          }
      }
  }
})