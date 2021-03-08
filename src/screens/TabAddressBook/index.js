import * as React from 'react'
import { View, Text, Button, FlatArray } from 'react-native'
import { FlatList } from 'react-native-gesture-handler'

import { connect } from 'react-redux'

//地址薄
class TabAddressBookScreen extends React.Component {
  constructor(props) {
    super(props)
    this.state = { addressArray: [] }
  }

  loadAddressArray() {
    this.setState({ addressArray: this.props.avatar.get('AddressArray') })
  }

  componentDidMount() {
    this._unsubscribe = this.props.navigation.addListener('focus', () => {
      this.loadAddressArray()
    })
  }

  componentWillUnmount() {
    this._unsubscribe();
  }

  render() {
    return (
      <View>
        <Button title="标记新地址" onPress={() => this.props.navigation.navigate('AddressAdd')} />
        <FlatList
          data={this.state.addressArray}
          keyExtractor={item => item.Name}
          renderItem={
            ({ item }) => {
              return (<View>
                <Text onPress={() => this.props.navigation.navigate('AddressMark', { address: item.Address })}>
                  {item.Name}
                </Text>
              </View>);
            }
          }
        >
        </FlatList>
      </View>
    )
  }
}

const ReduxTabAddressBookScreen = connect((state) => {
  return {
    avatar: state.avatar
  }
})(TabAddressBookScreen)

export default ReduxTabAddressBookScreen