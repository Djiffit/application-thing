import gql from 'graphql-tag'
import {graphql} from 'react-apollo'
import update from 'immutability-helper'

export const withGroupQuery = gql`
query getGroups($userId: String) { 
    groups(userId: $userId) {
        name
        id
        members {
            id
            name
        }
    }
}
`

const groupSubscription = gql`
subscription groupSubscription {
    groupCreated {
        name
        id
        members {
            id 
            name
        }
    }
}
`
export default graphql(withGroupQuery, {
options: (props) => ({
    variables: {
        userId: props.user.id
    }
    }),
  props: ({ ownProps, data: {groups, subscribeToMore, loading} }) => ({
    groups,
    loading,
    subscribeToGroups() {
        return subscribeToMore({
            document: groupSubscription,
            updateQuery: (previousResult, { subscriptionData }) => {
                const group = subscriptionData.data.groupCreated 
                const groups = [group, ...previousResult.groups]
                return update(previousResult, {
                    groups : {
                        $set: groups
                    }
                })
            },
        })
    },
  })
})
