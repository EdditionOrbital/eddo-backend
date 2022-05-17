// Imports

import { ApolloServer, AuthenticationError } from 'apollo-server'
import { application } from './app.js';
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'

const schema = application.createSchemaForApollo();

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
    schema,
    csrfPrevention: true,
    context: ({ req }) => {
        console.log(req.body.operationName)
        if (whitelisted.includes(req.body.operationName)) return {}
        const token = "Bearer <TOKENHERE>"
        if (!token.includes('Bearer ')) throw new AuthenticationError("Token must use Bearer format.")
        const user = getUser(token.split(' ')[1])
        if (!user) throw new AuthenticationError("You must be logged in!")
        return user
    }
})

server.listen().then(({url}) => {
    console.log(`Server is running at ${url}`)
})