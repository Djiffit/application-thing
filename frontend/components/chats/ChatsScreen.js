import {
  FlatList,
  StyleSheet,
  View,
  TextInput,
  ActivityIndicator,
  Image,
  Text,
  TouchableOpacity,
  TouchableHighlight,
  RefreshControl,
  Button,
  KeyboardAvoidingView,
  TouchableNativeFeedback
} from 'react-native'
import React, {Component} from 'react'
import {connect} from 'react-redux'
import flowRight from 'lodash/flowRight'
import withChats from './withChats'
import Icon from 'react-native-vector-icons/FontAwesome'
import moment from 'moment'
import withMessageSubscription from './withMessageSubscription'

const styles = StyleSheet.create({
container: {
    marginTop: 20,
},
  textWrapper: {
    flex: 1,
    flexDirection: 'column'
  },
  extraData: {
    fontSize: 9,
    marginLeft: 5,
    color: 'grey',
    flex: 0.1
  },
  messageSender: {
    paddingTop: 4,
    flex: 0.33,
    flexDirection: 'row',
  },
  message: {
    flex: 0.33,
    fontSize: 10,
  },
  title: {
    flex: 0.33,
    color: '#FA8072',
    fontWeight: 'bold',
    alignSelf: 'flex-start',
  },
  joinIconWrapper: {
    marginRight: 5
  },
  button: {
    width: '40%'
  },
  sender: {
    fontSize: 12,
    flex: 0.6,
    fontWeight: 'bold',
  },
  time: {
      flex: 0.4,
      paddingBottom: 7,
      fontSize: 11,
      alignSelf: 'flex-end',
  },
  rowSplitter: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center'
  },
  icon: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginTop: 5,
    marginLeft: 5,
    marginRight: 10
  },
  rowWrapper: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    borderBottomColor: '#eee',
    borderBottomWidth: 1,
    paddingVertical: 8
  },
})

class ChatsScreen extends Component {
    static navigationOptions = {
        header: null,
    }

    state = {
      subscribed: false,
    }


  componentWillReceiveProps(newProps) {
        // if (newProps.chats && this.subscribeToMessages && this.subscribeToChats) {
        //   this.subscribeToMessages(newProps.chats.map(chat => chat.id))
        //   this.subscribeToChats()
        // }
        // if (newProps.chats && this.props.chats && newProps.chats.length !== this.props.chats.length || this.props.user.id !== newProps.user.id) {
        //   if (typeof this.subscribeToMessages === 'function') {
        //     this.subscribeToMessages()
        //   }
        //   if (newProps.chats.length) {
        //     this.subscribeToMessages = newProps.subscribeToMessages(newProps.chats.map(chat => chat.id))
        //   }
        // }
        // if (this.props.user.id !== newProps.user.id) {
        //   if (typeof this.subscribeToChats === 'function') {
        //     this.subscribeToChats()
        //     this.subscribeToChats = newProps.subscribeToChats()
        //   }
        // }

      if (newProps.subscribeToMessages && newProps.chats && (!this.subscribeMessages || !this.props.chats || newProps.chats.length !== this.props.chats.length)) {
          if (!this.subscribeMessages) {
            console.log('new messages sub')
            this.subscribeMessages = newProps.subscribeToMessages
            this.subscribeMessages(newProps.chats.map(chat => chat.id))
          } else {
            console.log('renew messages')
            this.props.subscribeToMessages && this.props.subscribeToMessages()
            newProps.subscribeToMessages(newProps.chats.map(chat => chat.id))
          }
      }
      if (newProps.user.id !== this.props.user.id || !this.chatSubscription) {
        if (!this.chatSubscription) {
          console.log('new chats sub')
          this.chatSubscription = newProps.subscribeToChats
          this.chatSubscription()
        } else {
          console.log('renew chats')
          this.chatSubsription && this.chatSubsription()
          newProps.subscribeToChats()
        }
      }
  }

  async onSubmit () {
    this.setState({submitting: true})
    if (this.state.name.length > 3) {
      const user = await this.props.submit({name: this.state.name})
      this.props.signIn(user)
    } else {
      this.setState({submitting: false})
    }
  }

  async onPress(chat) {
    this.props.navigation.navigate('ChatScreen', chat)
  }

  keyExtractor = (item, index) => item.id

  renderChatItem(chat) {
    const lastMessage = chat.messages[0]
    return <TouchableHighlight onPress={() => this.onPress(chat) }> 
        <View style={styles.rowWrapper}> 
            <Image
                style={styles.icon}
                source={{uri: 'https://images.duckduckgo.com/iu/?u=http%3A%2F%2Fimages.wikia.com%2Ffinalfantasy%2Fimages%2Farchive%2Fc%2Fc8%2F20111130214728%2521Vivi.jpg&f=1'}} />
                <View style={styles.rowSplitter}> 
                    <View style={styles.textWrapper}>
                    <Text numberOfLines={1} style={styles.title}> {chat.name} </Text>
                    <View style={styles.messageSender}>
                        {lastMessage && <Text numberOfLines={1} style={styles.sender}> {`${lastMessage.sender.name}:`} </Text>}
                        {lastMessage && <Text numberOfLines={1} style={styles.time}>{moment(new Date(Number(lastMessage.sentAt))).fromNow()} </Text>}
                    </View>
                    {lastMessage &&<Text numberOfLines={1} style={styles.message}> {lastMessage.body} </Text>}
                    </View>
                    <View style={styles.joinIconWrapper}>
                        <Icon 
                            name={'angle-right'}
                            size={30}
                            style={{ marginRight: 9 }}
                            color={'#FA8072'}
                        />
                    </View>
                </View>
        </View> 
    </TouchableHighlight>
}

  render () {
    return <View style={styles.container}>  
    <FlatList
        data={this.props.chats}
        renderItem={(chat) => this.renderChatItem(chat.item)}
        keyExtractor={this.keyExtractor}
        />  
    </View>
    
  }
}

const mapStateToProps = state => ({
  nav: state.nav,
  user: state.user.user
})

export default flowRight(
  connect(mapStateToProps),
  withChats
)
(ChatsScreen)
