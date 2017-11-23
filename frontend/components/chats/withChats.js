import gql from 'graphql-tag'
import {graphql} from 'react-apollo'

const withChatQuery = gql`
query getChats($userId: String) { 
    chats(userId: $userId) {
        name
        id
        lastMessage {
            id
            body
            sentAt
            sender {
                name
            }
        }
    }
}
`
export default graphql(withChatQuery, {
  options: (props) => ({
    variables: {
      userId: props.user.id
    }
  }),
  props: ({ ownProps, data: {chats} }) => ({
    chats
  })
})
