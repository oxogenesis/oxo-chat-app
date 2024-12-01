import React, { useState, useEffect } from 'react'
import { View, Text, FlatList } from 'react-native'
import { useNavigation, useRoute } from '@react-navigation/native'
import { connect } from 'react-redux'
import { actionType } from '../../../redux/actions/actionType'
import ViewEmpty from '../../../component/ViewEmpty'
import ItemBulletin from '../../../component/ItemBulletin'
import tw from '../../../lib/tailwind'
import { ConsoleWarn } from '../../../lib/Util'

//公告Tab
const TabBulletinScreen = (props) => {
  const [refreshFlag, setRefreshFlag] = useState(false)
  const [loadmoreFlag, setLoadmoreFlag] = useState(false)

  const loadTabBulletinList = (flag) => {
    props.dispatch({
      type: actionType.avatar.LoadTabBulletinList,
      bulletin_list_flag: flag
    })
  }

  useEffect(() => {
    return props.navigation.addListener('focus', () => {
      if (props.avatar.get('TabBulletinList').length == 0) {
        // ConsoleWarn(typeof list)
        // ConsoleWarn(Array.isArray(list))
        // list = JSON.parse(JSON.stringify(list))
        loadTabBulletinList(true)
      }
    })
  })

  //向上拉到底部，加载更到本地公告
  const loadMore = () => {
    if (loadmoreFlag) {
      ConsoleWarn("现在正在加载")
    } else {
      ConsoleWarn("上拉加载")
      setLoadmoreFlag(true)
      loadTabBulletinList(false)
      setTimeout(() => {
        setLoadmoreFlag(false)
      }, 1000)
    }
  }

  //向下拉，从服务器请求更多公告
  const refreshing = () => {
    if (refreshFlag) {
      ConsoleWarn("现在正在刷新")
    } else {
      ConsoleWarn("下拉刷新")
      setRefreshFlag(true)
      props.dispatch({ type: actionType.avatar.UpdateFollowBulletin })
      setRefreshFlag(false)
    }
  }

  useEffect(() => {
    // TODO:refresh
    // ConsoleWarn(`TabBulletinScreen===========================${props.avatar.get('TabBulletinList').length}`)
    // if (props.avatar.get('AvatarDB') != null && props.avatar.get('AvatarDB') != null) {
    //   props.navigation.replace('TabHome')
    // }
  }, [props.avatar])

  const list = props.avatar.get('TabBulletinList')

  return (
    <View style={tw`h-full bg-neutral-200 dark:bg-neutral-800 pt-5px px-5px`}>
      {
        !props.avatar.get('ConnStatus') &&
        <View style={tw`bg-red-200 p-4`}>
          <Text style={tw`text-base text-center`}>
            未连接服务器，请检查网络设置或连通性
          </Text>
        </View>
      }
      {
        props.avatar.get('TabBulletinList').length > 0 ?
          <FlatList
            style={tw``}
            data={props.avatar.get('TabBulletinList')}
            keyExtractor={item => item.Hash}
            onEndReached={loadMore}
            onEndReachedThreshold={0.05}
            refreshing={refreshFlag}
            onRefresh={refreshing}
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

const ReduxTabBulletinScreen = connect((state) => {
  return {
    avatar: state.avatar
  }
})(TabBulletinScreen)

export default function (props) {
  const navigation = useNavigation()
  const route = useRoute()
  return <ReduxTabBulletinScreen{...props} navigation={navigation} route={route} />
}