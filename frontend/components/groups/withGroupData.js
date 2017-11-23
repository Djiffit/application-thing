import gql from 'graphql-tag'
import {graphql} from 'react-apollo'

const withGroupQuery = gql`
query { 
    groups {
        name
        id
        members {
            id
            name
        }
        messages {
            id
        }
    }
}
`
export default graphql(withGroupQuery, {
  props: ({ ownProps, data: {groups} }) => ({
    groups
  })
})
