import * as React from 'react'
import { View, Text, TextInput, Button, FlatList, Alert } from 'react-native'

import { connect } from 'react-redux'
import { actionType } from '../../redux/actions/actionType'
import { my_styles } from '../../theme/style'

//登录界面
class SettingNetworkScreen extends React.Component {
  constructor(props) {
    super(props)
    this.state = { host_input: '', error_msg: '' }
  }

  addHost() {
    let host_input = this.state.host_input.trim()
    let regx = /^ws[s]?:\/\/.+/
    let rs = regx.exec(host_input)
    if (rs == null) {
      this.setState({ error_msg: '地址格式无效...' })
    } else {
      this.props.dispatch({
        type: actionType.avatar.addHost,
        host: host_input
      })
      this.setState({ host_input: '', error_msg: '' })
    }
  }

  changeCurrentHost(host) {
    this.props.dispatch({
      type: actionType.avatar.changeCurrentHost,
      host: host
    })
  }

  delHostAlert(host) {
    Alert.alert(
      '提示',
      `确定要删除${host}吗？`,
      [
        { text: '确认', onPress: () => this.delHost(host) },
        { text: '取消', style: 'cancel' },
      ],
      { cancelable: false }
    )
  }

  delHost(host) {
    this.props.dispatch({
      type: actionType.avatar.delHost,
      host: host
    })
  }

  render() {
    return (
      <>
        <TextInput
          placeholder="ws://或者wss://"
          value={this.state.host_input}
          onChangeText={text => this.setState({ host_input: text })}
        />
        {
          this.state.error_msg.length > 0 &&
          <Text>{this.state.error_msg}</Text>
        }
        <Button title="设置" onPress={() => this.addHost()} />
        <FlatList
          data={this.props.avatar.get('Hosts')}
          keyExtractor={item => item.Address}
          ListEmptyComponent={
            <Text>暂未设置服务器地址...</Text>
          }
          renderItem={
            ({ item }) => {
              return (
                <View style={{ flexDirection: "row" }} >
                  <View style={{ backgroundColor: "yellow", flex: 0.8 }} >
                    <Text>{item.Address}</Text>
                  </View>
                  {
                    item.Address == this.props.avatar.get('CurrentHost') ?
                      <View style={{ backgroundColor: "green", flex: 0.2 }} >
                        <Text>
                          {`当前在用`}
                        </Text>
                      </View>
                      :
                      <>
                        <View style={{ backgroundColor: "orange", flex: 0.1 }} >
                          <Text style={my_styles.Link}
                            onPress={() => this.changeCurrentHost(item.Address)}>
                            {`使用`}
                          </Text>
                        </View>
                        <View style={{ backgroundColor: "red", flex: 0.1 }} >
                          <Text style={my_styles.Link}
                            onPress={() => this.delHostAlert(item.Address)}>
                            {`删除`}
                          </Text>
                        </View>
                      </>
                  }
                </View>
              )
            }
          }
        >
        </FlatList >
      </>
    )
  }
}

const ReduxSettingNetworkScreen = connect((state) => {
  return {
    avatar: state.avatar
  }
})(SettingNetworkScreen)

export default ReduxSettingNetworkScreen