import {
  FlatList,
  StyleSheet,
  View,
  TextInput,
  ActivityIndicator,
  Image,
  Text,
  TouchableOpacity,
  RefreshControl,
  Button,
  KeyboardAvoidingView,
  TouchableNativeFeedback
} from 'react-native'
import withLogin from './withLogin'
import React, {Component} from 'react'
import {signIn} from './actions'
import {connect} from 'react-redux'
import flowRight from 'lodash/flowRight'

const styles = StyleSheet.create({
  container: {
    alignItems: 'stretch',
    backgroundColor: 'white',
    flex: 1,
    flexDirection: 'column',
    alignContent: 'center',
    paddingTop: '25%'
  },
  header: {
    alignSelf: 'center',
    fontSize: 30,
    marginBottom: 20
  },
  button: {
    width: '40%',
  },
  name : {
    alignSelf: 'center',
    fontSize: 15,
    marginBottom: 20
  },
  input: {
    backgroundColor: '#f7f7f7',
    height: 40,
    paddingLeft: 8,
    borderColor: '#f7f7f7',
    borderRadius: 0,
    borderWidth: 1,
    width: '80%',
    alignSelf: 'center',
    color: '#FA8072',
    fontSize: 17,
    marginBottom: 50,
  }
})

class LoginScreen extends Component {
  constructor() {
    super()
    this.state = {
      name: '',
      submitting: false
    }
  }
  static navigationOptions = {
      title: 'User',
  }

  async onSubmit() {
    this.setState({submitting: true})
    if (this.state.name.length > 3) {
      const user = await this.props.submit({name: this.state.name})
      this.props.signIn(user)
    } else {
     this.setState({submitting: false})
    }
  }

  render () {
    const userName = this.props.user && this.props.user.name
    return (
      <View
        style={styles.container}>
        <Text style={styles.header}>
                    Choose your username
        </Text>
        {userName && <Text style={styles.name}>
                    Your current name is {userName}
        </Text>}
        <TextInput
          placeholder={'Username'}
          underlineColorAndroid='transparent'
          style={styles.input}
          editable={!this.state.submitting}
          blurOnSubmit={true}
          onSubmit={() => this.onSubmit()}
          onChangeText={((text) => this.setState({name: text}))}/>
          
        <Button 
          onPress={() => this.onSubmit()}
          title={'Submit'} 
          style={styles.button}
          disabled={this.state.submitting}
          color='grey' 
          style={styles.button}/>

      </View>
    )
  }
}
const mapStateToProps = state => ({
  nav: state.nav,
  user: state.user.user
})

export default flowRight(
  withLogin, 
  connect(mapStateToProps, {signIn}))(LoginScreen)
