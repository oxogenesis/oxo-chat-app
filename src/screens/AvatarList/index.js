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
    this.props.dispatch({
      type: actionType.master.setMasterKey,
      MasterKey: null
    })
    this.props.navigation.navigate('Unlock')
  }

  render() {
    return (
      <View>
        <FlatList
          data={this.state.avatarList}
          keyExtractor={item => item.Name}
          ListEmptyComponent={
            <Text>暂无账户...</Text>
          }
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
        <Button color="red" title="安全退出" onPress={() => this.lock()} />
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