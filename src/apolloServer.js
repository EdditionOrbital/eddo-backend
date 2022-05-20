import { apolloApplication } from './apolloApplication.js';
import { ApolloServer, AuthenticationError } from 'apollo-server'
import jwt from 'jsonwebtoken';

const whitelisted = ['LoginMutation', 'IntrospectionQuery', 'RegisterMutation']
const schema = apolloApplication.createSchemaForApollo();

const getUser = (token) => {
    if (token) {
        try {
            return jwt.verify(token, "nnamdi")
        } catch (err) {
            return { error: true, msg: "Session invalid"}
        }
    }
}

const apolloServer = new ApolloServer({
    schema,
    csrfPrevention: true,
    context: ({ req }) => {
        console.log(req.body.operationName)
        if (whitelisted.includes(req.body.operationName)) return {}
        const token = req.headers.authorization || ''
        // const token = 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IkEwMjMzMjEwWCIsImlhdCI6MTY1Mjg3MDg3Nn0.-eezMHGOCtt4F3yvmL5R72nnEBqN3ttESwPGZV0LLwE'
        if (!token.includes('Bearer ')) throw new AuthenticationError("Token must use Bearer format.")
        const user = getUser(token.split(' ')[1])
        if (!user) throw new AuthenticationError("You must be logged in!")
        return user
    }
})

const listenToApolloServer = () => apolloServer.listen().then(({url}) => {
    console.log(`Apollo Server is running at ${url}`)
})

export default listenToApolloServer