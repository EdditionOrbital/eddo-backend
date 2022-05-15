const { ApolloServer, gql } = require('apollo-server')
const fs = require('fs')
const modules = JSON.parse(fs.readFileSync('moduleDummyData.json'))
const students = JSON.parse(fs.readFileSync('students.json'))

const typeDefs = gql`

    type Student {
        id: ID!
        firstName: String!
        lastName: String!
        matricYear: String!
        email: String!
        modules(year: Int, semester: Int): [Module] # Resolved
    }

    type ModuleStudentData {
        studentCode: ID!
        submissions: [String]
        grades: [String]
        timetable: [String]
        student: Student # Resolved
    }

    type Module {
        code: ID!
        title: String!
        description: String
        credits: Int!
        department: String
        faculty: String
        workload: [Int]
        year: Int
        semester: Int
        examDate: String
        examDuration: Int
        timetable: [Lesson]
        students: [ModuleStudentData]
        staff: [String]
        lesson(classNo: ID!): Lesson # Resolved
    }

    type Lesson {
        classNo: ID!
        startTime: String
        endTime: String
        weeks: [Int]
        venue: String
        day: String
        lessonType: String
        roster: [Student]
    }

    type Query {
        students: [Student]
        student(id: ID!): Student
        modules(year: Int, semester: Int, code: ID): [Module!]
        module(code: ID!, year: Int!, semester: Int!): Module
    }
`

const resolvers = {
    Query: {
        modules: (parent, args, context) => {
            const { year, semester, code } = args
            const yearBool = (module) => !year ? true : module.year === year
            const semBool = (module) => !semester ? true : module.semester === semester
            const codeBool = (module) => !code ? true : module.code === code
            return modules.filter((module) => yearBool(module) && semBool(module) && codeBool(module))
        },
        module: (parent, args, context) => {
            const { code, year, semester } = args
            return modules.find((mod) => mod.code === code && mod.year === year && mod.semester === semester)
        },
        students: () => students,
        student: (parent, args, context) => {
            const { id } = args
            return students.find((stud) => id === stud.id)
        }
    },
    Student: {
        modules: (parent, args, context) => {
            const id = parent.id
            const { year, semester } = args
            const modsTaken = modules.filter((mod) => mod.students.map((student) => student.studentCode).includes(id))
            const yearBool = (module) => !year ? true : module.year === year
            const semBool = (module) => !semester ? true : module.semester === semester
            return modsTaken.filter((mod) => yearBool(mod) && semBool(mod))
        }
    },
    Module: {
        lesson: (parent, args, context) => {
            const { classNo } = args
            const timetable = parent.timetable
            return timetable.find((l) => l.classNo === classNo)
        }
    },
    ModuleStudentData: {
        student: (parent, args, context) => {
            const id = parent.studentCode
            return students.find((stud) => stud.id === id)
        }
    },
    Lesson: {
        roster: (parent, args, context) => {
            const classNo = parent.classNo
            const modStudents = modules.find((mod) => mod.timetable.includes(parent)).students
            const studentCodes = modStudents.filter((stud) => stud.timetable.includes(classNo)).map((datum) => datum.studentCode)
            return studentCodes.map((code) => students.find((stud) => code === stud.id))
        }
    }
}

const server = new ApolloServer({typeDefs, resolvers})

server.listen().then(({url}) => {
    console.log(`Server is running at ${url}`)
})