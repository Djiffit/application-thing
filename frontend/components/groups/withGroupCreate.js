import {graphql} from 'react-apollo'
import gql from 'graphql-tag'
import {withGroupQuery} from './withGroupData'
import update from 'immutability-helper'

const groupCreateMutation = gql`
mutation createGroup($name: String, $image: String) {
    createGroup(name: $name, image: $image ) {
        name
        id
        members {
            id
            name
        }
    }
}`

const withGroupCreateMutation =
graphql(groupCreateMutation, {
  props: ({mutate}) => ({
    createGroup: ({name, image, userId}) => {
      return mutate({
        variables: {
            asdf: console.log(name, image, userId),
          name,
          image,
        },
        optimisticResponse: {
          __typename: 'Mutation',
          createGroup: {
            __typename: 'Group',
            id: -1,
            name,
            members: [],
            messages: [],
            image,
          }
        },
        // update: (store, {data: {createGroup}}) => {
        //   const data = store.readQuery({
        //     query: withGroupQuery,
        //     variables: {
        //       userId
        //     }
        //   })
        //   const groups = [createGroup, ...data.groups]
        //   store.writeQuery({
        //     query: withGroupQuery,
        //     variables: {
        //       userId: userId
        //     },
        //     data: update(data, {
        //         groups : {
        //             $set: groups
        //         }
        //     })
        //   })
        // }
      })
    }
  })
})

export default withGroupCreateMutation
