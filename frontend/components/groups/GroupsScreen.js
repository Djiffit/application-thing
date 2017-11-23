import React, {Component} from 'react'
import {View,
    TouchableHighlight,
     Text, 
     FlatList,
     Image,
    StyleSheet} from 'react-native'
import withGroupData from './withGroupData'
import withGroupJoin from './withGroupJoin'
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
    extraData: {
        fontSize: 9,
        marginLeft: 5,
        color: 'grey',
        flex: 0.1
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
      width: '40%',
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
    rowWrapper: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'white',
        borderBottomColor: '#eee',
        borderBottomWidth: 1,
        paddingVertical: 8,
    }
  })

class GroupsScreen extends Component {
    static navigationOptions = {
        title: 'Groups',
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
                                size={30}
                                style={{ marginRight: 9 }}
                                color={'#FA8072'}
                            />
                        </View>
                    </View>
            </View> 
        </TouchableHighlight>
    }

    render() {
        return <View style={styles.container}>  
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

export default flowRight(connect(mapStateToProps), withGroupData, withGroupJoin)(GroupsScreen)
