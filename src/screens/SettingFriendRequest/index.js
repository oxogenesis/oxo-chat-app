import * as React from 'react'
import { View, Text, FlatList, Image } from 'react-native'


import { connect } from 'react-redux'

import { timestamp_format, AddressToName } from '../../lib/Util'
import { my_styles } from '../../theme/style'

//设置
class SettingFriendRequestScreen extends React.Component {
  constructor(props) {
    super(props)
  }

  componentDidMount() {
    this._unsubscribe = this.props.navigation.addListener('focus', () => {
      //   this.loadState()
      console.log(this.props.avatar.get('FriendRequests'))
    })
  }

  componentWillUnmount() {
    this._unsubscribe()
  }

  render() {
    return (
      <View style={my_styles.TabSheet}>
        <FlatList
          data={this.props.avatar.get('FriendRequests')}
          keyExtractor={item => item.Address}
          ListEmptyComponent={
            <Text>暂无好友申请...</Text>
          }
          renderItem={
            ({ item }) => {
              return (
                <View style={{ flexDirection: "row" }} >
                  <View>
                    <Image style={my_styles.Avatar} source={require('../../assets/app.png')}></Image>
                  </View>
                  <View>
                    <Text style={my_styles.Link}
                      onPress={() => this.props.navigation.push('AddressMark', { address: item.Address })}>
                      {`${AddressToName(this.props.avatar.get('AddressMap'), item.Address)}`}
                    </Text>
                    <Text>
                      {`@${timestamp_format(item.Timestamp)}`}
                    </Text>
                  </View>
                </View>
              )
            }
          }
        >
        </FlatList>
      </View >
    )
  }
}

const ReduxSettingFriendRequestScreen = connect((state) => {
  return {
    avatar: state.avatar
  }
})(SettingFriendRequestScreen)

export default ReduxSettingFriendRequestScreen