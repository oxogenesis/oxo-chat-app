import * as React from 'react'
import { View, Text } from 'react-native'

import { useNavigation, useRoute } from '@react-navigation/native'

import { connect } from 'react-redux'

//聊天会话界面
class SessionScreen extends React.Component {
  constructor(props) {
    super(props)
    this.state = { address: '', message_list: [] }
  }

  loadSessionList() {
    this.setState({ address: this.props.route.params.address })
  }

  componentDidMount() {
    this._unsubscribe = this.props.navigation.addListener('focus', () => {
      this.loadSessionList()
    })
  }

  componentWillUnmount() {
    this._unsubscribe()
  }

  render() {
    return (
      <View>
        <Text>address: {this.state.address}</Text>
        <Text>name: {this.state.name}</Text>
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