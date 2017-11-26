import {graphql} from 'react-apollo'
import gql from 'graphql-tag'
import {withGroupQuery} from './withGroupData'
import update from 'immutability-helper'

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
        },
        optimisticResponse: {
          __typename: 'Mutation',
          joinGroup: {
            __typename: 'Group',
            id: groupId,
          }
        },
        update: (store, {data: {joinGroup}}) => {
          const data = store.readQuery({
            query: withGroupQuery,
            variables: {
              userId
            }
          })
          const groups = data.groups.filter((group) => group.id !== groupId)
          store.writeQuery({
            query: withGroupQuery,
            variables: {
              userId: userId
            },
            data: update(data, {
                groups : {
                    $set: groups
                }
            })
          })
          const d = store.readQuery({
            query: withGroupQuery,
            variables: {
              userId
            }
          })
        }
      })
    }
  })
})

export default withGroupJoinMutation
