// @flow
import {graphql} from 'react-apollo'
import gql from 'graphql-tag'
import update from 'immutability-helper'

const messageCreateMutation = gql`
mutation createMessage($group: String, $body: String, $sender: String) {
    createMessage(sender: $sender, body: $body, group: $group) {
        id
        body
        sender {
            name
            id
        }
        sentAt
    }
}`

const withMessageCreateMutation =
graphql(messageCreateMutation, {
  props: ({mutate}) => ({
    sendMessage: ({body, group, sender, name}) => {
      return mutate({
        variables: {
          body,
          group,
          sender
        },
        optimisticResponse: {
          __typename: 'Mutation',
          createMessage: {
            __typename: 'Message',
            id: -1,
            body,
            sentAt: new Date(),
            sender: {
              __typename: 'User',
              id: sender,
              name: name
            }
          }
        },
      })
    },
            update: (store, {data: {createMessage}}) => {
          const data = store.readQuery({
            query: withChatQuery,
            variables: {
              userId: sender
            }
          })
          let messages
          let index
          data.chats.forEach((chat, i) => {
            if (chat._id === createMessage.group) {
              index = i
              messages = [createMessage, ...chat.messages]
            }
          })
          store.writeQuery({
            query: withChatQuery,
            variables: {
              userId: sender
            },
            data: update(data, {
              chats: {
                [index]: {
                  messages: {$set: messages}
                }
              }
            })
          })
        }
  })
})

export default withMessageCreateMutation

















