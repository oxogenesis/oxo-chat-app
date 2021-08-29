import * as React from 'react'
import { View, Text, TextInput, Button, FlatList } from 'react-native'

import { useNavigation, useRoute } from '@react-navigation/native'
import { timestamp_format, AddressToName } from '../../lib/Util'
import { DefaultDivision } from '../../lib/Const'
import { DHSequence } from '../../lib/OXO'
import { actionType } from '../../redux/actions/actionType'

import { connect } from 'react-redux'

//聊天会话界面
class SessionScreen extends React.Component {
  constructor(props) {
    super(props)
    this.state = { address: '', name: '', message_list: [], message_input: '', error_msg: '' }
  }

  sendMessage() {
    let timestamp = Date.now()
    let message_input = this.state.message_input.trim()
    if (message_input == "") {
      this.setState({ error_msg: '消息不能为空...' })
    } else {
      let ecdh_sequence = DHSequence(DefaultDivision, timestamp, this.props.avatar.get("Address"), this.state.address)
      let current_session = this.props.avatar.get("CurrentSession")
      console.log(current_session)
      console.log(ecdh_sequence)
      if (ecdh_sequence != current_session.EcdhSequence) {
        this.setState({ error_msg: '握手未完成...' })
      } else {
        this.props.dispatch({
          type: actionType.avatar.SendFriendMessage,
          address: this.state.address,
          message: message_input,
          timestamp: timestamp
        })
        this.setState({ message_input: '', error_msg: '' })
      }
    }
  }

  componentDidMount() {
    this._unsubscribe = this.props.navigation.addListener('focus', () => {
      let name = AddressToName(this.props.avatar.get('AddressMap'), this.props.route.params.address)
      this.setState({ name: name, address: this.props.route.params.address })
      this.props.navigation.setOptions({ title: name })
      this.props.dispatch({
        type: actionType.avatar.LoadCurrentSession,
        address: this.props.route.params.address
      })
      this.props.dispatch({
        type: actionType.avatar.LoadCurrentMessageList,
        address: this.props.route.params.address
      })
    })
  }

  componentWillUnmount() {
    this._unsubscribe()
  }

  render() {
    return (
      <View style={{ flexDirection: "column" }}>
        <View style={{ flexDirection: "row-reverse" }}>
          {
            this.props.avatar.get("CurrentSession").AesKey ?
              <Button
                style={{ flex: 0.2 }}
                title="发送"
                onPress={() => this.sendMessage()}
              />
              :
              <Button
                style={{ flex: 0.2 }}
                title="发送"
                disabled={true}
              />
          }
          <TextInput
            placeholder="消息"
            value={this.state.message_input}
            multiline={true}
            style={{ flex: 1 }}
            onChangeText={text => this.setState({ message_input: text })}
          />
        </View>

        {
          this.state.error_msg.length > 0 &&
          <Text>{this.state.error_msg}</Text>
        }

        <View style={{ paddingBottom: 100 }}>
          <FlatList
            data={this.props.avatar.get("CurrentMessageList")}
            keyExtractor={item => item.Hash}
            ListEmptyComponent={
              <Text>暂无消息...</Text>
            }
            renderItem={
              ({ item }) => {
                return (
                  <>
                    {
                      item.SourAddress == this.state.address ?
                        <View style={{ flexDirection: "row" }} >
                          <View style={{ flex: 0.8 }}>
                            <View>
                              <Text style={{ color: 'grey' }}>
                                {`${this.state.name}#${item.Sequence}@${timestamp_format(item.Timestamp)}`}
                              </Text>
                              <View style={{ flexDirection: "row" }} >
                                {
                                  item.Confirmed ?
                                    <Text style={{ backgroundColor: '#2edfa3' }}>{`${item.Content}`}</Text>
                                    :
                                    <Text style={{ backgroundColor: '#c2ccd0' }}>{`${item.Content}`}</Text>
                                }
                              </View>
                            </View>
                          </View>
                          <View style={{ flex: 0.2 }}>
                          </View>
                        </View>
                        :
                        <View style={{ flexDirection: "row" }} >
                          <View style={{ flex: 0.2 }}>
                          </View>
                          <View style={{ flex: 0.8, flexDirection: "row-reverse" }}>
                            <View>
                              <Text style={{ color: 'grey', textAlign: "right" }}>
                                {`${this.props.avatar.get('Name')}#${item.Sequence}@${timestamp_format(item.Timestamp)}`}
                              </Text>
                              <View style={{ flexDirection: "row-reverse" }} >
                                {
                                  item.Confirmed ?
                                    <Text style={{ textAlign: "auto", backgroundColor: '#2edfa3' }}>{`${item.Content}`}</Text>
                                    :
                                    <Text style={{ textAlign: "auto", backgroundColor: '#c2ccd0' }}>{`${item.Content}`}</Text>
                                }
                              </View>
                            </View>
                          </View>
                        </View>
                    }
                  </>
                )
              }
            }
            onEndReachedThreshold={0.01}
            onEndReached={() => { }}
          >
          </FlatList>
        </View>
      </View>
    )
  }
}

const ReduxSessionScreen = connect((state) => {
  return {
    avatar: state.avatar
  }
})(SessionScreen)

//export default SessionScreen
export default function (props) {
  const navigation = useNavigation()
  const route = useRoute()
  return <ReduxSessionScreen{...props} navigation={navigation} route={route} />
}