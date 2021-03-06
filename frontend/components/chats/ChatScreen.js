import {
    FlatList,
    StyleSheet,
    View,
    TextInput,
    ActivityIndicator,
    Image,
    Text,
    KeyboardAvoidingView,
    TouchableOpacity,
    TouchableHighlight,
    RefreshControl,
    Button,
    ProgressIndicator,
    TouchableNativeFeedback,
    Animated
  } from 'react-native'
  import React, {Component} from 'react'
  import {connect} from 'react-redux'
  import flowRight from 'lodash/flowRight'
  import withChats from './withChats'
  import Icon from 'react-native-vector-icons/FontAwesome'
  import moment from 'moment'
  import withChatMessages from './withChatMessages'
  import withChatMessageCreate from './withMessageCreate'

  const styles = StyleSheet.create({
    icon: {
      width: 30,
      height: 30,
      borderRadius: 15,
      marginLeft: 5,
      marginTop: 10,
    },
    container: {
      flex: 1,
      flexDirection: 'column',
      paddingBottom: 25,
      backgroundColor: '#2a3439',
    },
    headerTitle: {
      fontSize: 14,
      marginLeft: 10,
    },
    titleWrapper: {
        flex: 1,
        height: 300,
        flexDirection: 'row',
        alignItems: 'center',
    },
    myMessage: {
        marginLeft: '28%',
        marginTop: 10,
        width: '60%',
        borderColor: '#FA8072',
        borderStyle: 'solid',
        backgroundColor: '#FA8072',
    },
    notMyMessage: {
        marginTop: 10,
        width: '60%',
        borderColor: '#FA8072',
        borderStyle: 'solid',
        backgroundColor: '#F0FFFF',
    },
    message: {
        borderRadius: 12,
        marginHorizontal: 8,
        marginVertical: 2,
        paddingHorizontal: 8,
        paddingVertical: 6,
        shadowColor: 'black',
        shadowOpacity: 0.5,
        shadowRadius: 1,
        shadowOffset: {
            height: 1,
        },
    },
    messageWrapper: {
        flex: 1,
        flexDirection: 'row',
    },
    titleBar: {
        paddingTop: 20,
        flex: 1,
        flexDirection: 'row',
        alignContent: 'center',
    },
    sender: {
        fontSize: 12,
    },
    timeStamp: {
        fontSize: 10,
        color: '#FA8072',
    },
    messageSpacer: {
        flex: 0.2,
    },
    inputWrapper: {
        position: 'absolute',
        bottom: -40,
        flex: 1,
        borderStyle: 'solid',
        borderColor: 'black',
        flexDirection: 'row',
        paddingHorizontal: 12,
        paddingVertical: 6,
        shadowColor: '#FA8072',
        shadowOpacity: 0.5,
        shadowRadius: 1,
        shadowOffset: {
            height: -5,
        },
    },
    input: {
        backgroundColor: '#F0FFFF',
        borderColor: '#dbdbdb',
        borderRadius: 5,
        borderWidth: 1,
        flex: 1.2,
        color: 'black',
        height: 32,
        paddingHorizontal: 8,
    },
    sendButton: {
        height: 44,
        width: 44,
        paddingLeft: 10,
        marginRight: 0,
    }
  })
  
  const ANIMATION_DURATION = 500
  const ROW_HEIGHT = 100

  class ListRow extends Component {
      constructor(props) {
          super(props)
          this._animated = new Animated.Value(0)
      }

      componentDidMount() {
          Animated.timing(this._animated, {
              toValue: 1,
              duration: ANIMATION_DURATION,
          }).start()
      }

      render() {
        const {message, currentUser} = this.props
        const rowStyles = [
            { opacity: this._animated },
            {
                transform: [
                    { 
                        translateX: this._animated.interpolate({
                        inputRange: [0, 1],
                        outputRange: [currentUser ? 300 : -300, 0],
                        extrapolate: 'clamp',
                    })
                    },
                    // { scale: this._animated },
                    // {
                    //     rotate: this._animated.interpolate({
                    //         inputRange: [0,1],
                    //         outputRange: ['90deg', '0deg'],
                    //         extrapolate: 'clamp',
                    //     })
                    // }
                ],
            }
            
        ]
        if (message) {
            const image = <Image
            style={styles.icon}
            source={{uri: message.sender.image || 'https://images.duckduckgo.com/iu/?u=http%3A%2F%2Fimages.wikia.com%2Ffinalfantasy%2Fimages%2Farchive%2Fc%2Fc8%2F20111130214728%2521Vivi.jpg&f=1'}}
        />
        return (
            <Animated.View style={rowStyles} >
              <View style={styles.messageWrapper}>
                {!currentUser && image}
                <View style={[styles.message, currentUser ? styles.myMessage : styles.notMyMessage]}>
                    <Text>{message.body}</Text>
                </View>
                {!currentUser && <View style={styles.titleBar}>
                    <Text style={styles.timeStamp}>{moment(new Date(Number(message.sentAt))).calendar()}</Text>
                </View>}
                {currentUser && image}
                </View>
            </Animated.View>)
        }
      }
  }

  class ChatScreen extends Component {

    state = {
        fetchingMore: false,
        text: ''
    }

    static navigationOptions = ({navigation}) => {
        const {state} = navigation

        return {
            headerTitle: (
                <TouchableHighlight>
                    <View style={styles.titleWrapper}>
                        <Text style={styles.headerTitle} numberOfLines={1}>{state.params.name}</Text>
                    </View>
                </TouchableHighlight>
            )
        }
    }

    renderMessage(item) {
        return <ListRow message={item.item} currentUser={item.item.sender.id === this.props.user.id} />
    }

    send() {
        this.textInput.clear()
        this.textInput.blur()
        const message = this.props.sendMessage({body:this.state.text, group: this.props.navigation.state.params.id, sender: this.props.user.id, name: this.props.user.name})
    }

    loadMoreMessages() {
        if (!this.state.fetchingMore) {
            this.setState({fetchingMore: true})
            this.props.fetchMore()
            setTimeout(() => this.setState({fetchingMore: false}), 1000)
        }
    }

    findIndex = (chats, id) => {
        let index
        chats.forEach((chat, i) => {
          if (chat.id === id) index = i
        })
        return index
      }

    keyExtractor = (item, index) => item.id

    render () {
      if (this.props.loading) return <Text> LOADING </Text>
      const index = this.props.chats && this.findIndex(this.props.chats, this.props.navigation.state.params.id)
      const data = index !== false && index !== undefined ? this.props.chats[index] ? [...this.props.chats[index].messages, ...this.props.messages] : this.props.messages : []
    
      const ids = {}
      data.map(message => ids[message.id] = 1)
      
      const filteredData = data.filter((message) => {
          if (ids[message.id] !== 1) return false
          else {
              ids[message.id] = 0
              return true
          }
      })

      console.log(data)
      return <KeyboardAvoidingView 
        behavior={'position'}
        contentContainerStyle={styles.container}
        keyboardVerticalOffset={64}
        style={styles.container}>  
        
        <FlatList inverted
            data={filteredData}
            keyExtractor={this.keyExtractor}
            onEndReached={() => this.loadMoreMessages()}
            onEndReachedThreshold={1}
            renderItem={(item) => this.renderMessage(item)}
        />
        <View style={styles.inputWrapper}>
            <TextInput
                placeholderTextColor={'#FA8072'}
                style={styles.input}
                ref={(ref) => { this.textInput = ref }}                
                onSubmitEditing={() => this.send()}
                onChangeText={text => this.setState({text})}
                placeholder='What would you like to say?'
                send={this.send}/>
            <TouchableHighlight onPress={() => this.send()}>
                <Icon
                    backgroundColor={'slategray'}
                    borderRadius={16}
                    color={'#FA8072'}
                    iconStyle={styles.iconStyle}
                    name={'paper-plane'}
                    size={32}
                    style={styles.sendButton}
                    />
            </TouchableHighlight>
        </View>
      </KeyboardAvoidingView>
      
    }
  }
  
  const mapStateToProps = state => ({
    nav: state.nav,
    user: state.user.user
  })
  
  export default flowRight(
    connect(mapStateToProps),
    withChats,
    withChatMessages,
    withChatMessageCreate
)
  (ChatScreen)
  