import * as React from 'react'
import { View, Text, Button, FlatList } from 'react-native'

import { useNavigation, useRoute } from '@react-navigation/native'

import { connect } from 'react-redux'
import { actionType } from '../../redux/actions/actionType'
import { timestamp_format, AddressToName } from '../../lib/Util'
import { my_styles } from '../../theme/style'

//公告列表
class TabBulletinScreen extends React.Component {

  constructor(props) {
    super(props)
    this.state = { timestamp: 1 }
  }

  loadTabBulletinList(flag) {
    this.props.dispatch({
      type: actionType.avatar.LoadTabBulletinList,
      session_flag: flag
    })
  }

  componentDidMount() {
    this._unsubscribe = this.props.navigation.addListener('focus', () => {
      if (this.props.avatar.get('TabBulletinList').length == 0) {
        this.loadTabBulletinList(true)
      }
    })
  }

  componentWillUnmount() {
    this._unsubscribe()
  }

  render() {
    return (
      <View>
        <Button title="发布公告" onPress={() => this.props.navigation.navigate('BulletinPublish')} />
        <View style={my_styles.TabSheet}>
          <FlatList
            data={this.props.avatar.get('TabBulletinList')}
            keyExtractor={item => item.Hash}
            ListEmptyComponent={
              <Text>暂无公告...</Text>
            }
            renderItem={
              ({ item }) => {
                return (
                  <View>
                    <View style={{ flexDirection: "row" }} >
                      {
                        this.props.avatar.get('Address') == item.Address ?
                          <View style={{ backgroundColor: "yellow", flex: 0.8 }} >
                            <Text style={my_styles.Link}>
                              {`${AddressToName(this.props.avatar.get('AddressMap'), item.Address)}`}
                            </Text>
                          </View>
                          :
                          <View style={{ backgroundColor: "yellow", flex: 0.8 }} >
                            <Text style={my_styles.Link} onPress={() => this.props.navigation.push('AddressMark', { address: item.Address })}>
                              {`${AddressToName(this.props.avatar.get('AddressMap'), item.Address)}`}
                            </Text>
                          </View>
                      }
                      <View style={{ backgroundColor: "orange", flex: 0.2 }} >
                        <Text style={{ color: 'blue', fontWeight: 'bold', textAlign: "right" }}
                          onPress={() => this.props.navigation.push('Bulletin', { hash: item.Hash })}>
                          {`#${item.Sequence}`}
                        </Text>
                      </View>
                    </View>
                    <View style={{ flexDirection: "row" }} >
                      <View style={{ backgroundColor: "green", flex: 0.8 }} >
                        <Text >{`@${timestamp_format(item.Timestamp)}`}</Text>
                      </View>
                      {
                        item.QuoteSize != 0 &&
                        <View style={{ backgroundColor: "red", flex: 0.2 }} >
                          <Text style={{ textAlign: "right" }}>{`◀${item.QuoteSize}`}</Text>
                        </View>
                      }
                    </View>
                    <Text style={my_styles.BulletinContentHeader} ellipsizeMode={"tail"} numberOfLines={2}>{item.Content}</Text>
                  </View>
                )
              }
            }
            onEndReachedThreshold={0.01}
            onEndReached={() => { this.loadTabBulletinList(false) }}
          >
          </FlatList>
        </View>
      </View >
    )
  }
}

const ReduxTabBulletinScreen = connect((state) => {
  return {
    avatar: state.avatar
  }
})(TabBulletinScreen)

//export default TabBulletinScreen
export default function (props) {
  const navigation = useNavigation()
  const route = useRoute()
  return <ReduxTabBulletinScreen{...props} navigation={navigation} route={route} />
}