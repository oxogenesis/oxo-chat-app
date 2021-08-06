import * as React from 'react';
import { View, Text, FlatList } from 'react-native';

import { useNavigation, useRoute } from '@react-navigation/native'

import { connect } from 'react-redux'
import { actionType } from '../../redux/actions/actionType'
import { WholeBulletinSession } from '../../lib/Const'
import { timestamp_format, AddressToName } from '../../lib/Util'
import { my_styles } from '../../theme/style'

//公告列表
class BulletinListScreen extends React.Component {

  constructor(props) {
    super(props)
    this.state = { address: '', name: '', bulletin_list: [] }
  }

  loadBulletinList() {
    if (this.props.route.params == null) {
      this.props.dispatch({
        type: actionType.avatar.LoadBulletinList,
        address: WholeBulletinSession
      })
      this.setState({ bulletin_list: this.props.avatar.get('BulletinList') })
    } else {
      this.props.dispatch({
        type: actionType.avatar.LoadBulletinList,
        address: this.props.route.params.address
      })
      this.setState({
        address: this.props.route.params.address,
        name: this.props.avatar.get('AddressMap')[this.props.route.params.address],
        bulletin_list: this.props.avatar.get('BulletinList')
      })
    }
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
        <Text>{`地址:${this.state.address}`}</Text>
        <Text>{`昵称:${AddressToName(this.props.avatar.get('AddressMap'), this.state.address)}`}</Text>
        <FlatList
          data={this.props.avatar.get('BulletinList')}
          keyExtractor={item => item.Hash}
          renderItem={
            ({ item }) => {
              return (
                <View>
                  <Text>{`=======================================`}</Text>
                  <Text style={my_styles.Link} onPress={() => this.props.navigation.navigate('AddressMark', { address: item.Address })}>
                    {`${AddressToName(this.props.avatar.get('AddressMap'), item.Address)}`}
                  </Text>
                  <Text style={my_styles.Link} onPress={() => this.props.navigation.push('Bulletin', { hash: item.Hash })}>
                    {`#${item.Sequence}(${item.Hash})`}
                  </Text>
                  {
                    item.QuoteSize != 0 &&
                    <Text>{`"${item.QuoteSize}"`}</Text>
                  }
                  <Text>{`@${timestamp_format(item.Timestamp)}`}</Text>
                  <Text style={my_styles.Link} onPress={() => this.quoteBulletin(item.Address, item.Sequence, item.Hash)}>引用</Text>
                  <Text>{item.Content}</Text>
                </View>);
            }
          }
        >
        </FlatList>
      </View>
    )
  }
}
import { from } from 'readable-stream';

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