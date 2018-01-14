import React from 'react'
import { StyleSheet, Text, View } from 'react-native'
import {ApolloClient} from 'apollo-client'
import {HttpLink, createHttpLink} from 'apollo-link-http'
import {ApolloLink} from 'apollo-link'
import {InMemoryCache} from 'apollo-cache-inmemory'
import Cache from 'apollo-cache-inmemory'
import {WebSocketLink} from 'apollo-link-ws'
import {createStore, combineReducers, applyMiddleware} from 'redux'
import AppwithNavigation, {navigationReducer} from './Navigation'
import {Provider} from 'react-redux'
import {ApolloProvider} from 'react-apollo'
import UserReducer from './components/authentication/reducer'
import thunk from 'redux-thunk'
import {getOperationAST} from 'graphql'
import {SubscriptionClient, addGraphQLSubscriptions} from 'subscriptions-transport-ws'

const httpUri = 'http://localhost:3000/graphql' // Configure GraphQL endpoint
const wsUri = 'ws://localhost:3000/subscriptions' // Configure WebSocket endpoint

const link = ApolloLink.split( // Link needs to split since we have both websockets and normal graphql connection
  operation => {
    const operationAST = getOperationAST(operation.query, operation.operationName)
    return !!operationAST && operationAST.operation === 'subscription'
  },
  new WebSocketLink({ // Create websocket link
    uri: wsUri,
    options: {
      reconnect: true, 
    }
  }),
  new HttpLink({uri: httpUri}) // Create GraphQL link
)

const client = new ApolloClient({ // Create ApolloClient with endpoints configured in the link and add the cache
  link,
  cache: new InMemoryCache({
    dataIdFromObject: o => o.id // How to identify data in cache
  }),
})

const store = createStore( // Configure redux store
  combineReducers({ // What data is stored in the store
    nav: navigationReducer,
    user: UserReducer
  }),
  applyMiddleware(thunk) // Adding middleware
)

// Final component structure
export default class App extends React.Component {
  render() {
    return (
      <Provider store={store}>
        <ApolloProvider client={client}>
            <AppwithNavigation />
        </ApolloProvider>
      </Provider>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center'
  }
})
