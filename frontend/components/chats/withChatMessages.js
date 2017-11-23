import gql from 'graphql-tag'
import {graphql} from 'react-apollo'

export const withChatQuery = gql`
query getChatMessages($groupId: String, $count: Int, $cursor: String) { 
    messages(groupId: $groupId, count: $count, cursor: $cursor) {
        messages {
            id
            body
            sender {
                name
                id
            }
            sentAt
        }
        after
    }
}
`

export default graphql(withChatQuery, {
  options: (props) => ({
    variables: {
      groupId: props.navigation.state.params.id,
      count: 20
    }
  }),
  props: ({ownProps, data: {loading, messages, fetchMore}}) => ({
    messages,
    loading,
    fetchMore: () => fetchMore({
      variables: {
        cursor: messages.after
      },
      updateQuery: (previousResult, {fetchMoreResult}) => {
        if (!fetchMoreResult || !fetchMoreResult.messages || !fetchMoreResult.messages.messages) {
          return previousResult
        }
        let returnObject = {messages: {messages: [...previousResult.messages.messages], after: fetchMoreResult.messages.after}}
        fetchMoreResult.messages.messages.forEach((message) => {
            if (!returnObject.messages.messages.some(msg => msg.id === message.id)) returnObject.messages.messages.push(message)
        })
        return returnObject
      }
    })
  })
})
