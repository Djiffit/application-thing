import React, {Component} from 'react'
import {View,
    TouchableHighlight,
     Text, 
     FlatList,
     Button,
     TextInput,
     Image,
     Modal,
    StyleSheet} from 'react-native'
import withGroupData from './withGroupData'
import withGroupJoin from './withGroupJoin'
import withGroupCreate from './withGroupCreate'
import flowRight from 'lodash/flowRight'
import {connect} from 'react-redux'
import Icon from 'react-native-vector-icons/FontAwesome'

const styles = StyleSheet.create({
    textWrapper: {
        flex: 1,
        flexDirection: 'column',
    },
    container: {
        marginTop: 20,
    },
    modalInput: {
        width: '80%',
        alignSelf: 'center',
        height: 35,
        fontSize: 16,
        marginBottom: 50,
        color: '#e7e7e7',
        backgroundColor: '#2a3439',
        borderRadius: 10,
        paddingLeft: 20,
    },
    extraData: {
        fontSize: 9,
        marginLeft: 5,
        color: 'grey',
        flex: 0.1
    },
    modalButton: {
        justifyContent: 'center',
        alignSelf: 'center',
    },
    title: {
      flex: 0.9,
      color: '#FA8072',
      fontWeight: 'bold',
      alignSelf: 'flex-start',
      overflow: 'hidden',
      paddingTop: 10,
    },
    joinIconWrapper: {
      marginRight: 5,
    },
    button: {
        alignSelf: 'flex-end',
        fontSize: 10,
        flex: 0.1,
    },
    rowSplitter: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
    },
    icon: {
        width: 40,
        height: 40,
        borderRadius: 20,
        marginTop: 5,
        marginLeft: 5,
        marginRight: 10,
    },
    listHeader: {
        height: 40,
        flexDirection: 'row',
        justifyContent: 'flex-end',
        flex: 1,
        width: '100%',
        position: 'absolute',
        borderStyle: 'solid',
        borderBottomColor: 'darkgrey',
        borderBottomWidth: 2,
    },
    plusIcon: {
        alignSelf: 'center',
    },
    headerText: {
        fontSize: 17,
        color: '#FA8072',
        alignSelf: 'center',
        paddingTop: 2,
        fontWeight: 'bold',
        flex: 0.6,
    },
    padding: {
        paddingTop: 40,
    },
    newText: {
        fontSize: 16,
        color: '#FA8072',
        marginRight: 5,
    },
    newWrapper: {
        alignItems: 'center',
        flex: 1,
        flexDirection: 'row',
    },
    rowWrapper: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'white',
        borderBottomColor: '#eee',
        borderBottomWidth: 1,
        paddingVertical: 8,
    },
  })

class GroupsScreen extends Component {
    static navigationOptions = {
        title: 'Groups',
    }

    state = {
        modalVisible: false,
        name: '',
        image: ''
    }

    componentWillMount() {
        this.props.subscribeToGroups()
    }

    async onPress(group) {
        const joinedGroup = await this.props.joinGroup({userId: this.props.user.id, groupId: group.id})

         this.props.navigation.navigate('ChatScreen', group)
    }


    keyExtractor = (item, index) => item.id

    renderGroupItem(group) {
        return <TouchableHighlight onPress={() => this.onPress(group) }> 
            <View style={styles.rowWrapper}> 
                <Image
                    style={styles.icon}
                    source={{uri: 'https://images.duckduckgo.com/iu/?u=http%3A%2F%2Fimages.wikia.com%2Ffinalfantasy%2Fimages%2Farchive%2Fc%2Fc8%2F20111130214728%2521Vivi.jpg&f=1'}} />
                    <View style={styles.rowSplitter}> 
                        <View style={styles.textWrapper}>
                            <Text style={styles.title} numberOfLines={1}> {group.name} </Text>
                            <Text style={styles.extraData}>{`Members: ${group.members && group.members.length}`}</Text>
                        </View>
                        <View style={styles.joinIconWrapper}>
                            <Icon 
                                name={'angle-right'}
                                size={25}
                                style={{ marginRight: 9 }}
                                color={'#FA8072'}
                            />
                        </View>
                    </View>
            </View> 
        </TouchableHighlight>
    }
    
    renderHeader() { 
        return <TouchableHighlight style={styles.listHeader} onPress={() => this.setState({modalVisible: true})}> 
             <View style={styles.listHeader}><Text style={styles.headerText}>  Groups listing </Text>
             <View>
             <View style={styles.newWrapper}>
                <Text style={styles.newText}>
                New
                </Text>
                 <View style={styles.plusIcon}> 
                    <Icon 
                    name={'plus-circle'}
                    size={15}
                    style={{ marginRight: 9 }}
                    color={'#FA8072'}
                        />
                 </View>
            </View>
            </View></View>
        </TouchableHighlight>
    }

    createGroup() {
        this.props.createGroup({name: this.state.name, image: this.state.image, userId: this.props.user.id})
        this.nameTextInput.clear()
        this.nameTextInput.blur()
        this.imageTextInput.clear()
        this.imageTextInput.blur()
        this.setState({modalVisible: false})
    }

    render() {
        return <View style={styles.container}>  
            <View style={styles.padding}/>
        {this.renderHeader()}
        
            <Modal
            animationType='fade'
            transparent={true}
            visible={this.state.modalVisible}
            onRequestClose={() => {alert("Modal has been closed.")}}
            >
            <View style={{flex: 1, flexDirection: 'row', justifyContent: 'center',  backgroundColor: 'rgba(0, 0, 0, 0.5)'}}>
                <View style={{height: 350, width: 300, backgroundColor: 'white', borderRadius: 20, flexDirection: 'column', marginTop: 50}}>
                <Text style={{alignSelf: 'center', paddingTop: 10, fontSize: 20, fontWeight: 'bold', marginBottom: 40}}>New Group</Text>
    
                <TextInput 
                    placeholder={'Name'}
                    underlineColorAndroid='transparent'
                    style={styles.modalInput}
                    placeholderTextColor={'#FA8072'}
                    ref={(ref) => { this.nameTextInput = ref }}
                    onChangeText={((text) => this.setState({name: text}))}
                />
                <TextInput
                    placeholder={'Image'}
                    underlineColorAndroid='transparent'
                    style={styles.modalInput}
                    placeholderTextColor={'#FA8072'}
                    ref={(ref) => { this.imageTextInput = ref }}
                    onChangeText={((text) => this.setState({image: text}))}
                />
                <View style={{flexDirection: 'row', marginTop: 40}}>
                <TouchableHighlight style={{flex: 0.5}} onPress={() => this.setState({modalVisible: false})}>
                    <Text style={styles.modalButton}>Cancel</Text>
                </TouchableHighlight>
                <TouchableHighlight style={{flex: 0.5}} onPress={() => this.createGroup()}>
                    <Text style={styles.modalButton}>Create</Text>
                </TouchableHighlight>
                </View>
                </View>
                </View>
          </Modal>
            <FlatList
                data={this.props.groups}
                renderItem={(group) => this.renderGroupItem(group.item)}
                keyExtractor={this.keyExtractor}
                />
        </View>
    }
}

const mapStateToProps = state => ({
    user: state.user.user
  })

export default flowRight(connect(mapStateToProps), withGroupData, withGroupCreate, withGroupJoin)(GroupsScreen)
