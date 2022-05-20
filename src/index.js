import listenToApolloServer from "./apolloServer.js";
import connectToMongo from "./mongoServer.js";

connectToMongo(listenToApolloServer)