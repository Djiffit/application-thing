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

type UserData {
    groups: [Group],
}

type Query {
    messages(groupId: String, cursor: String, count: Int): [Message]
    group(groupId: String): Group
    groups(userId: String): [Group]
    chats(userId: String): [Group]
    userQuery(userId: String): String
}

type Mutation {
    createUser(name: String): User
    createMessage(body: String, group: String, sender: String): Message
    createGroup(name: String, image: String): Group
    joinGroup(groupId: String, userId: String): Group
}
type Subscription {
    messageAdded(groupIds: [String]): Message
    groupJoined(userId: String): Group
    groupCreated: Group
  }
`

const schema = makeExecutableSchema({typeDefs, resolvers})

export default schema


