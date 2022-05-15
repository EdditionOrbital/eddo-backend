// Imports

const { ApolloServer, gql } = require('apollo-server')
const fs = require('fs')

// Helper Functions

const readJsonFile = (path) => JSON.parse(fs.readFileSync(path))

// Test Data Import

const modules = readJsonFile('./test-data/modules.json')
const lessons = readJsonFile('./test-data/lessons.json')
const students = readJsonFile('./test-data/students.json')

const typeDefs = gql`
    interface User {
        id: ID!
        firstName: String!
        lastName: String
        modules: [ModuleTaken!]!
        email: String!
        password: String!
        
    }

    type Student implements User {
        id: ID!
        firstName: String!
        lastName: String
        modules: [ModuleTaken!]!
        email: String!
        password: String!
        mYear: Int
    }

    type ModuleTaken {
        moduleId: ID!
        lessons: [ID!]!
        role: Role
    }

    enum Role {
        Student
        TA
        Prof
        AProf
    }

    type Module {
        id: ID!
        title: String!
        description: String
        credits: Float
        files: Folder
        code: String # resolver field
        year: Int # resolver field
        semester: Int # resolver field
        lessons(type: String): [Lesson] # resolver field
        lesson(code: String!): Lesson # resolver field
        students: [Student] # resolver field
    }

    type Lesson {
        code: ID!
        moduleId: ID!
        startTime: String!
        endTime: String!
        venue: String
        day: String!
        weeks: [Int!]!
        lessonType: String!
        students: [Student] # resolver field
    }

    type Folder {
        id: ID!
        title: String!
        parentFolder: ID
        openDate: String
        closeDate: String
    }

    type File {
        id: ID!
        title: String!
        path: String!
        size: Float!
        parentFolder: ID!
        openDate: String
        closeDate: String
    }

    type Query {
        students: [Student] # resolver field
        student(id: ID!): Student # resolver field
        modules(year: Int, sem: Int): [Module] # resolver field
        module(id: ID!): Module # resolver field
    }
`

const resolvers = {
    Query : {
        students: () => students,
        modules: (parent, args, context) => {
            const { year, sem } = args
            const yearFilter = (module) => year === null || year === undefined ? true : parseInt(module.id.split('-')[1]) === year
            const semFilter = (module) => sem === null || sem === undefined ? true : parseInt(module.id.split('-')[2]) === sem
            return modules.filter((module) => yearFilter(module) && semFilter(module))
        },
        student: (parent, args, context) => students.find((student) => student.id === args.id),
        module: (parent, args, context) => modules.find((module) => module.id === args.id)
    },
    Module : {
        code: (parent, args, context) => parent.id.split('-')[0],
        year : (parent, args, context) => parent.id.split('-')[1],
        semester : (parent, args, context) => parent.id.split('-')[2],
        lessons : (parent, args, context) => {
            const { type } = args
            const typeFilter = (lesson) => type === null || type === undefined ? true : lesson.lessonType === type
            return lessons.filter((lesson) => typeFilter(lesson) && lesson.moduleId === parent.id)
        },
        lesson : (parent, args, context) => {
            const { code } = args
            return lessons.filter((lesson) => lesson.moduleId === parent.id && lesson.code === code)
        },
        students: (parent, args, context) => students.filter((student) => student.modules.map((mt) => mt.moduleId).includes(parent.id))
    },
    Lesson : {
        students: (parent, args, context) => {
            const moduleStudents = students.filter((student) => student.modules.map((mt) => mt.moduleId).includes(parent.moduleId))
            const lessonsTakenBy = (student) => student.modules.find((modTaken) => modTaken === parent.moduleId).lessons
            return moduleStudents.filter((student) => lessonsTakenBy(student).includes(parent.code))
        }
    }
}


const server = new ApolloServer({typeDefs, resolvers})

server.listen().then(({url}) => {
    console.log(`Server is running at ${url}`)
})