import {graphql} from 'react-apollo'
import gql from 'graphql-tag'

const loginMutation = gql`
mutation createUser($name: String) {
    createUser(name: $name) {
        name
        id
    }
}`  

const withLoginMutation =     
graphql(loginMutation, {
  props: ({mutate}) => ({
    submit: ({name}) => {
      return mutate({
        variables: {
          name: name
        }
      })
    }
  })
})

export default withLoginMutation
