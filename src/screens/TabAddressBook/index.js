import * as React from 'react'
import { View, Text, Button, FlatArray } from 'react-native'
import { FlatList } from 'react-native-gesture-handler'

import { connect } from 'react-redux'
import { my_styles } from '../../theme/style'

//地址薄
class TabAddressBookScreen extends React.Component {
  constructor(props) {
    super(props)
  }

  render() {
    return (
      <View>
        <Button title="标记地址" onPress={() => this.props.navigation.navigate('AddressAdd')} />
        <FlatList
          data={this.props.avatar.get('AddressArray')}
          keyExtractor={item => item.Name}
          renderItem={
            ({ item }) => {
              return (<View>
                <Text style={my_styles.Link}
                  onPress={() => this.props.navigation.navigate('AddressMark', { address: item.Address })}>
                  {`${item.Name}:${item.Address}`}
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

const ReduxTabAddressBookScreen = connect((state) => {
  return {
    avatar: state.avatar
  }
})(TabAddressBookScreen)

export default ReduxTabAddressBookScreen