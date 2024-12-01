import React, { useEffect } from 'react'
import { View, FlatList } from 'react-native'
import { useNavigation, useRoute } from '@react-navigation/native'
import { connect } from 'react-redux'
import { actionType } from '../../../redux/actions/actionType'
import { BulletinAddressSession, BulletinHistorySession, BulletinMarkSession, BulletinPreviewSize } from '../../../lib/Const'
import { AddressToName } from '../../../lib/Util'
import ViewEmpty from '../../../component/ViewEmpty'
import ItemBulletin from '../../../component/ItemBulletin'
import tw from '../../../lib/tailwind'

//公告列表
const BulletinListScreen = (props) => {

  const loadBulletinList = (flag) => {
    if (props.route.params.session == BulletinMarkSession) {
      props.navigation.setOptions({ title: '收藏公告' })
    } else if (props.route.params.session == BulletinHistorySession) {
      props.navigation.setOptions({ title: '公告浏览历史' })
    } else if (props.route.params.session == BulletinAddressSession) {
      if (props.route.params.address == props.avatar.get('Address')) {
        props.navigation.setOptions({ title: '我的公告' })
      } else {
        props.navigation.setOptions({ title: `公告列表：${AddressToName(props.avatar.get('AddressMap'), props.route.params.address)}` })
      }
    }

    props.dispatch({
      type: actionType.avatar.LoadBulletinList,
      bulletin_list_flag: flag,
      session: props.route.params.session,
      address: props.route.params.address
    })
  }

  useEffect(() => {
    return props.navigation.addListener('focus', () => {
      loadBulletinList(true)
    })
  })

  return (
    <View style={tw`h-full bg-neutral-200 dark:bg-neutral-800 pt-5px px-5px`}>
      {props.avatar.get('BulletinList').length > 0 ?
        <FlatList
          style={tw``}
          data={props.avatar.get('BulletinList')}
          keyExtractor={item => item.Hash}
          // onEndReached={loadMore}
          // onEndReachedThreshold={0.05}
          // refreshing={refreshFlag}
          // onRefresh={refreshing}
          renderItem={({ item }) => (
            <ItemBulletin item={item} />
          )}
        />
        :
        <ViewEmpty msg={`暂无公告...`} />
      }
    </View>
  )
}

const ReduxBulletinListScreen = connect((state) => {
  return {
    avatar: state.avatar
  }
})(BulletinListScreen)

export default function (props) {
  const navigation = useNavigation()
  const route = useRoute()
  return <ReduxBulletinListScreen{...props} navigation={navigation} route={route} />
}