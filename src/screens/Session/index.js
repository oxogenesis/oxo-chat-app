import * as React from 'react'
import { View, Text, TextInput, Button, FlatList } from 'react-native'

import { useNavigation, useRoute } from '@react-navigation/native'
import { timestamp_format, AddressToName } from '../../lib/Util'
import { actionType } from '../../redux/actions/actionType'

import { connect } from 'react-redux'

//聊天会话界面
class SessionScreen extends React.Component {
  constructor(props) {
    super(props)
    this.state = { address: '', name: '', message_list: [], message: '' }
  }

  loadMessageList() {
    this.setState({
      message_list: [
        {
          SourAddress: "oGmPAefRgXKwFptiXwmTZngX8mNVrikZ5z",
          Sequence: 11,
          Hash: '11',
          Timestamp: 1628608850592,
          Content: '111'
        },
        {
          SourAddress: "oGmPAefRgXKwFptiXwmTZngX8mNVrikZ5z",
          Sequence: 22,
          Hash: '22',
          Timestamp: 1628608850592,
          Content: '222'
        },
        {
          SourAddress: "",
          Sequence: 88,
          Hash: '88',
          Timestamp: 1628608850592,
          Content: 'aaa'
        },
        {
          SourAddress: "oGmPAefRgXKwFptiXwmTZngX8mNVrikZ5z",
          Sequence: 33,
          Hash: '33',
          Timestamp: 1628608850592,
          Content: '333'
        },
        {
          SourAddress: "",
          Sequence: 89,
          Hash: '89',
          Timestamp: 1628608850592,
          Content: 'bbb'
        },
        {
          SourAddress: "",
          Sequence: 90,
          Hash: '90',
          Timestamp: 1628608850592,
          Content: 'ccc'
        },
        {
          SourAddress: "oGmPAefRgXKwFptiXwmTZngX8mNVrikZ5z",
          Sequence: 34,
          Hash: '34',
          Timestamp: 1628608850592,
          Content: '444'
        },
        {
          SourAddress: "",
          Sequence: 91,
          Hash: '91',
          Timestamp: 1628608850592,
          Content: 'ddd'
        },
        {
          SourAddress: "",
          Sequence: 92,
          Hash: '92',
          Timestamp: 1628608850592,
          Content: 'eee'
        },
        {
          SourAddress: "oGmPAefRgXKwFptiXwmTZngX8mNVrikZ5z",
          Sequence: 35,
          Hash: '35',
          Timestamp: 1628608850592,
          Content: '555'
        },
        {
          SourAddress: "oGmPAefRgXKwFptiXwmTZngX8mNVrikZ5z",
          Sequence: 36,
          Hash: '36',
          Timestamp: 1628608850592,
          Content: '666'
        },
        {
          SourAddress: "oGmPAefRgXKwFptiXwmTZngX8mNVrikZ5z",
          Sequence: 37,
          Hash: '37',
          Timestamp: 1728708850592,
          Content: `'999'
          kkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkk
          llllllllllllllllllllllllllllllllllllllllllll
          ;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;`
        },
        {
          SourAddress: "oGmPAefRgXKwFptiXwmTZngX8mNVrikZ5z",
          Sequence: 38,
          Hash: '38',
          Timestamp: 1828808850592,
          Content: `'999'
          kkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkk
          llllllllllllllllllllllllllllllllllllllllllll
          ;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;`
        },
        {
          SourAddress: "oGmPAefRgXKwFptiXwmTZngX8mNVrikZ5z",
          Sequence: 39,
          Hash: '39',
          Timestamp: 1928908850592,
          Content: `'999'
          kkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkk
          llllllllllllllllllllllllllllllllllllllllllll
          ;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;`
        }
      ]
    })
  }

  componentDidMount() {
    this._unsubscribe = this.props.navigation.addListener('focus', () => {
      let name = AddressToName(this.props.avatar.get('AddressMap'), this.props.route.params.address)
      this.setState({ name: name, address: this.props.route.params.address })
      this.props.navigation.setOptions({ title: name })
      this.props.dispatch({
        type: actionType.avatar.FriendSessionHandshake,
        address: this.props.route.params.address
      })
      this.loadMessageList()
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
            this.props.avatar.get("CurrentSession") == null ?
              <Button
                style={{ flex: 0.2 }}
                title="发送"
                disabled={true}
                onPress={() => this.loadMessageList()}
              />
              :
              <Button
                style={{ flex: 0.2 }}
                title="发送"
                onPress={() => this.loadMessageList()}
              />
          }
          <TextInput
            placeholder="消息"
            value={this.state.message}
            multiline={true}
            style={{ backgroundColor: "yellow", flex: 1 }}
            onChangeText={text => this.setState({ message: text })}
          />
        </View>

        <View style={{ paddingBottom: 100 }}>
          <FlatList
            data={this.state.message_list}
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
                            <Text style={{ color: 'grey' }}>
                              {`${this.state.name}#${item.Sequence}@${timestamp_format(item.Timestamp)}`}
                            </Text>
                            <Text>{`${item.Content}`}</Text>
                          </View>
                          <View style={{ flex: 0.2 }}>
                          </View>
                        </View>
                        :
                        <View style={{ flexDirection: "row" }} >
                          <View style={{ flex: 0.2 }}>
                          </View>
                          <View style={{ flex: 0.8 }}>
                            <Text style={{ color: 'grey', textAlign: "right" }}>
                              {`${this.props.avatar.get('Name')}#${item.Sequence}@${timestamp_format(item.Timestamp)}`}
                            </Text>
                            <Text style={{ textAlign: "right" }}>{`${item.Content}`}</Text>
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