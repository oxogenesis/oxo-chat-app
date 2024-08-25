import React, { useEffect, useState } from 'react'
import { View, ScrollView, RefreshControl, ToastAndroid, Text, TouchableOpacity } from 'react-native'
import { useNavigation, useRoute } from '@react-navigation/native'
import { connect } from 'react-redux'
import { actionType } from '../../../redux/actions/actionType'
import IconFontisto from 'react-native-vector-icons/Fontisto'
import IconAnt from 'react-native-vector-icons/AntDesign'
import IconMaterial from 'react-native-vector-icons/MaterialIcons'
import { AddressToName } from '../../../lib/Util'
import Clipboard from '@react-native-clipboard/clipboard'
import Avatar from '../../../component/Avatar'
import LinkBulletin from '../../../component/LinkBulletin'
import LinkName from '../../../component/LinkName'
import StrSequence from '../../../component/StrSequence'
import ViewEmpty from '../../../component/ViewEmpty'
import TextTimestamp from '../../../component/TextTimestamp'
import tw from '../../../lib/tailwind'
import BulletinContent from '../../../component/BulletinContent'

//公告：随便看看
const BulletinRandomScreen = (props) => {
  const random = props.avatar.get('RandomBulletin')
  const [refreshFlag, setRefreshFlag] = useState(false)

  const markBulletin = (hash) => {
    props.dispatch({
      type: actionType.avatar.MarkBulletin,
      hash: hash
    })
  }

  const unmarkBulletin = (hash) => {
    props.dispatch({
      type: actionType.avatar.UnmarkBulletin,
      hash: hash
    })
  }

  const quoteBulletin = (address, sequence, hash) => {
    props.dispatch({
      type: actionType.avatar.addQuoteList,
      address: address,
      sequence: sequence,
      hash: hash
    })
  }

  const copyToClipboard = () => {
    Clipboard.setString(random.Content)
    ToastAndroid.show('拷贝成功！',
      ToastAndroid.SHORT,
      ToastAndroid.CENTER)
  }

  const quote = () => {
    ToastAndroid.show('引用成功！',
      ToastAndroid.SHORT,
      ToastAndroid.CENTER)
  }

  const loadRandomBulletin = () => {
    props.dispatch({
      type: actionType.avatar.setRandomBulletinFlag,
      flag: true
    })
    props.dispatch({
      type: actionType.avatar.FetchRandomBulletin
    })
  }

  useEffect(() => {
    return props.navigation.addListener('focus', () => {
      loadRandomBulletin()
    })
  })

  useEffect(() => {
    return props.navigation.addListener('blur', () => {
      props.dispatch({
        type: actionType.avatar.setRandomBulletinFlag,
        flag: false
      })
    })
  })

  //向下拉，从服务器请求更多公告
  const refreshing = () => {
    if (refreshFlag) {
      console.log("现在正在刷新")
    } else {
      console.log("下拉刷新")
      setRefreshFlag(true)
      loadRandomBulletin()
      setRefreshFlag(false)
    }
  }

  const handleCollection = () => {
    markBulletin(random.Hash)
    ToastAndroid.show('收藏成功！',
      ToastAndroid.SHORT,
      ToastAndroid.CENTER)
  }

  const cancelCollection = () => {
    unmarkBulletin(random.Hash)
    ToastAndroid.show('取消收藏！',
      ToastAndroid.SHORT,
      ToastAndroid.CENTER)
  }

  return (
    <View style={tw`h-full bg-neutral-200 dark:bg-neutral-800 pt-5px px-5px`}>
      {
        random == null ?
          <ViewEmpty msg={'获取中...'} />
          :
          <ScrollView
            refreshControl={
              <RefreshControl
                refreshing={refreshFlag}
                onRefresh={() => refreshing()}
                colors={['red', 'green', 'blue']}
                title="正在加载中..."
              />
            }
          >
            {/* main bulletin */}
            <View style={tw`flex flex-col bg-stone-100 dark:bg-stone-500 p-5px`}>

              <View style={tw`flex flex-row mx-5px mt-5px`}>
                <Avatar address={random.Address} />
                <View>
                  <Text>
                    <LinkName onPress={() => props.navigation.push('AddressMark', { address: random.Address })} name={AddressToName(props.avatar.get('AddressMap'), random.Address)} />
                    <StrSequence sequence={random.Sequence} />
                  </Text>

                  {/* 发帖时间 */}
                  <View style={tw`flex flex-row`}>
                    <TextTimestamp timestamp={random.Timestamp} textSize={'text-xs'} />
                  </View>
                </View>
              </View>


              {/* 帖子引用 */}
              {
                random.QuoteList != undefined &&
                <View style={tw`flex flex-row mx-5px flex-wrap rounded-t-lg bg-yellow-100 dark:bg-yellow-200`}>
                  {
                    random.QuoteList.length > 0 &&
                    <Text style={tw`flex flex-row flex-nowrap`}>
                      {
                        random.QuoteList.map((item, index) => (
                          <LinkBulletin key={index} address={item.Address} sequence={item.Sequence} hash={item.Hash} to={random.Address} />
                        ))
                      }
                    </Text>
                  }
                </View>
              }

              {/* 快捷操作 */}
              <View style={tw`flex flex-row mx-5px rounded-b-lg bg-yellow-100 dark:bg-yellow-200`}>
                {/* 取消收藏按键 */}
                {
                  random.IsMark == "TRUE" &&
                  <TouchableOpacity onPress={cancelCollection}>
                    <IconEntypo
                      name={"star"}
                      size={32}
                      color={tw.color('red-500')}
                    />
                  </TouchableOpacity>
                }
                {/* 收藏按键 */}
                {
                  (current.IsMark == 0 || current.IsMark == "FALSE") &&
                  <TouchableOpacity onPress={handleCollection}>
                    <IconEntypo
                      name={"star-outlined"}
                      size={32}
                      color={tw.color('blue-500')}
                    />
                  </TouchableOpacity>
                }

                {/* 评论按键 */}
                <TouchableOpacity onPress={() => {
                  quoteBulletin(random.Address,
                    random.Sequence,
                    random.Hash)
                  props.navigation.push('BulletinPublish')
                }
                }>
                  <IconAnt
                    name={'addfile'}
                    size={32}
                    color={tw.color('blue-500')}
                  />
                </TouchableOpacity>

                {/* 引用按键 */}
                <TouchableOpacity onPress={() => {
                  quoteBulletin(random.Address,
                    random.Sequence,
                    random.Hash)
                  quote()
                }
                }
                >
                  <IconFontisto
                    name='link'
                    size={32}
                    color={tw.color('blue-500')}
                  />
                </TouchableOpacity>

                {/* 分享按键 */}
                <TouchableOpacity onPress={() => {
                  props.navigation.push('AddressSelect', {
                    content: {
                      ObjectType: "Bulletin",
                      Address: random.Address,
                      Sequence: random.Sequence,
                      Hash: random.Hash
                    }
                  })
                }
                }>
                  <IconFontisto
                    name='share-a'
                    size={32}
                    color={tw.color('blue-500')}
                  />
                </TouchableOpacity>

                {/* 拷贝按键 */}
                <TouchableOpacity onPress={() => {
                  copyToClipboard()
                }}>
                  <IconFontisto
                    name='copy'
                    size={32}
                    color={tw.color('blue-500')}
                  />
                </TouchableOpacity>

                {/* 原始信息 */}
                <TouchableOpacity onPress={() => {
                  props.navigation.push('BulletinInfo', { hash: random.Hash })
                }}>
                  <IconMaterial
                    name='info-outline'
                    size={32}
                    color={tw.color('blue-500')}
                  />
                </TouchableOpacity>
              </View>

              <BulletinContent content={random.Content} />
            </View>
          </ScrollView>
      }
    </View >
  )
}


const ReduxBulletinRandomScreen = connect((state) => {
  return {
    avatar: state.avatar
  }
})(BulletinRandomScreen)

export default function (props) {
  const navigation = useNavigation()
  const route = useRoute()
  return <ReduxBulletinRandomScreen{...props} navigation={navigation} route={route} />
}