import * as React from 'react'
import { View, Text, TextInput, Button, FlatList } from 'react-native'

import { connect } from 'react-redux'
import { actionType } from '../../redux/actions/actionType'

//登录界面
class SettingNetworkScreen extends React.Component {
  constructor(props) {
    super(props)
    this.state = { host_input: '', current_host: '', hosts: [], error_msg: '' }
  }

  loadHosts() {
    this.setState({
      hosts: this.props.avatar.get('Hosts'),
      current_host: this.props.avatar.get('CurrentHost')
    })
  }

  componentDidMount() {
    this._unsubscribe = this.props.navigation.addListener('focus', () => {
      this.loadHosts()
    });
  }

  componentWillUnmount() {
    this._unsubscribe();
  }

  addHost() {
    let host_input = this.state.host_input.trim()
    let regx = /^ws[s]?:\/\/.+/
    let rs = regx.exec(host_input)
    if (rs == null) {
      this.setState({ error_msg: 'address invalid...' })
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

  render() {
    return (
      <>
        <Text>{`在用服务器：${this.state.current_host}`}</Text>
        <TextInput
          placeholder="ws:// or wss://"
          value={this.state.host_input}
          onChangeText={text => this.setState({ host_input: text })}
        />
        {
          this.state.error_msg.length > 0 &&
          <Text>{this.state.error_msg}</Text>
        }
        <Button title="设置" onPress={() => this.addHost()} />
        <FlatList
          data={this.state.hosts}
          keyExtractor={item => item.Address}
          renderItem={
            ({ item }) => {
              return (
                <View>
                  <Text
                    onPress={() => this.changeCurrentHost(item.Address)}>
                    {`${item.UpdatedAt}<==${item.Address}`}
                  </Text>
                </View>);
            }
          }
        >
        </FlatList>
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