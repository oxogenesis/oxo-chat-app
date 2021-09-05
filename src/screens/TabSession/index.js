import * as React from 'react'
import { View, Text, FlatList, Image } from 'react-native'
import { connect } from 'react-redux'
import { actionType } from '../../redux/actions/actionType'

import { timestamp_format, AddressToName } from '../../lib/Util'
import { my_styles } from '../../theme/style'

//聊天对象列表
class TabSessionScreen extends React.Component {


  componentDidMount() {
    this._unsubscribe = this.props.navigation.addListener('focus', () => {

    })
  }

  componentWillUnmount() {
    this._unsubscribe()
  }

  render() {
    return (
      <View style={my_styles.TabSheet}>
        <FlatList
          data={this.props.avatar.get('SessionList')}
          keyExtractor={item => item.Address}
          ListEmptyComponent={
            <Text>暂未设置好友...</Text>
          }
          renderItem={
            ({ item }) => {
              return (
                <View style={{ flexDirection: "row" }} >
                  <View>
                    <Image style={my_styles.Avatar} source={require('../../assets/app.png')}></Image>
                  </View>
                  <View style={{ backgroundColor: "grey", flex: 1 }} >
                    <View style={{ flexDirection: "row" }}>
                      <View style={{ backgroundColor: "yellow", flex: 0.5, flexDirection: "row" }} >
                        <Text onPress={() => this.props.navigation.push('Session', { address: item.Address })}>
                          {`${AddressToName(this.props.avatar.get('AddressMap'), item.Address)}`}
                        </Text>
                        {
                          item.CountUnread != 0 &&
                          <Text style={{ color: 'red' }}>{`==>${item.CountUnread}`}</Text>
                        }
                      </View>
                      <View style={{ backgroundColor: "orange", flex: 0.5 }} >
                        <Text style={{ textAlign: "right" }}>
                          {timestamp_format(item.Timestamp)}
                        </Text>
                      </View>
                    </View>
                    <Text style={{ backgroundColor: "green", flex: 0.5 }} ellipsizeMode={"tail"} numberOfLines={1}>
                      {`${item.Content}`}
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

const ReduxTabSessionScreen = connect((state) => {
  return {
    avatar: state.avatar
  }
})(TabSessionScreen)

export default ReduxTabSessionScreen

