// @flow

import Groups from '../db/models/Group'
import Messages from '../db/models/Message'
import Users from '../db/models/User'
import {PubSub, withFilter} from 'graphql-subscriptions'

const pubsub = new PubSub()

const resolvers = {
  Query: {
    messages: async(_, {groupId, cursor, count}) => {
        const limit = count || 10
        if (cursor) {
            const messages = await Messages.find({group: groupId, sentAt: {$lt: cursor}}).sort({sentAt: -1}).limit(limit)
            
            return messages
        } else {
            const messages = await Messages.find({group: groupId}).sort({sentAt: -1}).limit(limit)
            return messages
        }
    },
    groups: async (_, {userId}) => {
        const group = await Groups.find({members: {$ne: userId}}).populate({
            path: 'messages', 
            options: {sort: {sentAt: -1}, limit: 2},
        })        

        return group
    },
    chats: async (_, {userId}) => {
        const groups = await Groups.find({members: userId}).populate({
            path: 'messages', 
            options: {sort: {sentAt: -1}, limit: 2},
        })        

        return groups
    },
    userQuery: async (_, {userId}) => {
        const limit = 1
        const groups = await Groups.find({members: userId})

        return '{groups}'
    },
  },
  Mutation: {
    createUser: async (root, {name}) => {
        const user = await Users.findOne({name})
        if (user) return user
        return await Users.create({name})
    },
    createMessage: async (_, args) => {
        args = {...args, sentAt: Date.now()}
        const group = await Groups.findById(args.group)
        const message = await Messages.create(args) 
        group.messages.push(message._id)
        pubsub.publish('messageAdded', {messageAdded: message})        
        group.save()
        return message
    },
    createGroup: async (_, args) => {
        const group = await Groups.create(args) 
        pubsub.publish('groupCreated', {groupCreated: group})
        return group
    },
    joinGroup: async (_, {userId, groupId}) => {
        const user = await Users.findById(userId)
        const group = await Groups.findById(groupId).populate({
            path: 'messages', 
            options: {sort: {sentAt: -1}, limit: 2},
        })        

        pubsub.publish('groupJoined', {groupJoined: group, userId: userId})

        if (user.groups) user.groups.indexOf(groupId) === -1 && user.groups.push(groupId)
        else user.groups = [groupId]

        if (group.members) group.members.indexOf(userId) === -1 && group.members.push(userId)
        else group.members = [userId]

        await user.save()
        await group.save()
        
        return group
    },
  },
  Subscription: {
    messageAdded: {
      subscribe: withFilter(
        () => pubsub.asyncIterator('messageAdded'),
        ({messageAdded}, {groupIds}) => {
            return groupIds && groupIds.indexOf(messageAdded.group) !== -1
        }
      ),
    },
    groupJoined: {
        subscribe: withFilter(
          () => pubsub.asyncIterator('groupJoined'),
          ({userId}, params) => {
              return params.userId === userId
          }
        ),
      },
      groupCreated: {
        subscribe: withFilter(
          () => pubsub.asyncIterator('groupCreated'),
          () => {
              return true
          }
        ),
      },
  },
  Message: {
    group: async ({group}) => {
        return await Groups.findById(group)
    },
    sender: async (args) => {
        const user = await Users.findById(args.sender)
        return user
    },
  },
  User: {
    groups: async (id) => {
        const user = await Users.findById(id)
        return await user.groups.map(async (group) => await Groups.findById(group))
    },
  },
  Group: {
      messages: async({messages}) => {
          if (messages && messages[0] && messages[0].body) return messages
          const msgs = await Promise.all(await messages.map(async (message) => await Messages.findById(message)))
          return msgs
      },
      members: async(args) => {
          const group = await Groups.findById(args.id)
          return await group.members.map(async (member) => await Users.findById(member))
      },
      lastMessage: async({lastMessage}) => {
          return await Messages.findById(lastMessage)
      },
  },
}

export default resolvers




// match: {sentAt: {$lt: cursor || 9999999999999}},
// .populate({
//     path: 'messages', 
//     options: {sort: {sentAt: -1}, limit},
// })

