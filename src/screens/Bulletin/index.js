import * as React from 'react'
import { View, ScrollView, Text, FlatList } from 'react-native'

import { useNavigation, useRoute } from '@react-navigation/native'

import { connect } from 'react-redux'
import { actionType } from '../../redux/actions/actionType'
import { GenesisHash } from '../../lib/Const'
import { timestamp_format, AddressToName } from '../../lib/Util'
import { my_styles } from '../../theme/style'
import IconFontisto from 'react-native-vector-icons/Fontisto'
import IconMaterialIcons from 'react-native-vector-icons/MaterialIcons'

//公告列表
class BulletinScreen extends React.Component {

  constructor(props) {
    super(props)
  }

  markBulletin(hash) {
    this.props.dispatch({
      type: actionType.avatar.MarkBulletin,
      hash: hash
    })
  }

  unmarkBulletin(hash) {
    this.props.dispatch({
      type: actionType.avatar.UnmarkBulletin,
      hash: hash
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
              <View style={{ flexDirection: "row" }} >
                <View style={{ backgroundColor: "yellow", flex: 0.9 }} >
                  <Text style={my_styles.Link} onPress={() => this.props.navigation.push('AddressMark', { address: this.props.avatar.get('CurrentBulletin').Address })}>
                    {`${AddressToName(this.props.avatar.get('AddressMap'), this.props.avatar.get('CurrentBulletin').Address)}`}
                  </Text>
                </View>
                <View style={{ backgroundColor: "red", flex: 0.1 }} >
                  <Text style={my_styles.Link} onPress={() => this.props.navigation.push('Bulletin', { hash: this.props.avatar.get('CurrentBulletin').Hash })}>
                    {`#${this.props.avatar.get('CurrentBulletin').Sequence}`}
                  </Text>
                </View>
              </View>
              <Text>{`@${timestamp_format(this.props.avatar.get('CurrentBulletin').Timestamp)}`}</Text>
              <View style={{ flexDirection: "row" }} >
                {
                  this.props.avatar.get('CurrentBulletin').IsMark == "TRUE" ?
                    <IconFontisto
                      name={'bookmark-alt'}
                      size={24}
                      color='red'
                      onPress={() => this.unmarkBulletin(this.props.avatar.get('CurrentBulletin').Hash)}
                    />
                    :
                    <IconFontisto
                      name={'bookmark'}
                      size={24}
                      onPress={() => this.markBulletin(this.props.avatar.get('CurrentBulletin').Hash)}
                    />
                }
                {
                  this.props.avatar.get('CurrentBulletin').PreHash != GenesisHash &&
                  <IconMaterialIcons
                    name={'skip-previous'}
                    size={24}
                    color='blue'
                    onPress={() => this.props.navigation.push('Bulletin', {
                      address: this.props.avatar.get('CurrentBulletin').Address,
                      sequence: this.props.avatar.get('CurrentBulletin').Sequence - 1,
                      hash: this.props.avatar.get('CurrentBulletin').PreHash,
                      to: this.props.avatar.get('CurrentBulletin').Address
                    })}
                  />
                }
                <IconMaterialIcons
                  name={'format-quote'}
                  size={24}
                  color='blue'
                  onPress={() =>
                    this.quoteBulletin(this.props.avatar.get('CurrentBulletin').Address,
                      this.props.avatar.get('CurrentBulletin').Sequence,
                      this.props.avatar.get('CurrentBulletin').Hash)}
                />
              </View>
              <ScrollView>
                <Text>{this.props.avatar.get('CurrentBulletin').Content}</Text>
              </ScrollView>
              <FlatList
                data={this.props.avatar.get('CurrentBulletin').QuoteList}
                keyExtractor={item => item.Hash}
                renderItem={
                  ({ item }) => {
                    return (
                      <View>
                        <Text style={my_styles.Link} onPress={() => this.props.navigation.push('Bulletin', {
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
            </>
        }
      </View>
    )
  }
}
import { from } from 'readable-stream'

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