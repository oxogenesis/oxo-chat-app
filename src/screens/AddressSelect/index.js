import * as React from 'react'
import { View, Text, FlatList, Image } from 'react-native'
import { connect } from 'react-redux'
import { AddressToName } from '../../lib/Util'
import { my_styles } from '../../theme/style'

//设置
class AddressSelectScreen extends React.Component {
  constructor(props) {
    super(props)
  }

  componentDidMount() {
    this._unsubscribe = this.props.navigation.addListener('focus', () => {
      //   this.loadState()
    })
  }

  componentWillUnmount() {
    this._unsubscribe()
  }

  render() {
    return (
      <View style={my_styles.TabSheet}>
        <FlatList
          data={this.props.avatar.get('Friends')}
          keyExtractor={item => item}
          ListEmptyComponent={
            <Text>暂未添加好友...</Text>
          }
          renderItem={
            ({ item }) => {
              return (
                <View style={{ flexDirection: "row" }} >
                  <View>
                    <Image style={my_styles.Avatar} source={require('../../assets/app.png')}></Image>
                  </View>
                  <View>
                    <Text onPress={() => this.props.navigation.push('Session', { address: item, content: this.props.route.params.content })}>
                      {`${AddressToName(this.props.avatar.get('AddressMap'), item)}`}
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

const ReduxAddressSelectScreen = connect((state) => {
  return {
    avatar: state.avatar
  }
})(AddressSelectScreen)

export default ReduxAddressSelectScreen