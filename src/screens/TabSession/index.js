import * as React from 'react'
import { View, Text, FlatList } from 'react-native'
import { connect } from 'react-redux'

//聊天对象列表
class TabSessionScreen extends React.Component {
  constructor(props) {
    super(props)
    this.state = { session_list: [] }
  }

  loadSessionList() {
    this.setState({ session_list: this.props.avatar.get('SessionList') })
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
        <FlatList
          data={this.state.session_list}
          keyExtractor={item => item.Address}
          renderItem={
            ({ item }) => {
              return (<View>
                <Text onPress={() => this.props.navigation.push('Session', { address: item.Address })}>
                  {item.Name}
                </Text>
              </View>)
            }
          }
        >
        </FlatList>
      </View>
    )
  }
}

const ReduxTabSessionScreen = connect((state) => {
  return {
    avatar: state.avatar
  }
})(TabSessionScreen)

export default ReduxTabSessionScreen

