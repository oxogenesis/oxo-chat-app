import * as React from 'react'
import { View, Text, FlatList } from 'react-native'

import { useNavigation, useRoute } from '@react-navigation/native'

import { connect } from 'react-redux'
import { actionType } from '../../redux/actions/actionType'
import { GenesisHash } from '../../lib/Const'
import { timestamp_format, AddressToName } from '../../lib/Util'
import { my_styles } from '../../theme/style'
import IconFontisto from 'react-native-vector-icons/Fontisto'

//公告列表
class BulletinInfoScreen extends React.Component {

  constructor(props) {
    super(props)
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
    })
  }

  componentWillUnmount() {
    this._unsubscribe()
  }

  render() {
    return (
      <View style={[my_styles.container, {
        flexDirection: "column"
      }]}>
        {
          this.props.avatar.get('CurrentBulletin') == null ?
            <Text>not found...</Text>
            :
            <>
              <Text>{`哈希：${this.props.route.params.hash}`}</Text>
              <Text>{`地址：${this.props.avatar.get('CurrentBulletin').Address}`}</Text>
              <Text>{`昵称：${AddressToName(this.props.avatar.get('AddressMap'), this.props.avatar.get('CurrentBulletin').Address)}`}</Text>
              <Text>{`序号：${this.props.avatar.get('CurrentBulletin').Sequence}`}</Text>
              <Text>{`时间：${timestamp_format(this.props.avatar.get('CurrentBulletin').Timestamp)}`}</Text>
              <Text>{`引用：${this.props.avatar.get('CurrentBulletin').QuoteSize}`}</Text>
              <Text style={my_styles.SeperateLine}>{`<-------------------------------->`}</Text>
              <Text>{this.props.avatar.get('CurrentBulletin').Content}</Text>
              {
                this.props.avatar.get('CurrentBulletin').QuoteSize != 0 &&
                <FlatList
                  data={this.props.avatar.get('CurrentBulletin').QuoteList}
                  keyExtractor={item => item.Hash}
                  renderItem={
                    ({ item }) => {
                      return (
                        <View>
                          <Text style={my_styles.Link} onPress={() =>
                            this.props.navigation.push('Bulletin', {
                              address: item.Address,
                              sequence: item.Sequence,
                              hash: item.Hash,
                              to: this.props.avatar.get('CurrentBulletin').Address
                            })}>
                            {`${AddressToName(this.props.avatar.get('AddressMap'), item.Address)}#${item.Sequence}`}
                          </Text>
                        </View>)
                    }
                  }
                >
                </FlatList>
              }
            </>
        }
      </View>
    )
  }
}
import { from } from 'readable-stream'

const ReduxBulletinInfoScreen = connect((state) => {
  return {
    avatar: state.avatar
  }
})(BulletinInfoScreen)

//export default BulletinInfoScreen
export default function (props) {
  const navigation = useNavigation()
  const route = useRoute()
  return <ReduxBulletinInfoScreen{...props} navigation={navigation} route={route} />
}