// Imports

const { ApolloServer, gql, AuthenticationError } = require('apollo-server')
const fs = require('fs')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

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
        currentUser: Student # resover field
    }

    type SignInResponse {
        token: String
        error: String
    }

    type Mutation {
        login(email: String!, password: String!): SignInResponse
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
        module: (parent, args, context) => modules.find((module) => module.id === args.id),
        currentUser: (parent, args, context) => {
            const student = students.find((student) => student.id === context.id)
            return student
        }
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
    },
    Mutation : {
        login: async (parent, args, context) => {
            const { email, password } = args
            const user = students.find((student) => student.email === email)
            if (!user) return { error : "Email is not in our database." }
            // const valid = await bcrypt.compare(password, user.password)
            const valid = password === user.password
            if (!valid) return { error : "Incorrect password entered." }
            return {
                token: jwt.sign({ id: user.id }, "nnamdi")
            }
        }
    },
    User : {
        __resolveType : (user) => user.type
    }
}

const getUser = (token) => {
    if (token) {
        try {
            return jwt.verify(token, "nnamdi")
        } catch (err) {
            return { error: true, msg: "Session invalid"}
        }
    }
}

const whitelisted = ['LoginMutation', 'IntrospectionQuery']

const server = new ApolloServer({
    typeDefs, 
    resolvers,
    csrfPrevention: true,
    context: ({ req }) => {
        console.log(req.body.operationName)
        if (whitelisted.includes(req.body.operationName)) return {}
        const token = req.headers.authorization || ''
        if (!token.includes('Bearer ')) throw new AuthenticationError("Token must use Bearer format.")
        const user = getUser(token.split(' ')[1])
        if (!user) throw new AuthenticationError("You must be logged in!")
        return user
    }
})

server.listen().then(({url}) => {
    console.log(`Server is running at ${url}`)
})