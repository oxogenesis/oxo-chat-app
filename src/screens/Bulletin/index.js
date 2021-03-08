import * as React from 'react';
import { View, Text, FlatList } from 'react-native';

import { useNavigation, useRoute } from '@react-navigation/native'

import { connect } from 'react-redux'
import { actionType } from '../../redux/actions/actionType'
import { GenesisHash } from '../../lib/Const'
import { timestamp_format, AddressToName } from '../../lib/Util'

//公告列表
class BulletinScreen extends React.Component {

  constructor(props) {
    super(props)
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
      console.log(this.props.route.params.hash)
      this.props.dispatch({
        type: actionType.avatar.LoadCurrentBulletin,
        address: this.props.route.params.address,
        sequence: this.props.route.params.sequence,
        hash: this.props.route.params.hash,
        to: this.props.route.params.to
      })
    });
  }

  componentWillUnmount() {
    this._unsubscribe();
  }

  render() {
    return (
      <View>
        <Text>{`哈希:${this.props.route.params.hash}`}</Text>
        <Text>{`=======================================`}</Text>
        {
          this.props.avatar.get('CurrentBulletin') == null ?
            <Text>not found...</Text>
            :
            <View>
              <Text>{`地址:${this.props.avatar.get('CurrentBulletin').Address}`}</Text>
              <Text onPress={() => this.props.navigation.push('AddressMark', { address: this.props.avatar.get('CurrentBulletin').Address })}>
                {`昵称:${AddressToName(this.props.avatar.get('AddressMap'), this.props.avatar.get('CurrentBulletin').Address)}`}
              </Text>
              <Text>
                {`#${this.props.avatar.get('CurrentBulletin').Sequence}(${this.props.avatar.get('CurrentBulletin').Hash})`}
              </Text>
              {this.props.avatar.get('CurrentBulletin').PreHash != GenesisHash &&
                <Text onPress={() => this.props.navigation.push('Bulletin', {
                  address: this.props.avatar.get('CurrentBulletin').Address,
                  sequence: this.props.avatar.get('CurrentBulletin').Sequence - 1,
                  hash: this.props.avatar.get('CurrentBulletin').PreHash,
                  to: this.props.avatar.get('CurrentBulletin').Address
                })}>上一篇</Text>
              }
              {
                this.props.avatar.get('CurrentBulletin').QuoteSize != 0 &&
                <FlatList
                  data={this.props.avatar.get('CurrentBulletin').QuoteList}
                  keyExtractor={item => item.Hash}
                  renderItem={
                    ({ item }) => {
                      return (
                        <View>
                          <Text onPress={() => this.props.navigation.push('Bulletin', {
                            address: item.Address,
                            sequence: item.Sequence,
                            hash: item.Hash,
                            to: this.props.avatar.get('CurrentBulletin').Address
                          })}>
                            {`【${AddressToName(this.props.avatar.get('AddressMap'), item.Address)}#${item.Sequence}】`}
                          </Text>
                        </View>)
                    }
                  }
                >
                </FlatList>
              }
              <Text>{`时间：${timestamp_format(this.props.avatar.get('CurrentBulletin').Timestamp)}`}</Text>
              <Text onPress={() =>
                this.quoteBulletin(this.props.avatar.get('CurrentBulletin').Address,
                  this.props.avatar.get('CurrentBulletin').Sequence,
                  this.props.avatar.get('CurrentBulletin').Hash)}>【引用】
                </Text>
              <Text>{`=======================================`}</Text>
              <Text>{this.props.avatar.get('CurrentBulletin').Content}</Text>
            </View>
        }
      </View>
    )
  }
}
import { from } from 'readable-stream';

const ReduxBulletinScreen = connect((state) => {
  return {
    avatar: state.avatar
  }
})(BulletinScreen)

//export default BulletinScreen
export default function (props) {
  const navigation = useNavigation()
  const route = useRoute()
  return <ReduxBulletinScreen{...props} navigation={navigation} route={route} />
}