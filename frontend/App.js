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

const httpUri = 'http://localhost:3000/graphql'
const wsUri = 'ws://localhost:3000/subscriptions'

// const wsClient = new SubscriptionClient(`ws://localhost:4000/subscriptions`, {
//   reconnect: true,
// })
const httpLink = new HttpLink({
  uri: httpUri,
})

const link = ApolloLink.split(
  operation => {
    const operationAST = getOperationAST(operation.query, operation.operationName);
    return !!operationAST && operationAST.operation === 'subscription';
  },
  new WebSocketLink({
    uri: wsUri,
    options: {
      reconnect: true, 
    }
  }),
  new HttpLink({uri: httpUri})
)

const client = new ApolloClient({
  link,
  cache: new InMemoryCache({
    dataIdFromObject: o => o.id
  }),
})

const store = createStore(
  combineReducers({
    nav: navigationReducer,
    user: UserReducer
  }),
  applyMiddleware(thunk)
)

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
