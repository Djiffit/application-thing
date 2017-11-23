// @flow

import {makeExecutableSchema} from 'graphql-tools'
import resolvers from './resolvers'

const typeDefs = `
type User {
    id: String!
    name: String!
    groups: [Group]
    friends: [User]
    image: String
}

type Message {
    id: String!
    body: String!
    group: Group!
    sender: User!
    location: String
    sentAt: String
}

type Group {
    id: String!
    name: String!
    image: String
    messages: [Message]
    members: [User]
    private: Boolean
    lastActive: String
    lastMessage: Message
}

type FetchMessages {
    messages: [Message],
    after: String,
}

type Query {
    messages(groupId: String, cursor: String, count: Int): FetchMessages
    group(groupId: String): Group
    groups: [Group]
    chats(userId: String): [Group]
}

type Mutation {
    createUser(name: String): User
    createMessage(body: String, group: String, sender: String): Message
    createGroup(name: String, description: String): Group
    joinGroup(groupId: String, userId: String): Group
}
type Subscription {
    messageAdded(groupIds: [String]): Message
  }
`

const schema = makeExecutableSchema({typeDefs, resolvers})

export default schema


