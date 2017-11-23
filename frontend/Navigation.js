// @flow
import PropTypes from 'prop-types'
import React, { Component } from 'react'
import {addNavigationHelpers, StackNavigator, TabNavigator, TabBarBottom} from 'react-navigation'
import {Text, View, StyleSheet} from 'react-native'
import {connect} from 'react-redux'
import LoginScreen from './components/authentication/LoginScreen'
import { map } from 'lodash'
import {graphql, compose} from 'react-apollo'
import Icon from 'react-native-vector-icons/FontAwesome'
import Colors from './Colors'
import GroupsScreen from './components/groups/GroupsScreen'
import ChatsScreen from './components/chats/ChatsScreen'
import ChatScreen from './components/chats/ChatScreen'

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white'
  },
  tabText: {
    color: '#777',
    fontSize: 10,
    justifyContent: 'center'
  },
  selected: {
    color: 'blue'
  }
})

const TestScreen = title => () => (
  <View style={styles.container}>
    <Text>
      {title}
    </Text>
  </View>
)

const SignedOut = StackNavigator({
  SignIn: {
    screen: LoginScreen,
    navigationOptions: {
      title: 'Sign in',
      header: null
    }
  },
  SignUp: {
    screen: LoginScreen,
    naviagationOptions: {
      title: 'Sign up',
      header: null
    }
  }
})

const GroupsNavigator = StackNavigator({
  MainGroupScreen: {
    screen: GroupsScreen,
    navigationOptions: {
      gesturesEnabled: true
    }
  },
  GroupDetails: {
    screen: GroupsScreen,
    navigationOptions: {
      gesturesEnabled: false
    }
  },
  CreateGroup: {
    screen: GroupsScreen
  }
},
{
  headerMode: 'none',
  mode: 'modal',
  initialRouteName: 'MainGroupScreen'
})

const ChatsNavigator = StackNavigator({
  MainChatsScreen: {
    screen: ChatsScreen
  },
  ChatScreen: {
    screen: ChatScreen
  }
}, {
    headerMode: 'screen',
    initialRouteName: 'MainChatsScreen'
})

const AppNavigator = TabNavigator({
  Chats: {screen: ChatsNavigator},
  Groups: {screen: GroupsNavigator},
  Friends: {screen: TestScreen('Friends')},
  Settings: {screen: LoginScreen}
},
{
  navigationOptions: ({ navigation }) => ({
    tabBarIcon: ({ focused }) => {
      const { routeName } = navigation.state
      let iconName
      switch (routeName) {
        case 'Chats':
          iconName = 'comments'
          break
        case 'Groups':
          iconName = 'users'
          break
        case 'Friends':
          iconName = 'user'
          break
        case 'Settings':
          iconName = 'cog'
      }
      return (
        <Icon
          name={iconName}
          size={28}
          style={{ marginBottom: -3 }}
          color={focused ? Colors.tabIconSelected : Colors.tabIconDefault}
        />
      )
    }
  }),
  tabBarComponent: TabBarBottom,
  tabBarPosition: 'bottom',
  animationEnabled: true,
  swipeEnabled: true,
  tabBarOptions: {
    activeTintColor: Colors.tabIconSelected
  }
})

const LoginNavigation = StackNavigator({
  Main: {screen: LoginScreen}
})

// const AppNavigator = StackNavigator({
//   Main: {screen: MainScreenNavigator},
//   TabNavigation: {screen: MainScreenNavigator},
//   Messages: {screen: TestScreen('Settings')},
//   Login: {screen: MainScreenNavigator}
// }, {
//   mode: 'modal'
// })

// const RootNavigator = (signedIn = false) => {
//   return StackNavigator(
//     {
//       SignedOut: {
//         screen: LoginScreen,
//         navigationOptions: {
//           gesturesEnabled: false
//         }
//       },
//       Main: {
//         screen: MainScreenNavigator,
//         navigationOptions: {
//           gesturesEnabled: false
//         }
//       }
//     },
//     {
//       headerMode: 'none',
//       mode: 'modal',
//       initialRouteName: !signedIn ? 'SignedIn' : 'SignedOut'
//     }
//   )
// }

const firstAction = AppNavigator.router.getActionForPathAndParams('Chats')
const tempNavState = AppNavigator.router.getStateForAction(firstAction)
const initialNavState = AppNavigator.router.getStateForAction(
  tempNavState
)

export const navigationReducer = (state = initialNavState, action) => {
  let nextState
  if (!action) return state || initialNavState
  switch (action.type) {
    default:
      nextState = AppNavigator.router.getStateForAction(action, state)
      break
  }

  return nextState || state
}

class AppWithNavigationState extends Component {
  componentWillReceiveProps (nextProps) {
    // if (!nextProps.user) {
    //   if (this.groupSubscription) {
    //     this.groupSubscription()
    //   }
    //   if (this.messagesSubscription) {
    //     this.messagesSubscription()
    //   }
    // }
    // if (nextProps.user &&
    //         (!this.props.user || nextProps.user.groups.length !== this.props.user.groups.length)) {
    //   // unsubscribe from old
    //   if (typeof this.messagesSubscription === 'function') {
    //     this.messagesSubscription()
    //   }
    //   // subscribe to new
    //   if (nextProps.user.groups.length) {
    //     this.messagesSubscription = nextProps.subscribeToMessages()
    //   }
    // }
    // if (!this.groupSubscription && nextProps.user) {
    //   this.groupSubscription = nextProps.subscribeToGroups()
    // }
  }
  render () {
    const { dispatch, nav } = this.props

    // if (!Object.keys(this.props.user).length > 0) return <LoginScreen />
    return <AppNavigator navigation={addNavigationHelpers({ dispatch, state: nav })} />
  }
}

const mapStateToProps = state => ({
  nav: state.nav,
  user: state.user.user
})

export default compose(
  connect(mapStateToProps)
)(AppWithNavigationState)
