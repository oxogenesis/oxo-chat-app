import * as React from 'react'
import { View, Text, FlatList } from 'react-native'

import { useNavigation, useRoute } from '@react-navigation/native'

import { connect } from 'react-redux'
import { actionType } from '../../redux/actions/actionType'
import { BulletinAddressSession, BulletinHistorySession, BulletinMarkSession } from '../../lib/Const'
import { timestamp_format, AddressToName } from '../../lib/Util'
import { my_styles } from '../../theme/style'

//公告列表
class BulletinListScreen extends React.Component {

  constructor(props) {
    super(props)
  }

  loadBulletinList() {
    if (this.props.route.params.session == BulletinMarkSession) {
      this.props.navigation.setOptions({ title: '收藏公告' })
    } else if (this.props.route.params.session == BulletinHistorySession) {
      this.props.navigation.setOptions({ title: '公告浏览历史' })
    } else if (this.props.route.params.session == BulletinAddressSession) {
      if (this.props.route.params.address == this.props.avatar.get('Address')) {
        this.props.navigation.setOptions({ title: '我的公告' })
      } else {
        this.props.navigation.setOptions({ title: `公告：${AddressToName(this.props.avatar.get('AddressMap'), this.props.route.params.address)}` })
      }
    }
    this.props.dispatch({
      type: actionType.avatar.LoadBulletinList,
      session: this.props.route.params.session,
      address: this.props.route.params.address
    })
  }

  quoteBulletin(address, sequence, hash) {
    this.props.dispatch({
      type: actionType.avatar.addQuote,
      address: address,
      sequence: sequence,
      hash: hash
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
        >
        </FlatList>
      </View>
    )
  }
}

const ReduxBulletinListScreen = connect((state) => {
  return {
    avatar: state.avatar
  }
})(BulletinListScreen)

//export default BulletinListScreen
export default function (props) {
  const navigation = useNavigation()
  const route = useRoute()
  return <ReduxBulletinListScreen{...props} navigation={navigation} route={route} />
}