import gql from 'graphql-tag'
import {graphql} from 'react-apollo'
import update from 'immutability-helper'

const chatSubscription = gql`
subscription groupJoined($userId: String) {
    groupJoined(userId: $userId) {
      name
      id
      messages {
        body
        sender {
          name
          id
        }
        sentAt
      }
    }
}`

const messageSubscription = gql`
subscription messageAdded($groupIds: [String]) {
    messageAdded(groupIds: $groupIds) {
        id
        body
        group {
          id
        }
        sender {
          name
          id
          image
        }
        sentAt
    }
}`

export const withChatQuery = gql`
query getChats($userId: String) { 
    chats(userId: $userId) {
        name
        id
        messages {
          body
          sender {
            name
            id
          }
          sentAt
          id
        }
    }
}`

export default graphql(withChatQuery, {
  options: (props) => ({
    variables: {
      userId: props.user.id
    }
  }),
  props: ({ ownProps, data: {chats, loading, subscribeToMore} }) => ({
    chats: chats || ownProps.chats,
    loading,
    subscribeToMessages(groupIds) {
      return subscribeToMore({
          document: messageSubscription,
          variables: {groupIds},
          updateQuery: (previousResult, { subscriptionData }) => {
              const message = subscriptionData.data.messageAdded       
              let index
              let messages
              previousResult.chats.forEach((chat, i) => {
                if (chat.id === message.group.id) {
                  index = i
                  messages = [message, ...chat.messages]
                }
              })
              return update(previousResult, {
                chats: {
                  [index]: {
                    messages: {$set: messages}
                  }
                }
              })
          },
      })
  },
  subscribeToChats() {
    return subscribeToMore({
        document: chatSubscription,
        variables: {userId: ownProps.user.id},
        updateQuery: (previousResult, { subscriptionData }) => {
          const group = subscriptionData.data.groupJoined
          const groups = [group, ...previousResult.chats]
            return update(previousResult, {
              chats: {
                $set: groups
              }
            })
        },
    })
  },
  })
})








  // subscribeToGroups() {
  //     console.log('hello?')
  //     return subscribeToMore({
  //         document: GROUP_ADDED_SUBSCRIPTION,
  //         variables: { userId: user.id },
  //         updateQuery: (previousResult, { subscriptionData }) => {
  //             const previousGroups = previousResult.user.groups;
  //             const newGroup = subscriptionData.data.groupAdded;
  //             console.log(subscriptionData, 'hello')
  //             // if it's our own mutation
  //             // we might get the subscription result
  //             // after the mutation result.
  //             if (isDuplicateDocument(newGroup, previousGroups)) {
  //                 return previousResult;
  //             }
  //             return update(previousResult, {
  //                 user: {
  //                     groups: { $push: [newGroup] },
  //                 },
  //             });
  //         },
  //     });
  // },