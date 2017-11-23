import {graphql} from 'react-apollo'
import gql from 'graphql-tag'

const groupJoinMutation = gql`
mutation joinGroup($groupId: String, $userId: String) {
    joinGroup(userId: $userId, groupId: $groupId) {
        id
    }
}`

const withGroupJoinMutation =
graphql(groupJoinMutation, {
  props: ({mutate}) => ({
    joinGroup: ({userId, groupId}) => {
      return mutate({
        variables: {
          userId,
          groupId
        }
      })
    }
  })
})

export default withGroupJoinMutation
