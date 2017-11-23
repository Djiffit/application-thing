import {graphql} from 'react-apollo'
import gql from 'graphql-tag'
import {withChatQuery} from './withChatMessages'

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
        update: (store, {data: {createMessage}}) => {
          const data = store.readQuery({
            query: withChatQuery,
            variables: {
              groupId: group,
              count: 20
            }
          })
          console.log(data)
          data.messages.messages.unshift(createMessage)
          console.log(data)
          store.writeQuery({
            query: withChatQuery,
            variables: {
              groupId: group,
              count: 20
            },
            data
          })
        }
      })
    }
  })
})

export default withMessageCreateMutation
