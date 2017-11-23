import {graphql} from 'react-apollo'
import gql from 'graphql-tag'
import {withChatQuery} from './withChatMessages'

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

const withMessageSubscription =
graphql(withChatQuery, {
    name: 'messages',
    options: (params) => ({
        variables: {
            groupIds: params.chats && params.chats.map(chat => chat.id)
        }
    }),
    props: props => {
        return {
            subscribeToMessages: (things) => {
                console.log(things)
                return props.messages.subscribeToMore({
                    document: messageSubscription,
                    variables: {
                        groupIds: things.chats && things.chats.map(chat => chat.id),
                    },
                    update: (par, ar, met) => {
                        console.log(par, ar, met)
                    }
                    // updateQuery: (prev, hello, hoo, hi) => {
                    //     console.log(hello, hoo, hi)
                    //     if (!subscriptionData.data) {
                    //         return prev;
                    //     }

                    //     return prev

                    //     const newFeedItem = subscriptionData.data.commentAdded;

                    //     return Object.assign({}, prev, {
                    //         entry: {
                    //             comments: [newFeedItem, ...prev.entry.comments]
                    //         }
                    //     })
                    // }
                })
            }
        }
    }
})

export default withMessageSubscription
