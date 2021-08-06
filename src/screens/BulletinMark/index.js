import * as React from 'react';
import { View, Text, FlatList } from 'react-native';

import { useNavigation, useRoute } from '@react-navigation/native'

import { connect } from 'react-redux'
import { actionType } from '../../redux/actions/actionType'
import { WholeBulletinSession } from '../../lib/Const'
import { timestamp_format, AddressToName } from '../../lib/Util'
import { my_styles } from '../../theme/style'

//公告列表
class BulletinMarkScreen extends React.Component {

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
    });
  }

  componentWillUnmount() {
    this._unsubscribe();
  }

  render() {
    return (
      <View style={[my_styles.container, {
        flexDirection: "column"
      }]}>
        <View style={{ flex: 1, backgroundColor: "red" }} />
        <View style={{ flex: 2, backgroundColor: "darkorange" }} />
        <View style={{ flex: 3, backgroundColor: "green" }} />
      </View>
    )
  }
}
import { from } from 'readable-stream';

const ReduxBulletinMarkScreen = connect((state) => {
  return {
    avatar: state.avatar
  }
})(BulletinMarkScreen)

//export default BulletinMarkScreen
export default function (props) {
  const navigation = useNavigation()
  const route = useRoute()
  return <ReduxBulletinMarkScreen{...props} navigation={navigation} route={route} />
}