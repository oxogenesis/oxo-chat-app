import * as React from 'react';
import { View, Text, FlatList } from 'react-native';

import { useNavigation, useRoute } from '@react-navigation/native'

import { connect } from 'react-redux'
import { actionType } from '../../redux/actions/actionType'
import { WholeBulletinSession } from '../../lib/Const'
import { timestamp_format, AddressToName } from '../../lib/Util'

//公告列表
class TabBulletinScreen extends React.Component {

  loadBulletinList() {
    this.props.dispatch({
      type: actionType.avatar.LoadBulletinList,
      address: WholeBulletinSession
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
      <View>
        <FlatList
          data={this.props.avatar.get('BulletinList')}
          keyExtractor={item => item.Hash}
          renderItem={
            ({ item }) => {
              return (
                <View>
                  <Text onPress={() => this.props.navigation.navigate('AddressMark', { address: item.Address })}>
                    {`${AddressToName(this.props.avatar.get('AddressMap'), item.Address)}@${timestamp_format(item.Timestamp)}`}
                  </Text>
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