import * as React from 'react'
import { View, Text, Button, FlatList } from 'react-native'
import AsyncStorage from '@react-native-async-storage/async-storage'

import { AvatarDerive } from '../../lib/OXO'
import { connect } from 'react-redux'
import { actionType } from '../../redux/actions/actionType'
import { my_styles } from '../../theme/style'

//登录界面
class AvatarListScreen extends React.Component {
  constructor(props) {
    super(props)
    this.state = { avatarList: [] }
  }

  loadAvatarList() {
    try {
      AsyncStorage.getItem('<#Avatars#>').then(result => {
        if (result != null) {
          this.setState({ avatarList: JSON.parse(result) })
        }
      })
    } catch (e) {
      console.log(e)
    }
  }

  componentDidMount() {
    this._unsubscribe = this.props.navigation.addListener('focus', () => {
      this.loadAvatarList()
    })
  }

  componentWillUnmount() {
    this._unsubscribe()
  }

  enableAvatar(address, name) {
    let avatar = this.state.avatarList.filter(item => item.Address == address)[0]
    AvatarDerive(avatar.save, this.props.master.get('MasterKey'))
      .then(result => {
        if (result) {
          this.props.dispatch({
            type: actionType.avatar.enableAvatar,
            seed: result,
            name: name
          })
          this.props.navigation.navigate('TabHome')
        }
      })
  }

  lock() {
    console.log(`==========================================lock`)
    console.log(this.props.master.get('MasterKey'))
    this.props.dispatch({
      type: actionType.master.setMasterKey,
      MasterKey: null
    })
    console.log(this.props.master.get('MasterKey'))
    console.log(`==========================================WTF!!!`)
    this.props.navigation.navigate('Unlock')
  }

  render() {
    return (
      <View>
        <FlatList
          data={this.state.avatarList}
          keyExtractor={item => item.Name}
          renderItem={
            ({ item }) => {
              return (
                <View>
                  <Text style={my_styles.Link}
                    onPress={() => this.enableAvatar(item.Address, item.Name)}>
                    {`${item.Name}:${item.Address}`}
                  </Text>
                </View>)
            }
          }
        >
        </FlatList>
        <Button color="red" title="Safe Lock" onPress={() => this.lock()} />
        {
          this.props.master.get('MasterKey') == '' &&
          this.props.navigation.navigate('Unlock')
        }
      </View>
    )
  }
}

const ReduxAvatarListScreen = connect((state) => {
  return {
    master: state.master,
    avatar: state.avatar
  }
})(AvatarListScreen)

export default ReduxAvatarListScreen