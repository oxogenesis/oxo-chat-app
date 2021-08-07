import * as React from 'react'
import { View, Text, Button, FlatList } from 'react-native'

import { useNavigation, useRoute } from '@react-navigation/native'

import { connect } from 'react-redux'
import { actionType } from '../../redux/actions/actionType'
import { BulletinTabSession } from '../../lib/Const'
import { timestamp_format, AddressToName } from '../../lib/Util'
import { my_styles } from '../../theme/style'

//公告列表
class TabBulletinScreen extends React.Component {

  constructor(props) {
    super(props)
    this.state = { session: BulletinTabSession, timestamp: 1 }
  }

  loadBulletinList() {
    this.props.dispatch({
      type: actionType.avatar.LoadBulletinList,
      session: BulletinTabSession
    })
  }

  componentDidMount() {
    this._unsubscribe = this.props.navigation.addListener('focus', () => {
      this.loadBulletinList()
    })
  }

  componentWillUnmount() {
    this._unsubscribe()
  }

  render() {
    return (
      <View>
        <Button title="发布公告" onPress={() => this.props.navigation.push('BulletinPublish')} />
        <View style={my_styles.TabSheet}>
          <FlatList
            data={this.props.avatar.get('BulletinList')}
            keyExtractor={item => item.Hash}
            ListEmptyComponent={
              <Text>暂无公告...</Text>
            }
            renderItem={
              ({ item }) => {
                return (
                  <View>
                    <View style={{ flexDirection: "row" }} >
                      <View style={{ backgroundColor: "yellow", flex: 0.8 }} >
                        <Text style={my_styles.Link} onPress={() => this.props.navigation.navigate('AddressMark', { address: item.Address })}>
                          {`${AddressToName(this.props.avatar.get('AddressMap'), item.Address)}`}
                        </Text>
                      </View>
                      <View style={{ backgroundColor: "red", flex: 0.2 }} >
                        <Text style={my_styles.Link} onPress={() => this.props.navigation.push('Bulletin', { hash: item.Hash })}>
                          {`#${item.Sequence}`}
                        </Text>
                      </View>
                    </View>
                    <View style={{ flexDirection: "row" }} >
                      <View style={{ backgroundColor: "green", flex: 0.8 }} >
                        <Text>{`@${timestamp_format(item.Timestamp)}`}</Text>
                      </View>
                      {
                        item.QuoteSize != 0 &&
                        <View style={{ backgroundColor: "orange", flex: 0.2 }} >
                          <Text>{`◀${item.QuoteSize}`}</Text>
                        </View>
                      }
                    </View>
                    <Text style={my_styles.BulletinContentHeader} ellipsizeMode={"tail"} numberOfLines={2}>{item.Content}</Text>
                  </View>
                )
              }
            }
            onEndReachedThreshold={0.1}
            onEndReached={() => {
              if (this.state.page) {
                let page = this.state.page
              }
            }
            }
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