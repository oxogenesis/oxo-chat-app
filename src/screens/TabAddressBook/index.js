import * as React from 'react'
import { View, Text, Image, Button, FlatList, TouchableOpacity } from 'react-native'

import { connect } from 'react-redux'
import { my_styles } from '../../theme/style'

//地址薄
class TabAddressBookScreen extends React.Component {
  constructor(props) {
    super(props)
  }

  render() {
    return (
      <View style={my_styles.TabSheet}>
        <Button title="扫描标记地址" onPress={() => this.props.navigation.navigate('AddressScan')} />
        <Button title="手动标记地址" onPress={() => this.props.navigation.navigate('AddressAdd')} />
        <FlatList
          data={this.props.avatar.get('AddressArray')}
          keyExtractor={item => item.Name}
          ListEmptyComponent={
            <Text>暂未标记地址...</Text>
          }
          renderItem={
            ({ item }) => {
              return (
                <TouchableOpacity
                  style={{ flexDirection: "row" }}
                  onPress={() => this.props.navigation.push('AddressMark', { address: item.Address })}>
                  <View>
                    <Image style={my_styles.Avatar} source={require('../../assets/app.png')}></Image>
                  </View>
                  <View>
                    <Text style={my_styles.Link}>
                      {`${item.Name}`}
                    </Text>
                  </View>
                </TouchableOpacity>
              )
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