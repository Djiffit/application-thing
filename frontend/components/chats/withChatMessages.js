import gql from 'graphql-tag'
import {graphql} from 'react-apollo'

export const withChatQuery = gql`
query getChatMessages($groupId: String, $count: Int, $cursor: String) { 
    messages(groupId: $groupId, count: $count, cursor: $cursor) {
            id
            body
            sender {
                name
                id
            }
            sentAt

    }
}
`

export default graphql(withChatQuery, {
  options: (props) => ({
    variables: {
      groupId: props.navigation.state.params.id,
      cursor: props.navigation.state.params.messages && props.navigation.state.params.messages.length !== 0 && props.navigation.state.params.messages[props.navigation.state.params.messages.length - 1].sentAt,
      count: 20
    }
  }),
  props: ({ownProps, data: {loading, messages, fetchMore}}) => ({
    messages,
    loading,
    fetchMore: () => fetchMore({
      variables: {
        cursor: messages && messages.length !== 0 && messages[messages.length - 1].sentAt
      },
      updateQuery: (previousResult, {fetchMoreResult}) => {
        if (!fetchMoreResult || !fetchMoreResult.messages || !fetchMoreResult.messages) {
          return previousResult
        }
        let returnObject = [...previousResult.messages]
        fetchMoreResult.messages.forEach((message) => {
            if (!returnObject.some(msg => msg.id === message.id)) returnObject.push(message)
        })
        return {messages: returnObject}
      }
    })
  })
})
