import React, { useEffect } from 'react'
import { View, ScrollView, Text, TouchableOpacity } from 'react-native'
import { useNavigation, useRoute } from '@react-navigation/native'
import { connect } from 'react-redux'
import { actionType } from '../../../redux/actions/actionType'
import { Toast } from '@ant-design/react-native'
import IconFontisto from 'react-native-vector-icons/Fontisto'
import IconEntypo from 'react-native-vector-icons/Entypo'
import IconAnt from 'react-native-vector-icons/AntDesign'
import IconMaterial from 'react-native-vector-icons/MaterialIcons'
import { GenesisHash } from '../../../lib/Const'
import { AddressToName } from '../../../lib/Util'
import Clipboard from '@react-native-clipboard/clipboard'
import Avatar from '../../../component/Avatar'
import LinkBulletin from '../../../component/LinkBulletin'
import LinkName from '../../../component/LinkName'
import StrSequence from '../../../component/StrSequence'
import ViewEmpty from '../../../component/ViewEmpty'
import ItemReply from '../../../component/ItemReply'
import TextTimestamp from '../../../component/TextTimestamp'
import tw from '../../../lib/tailwind'
import BulletinContent from '../../../component/BulletinContent'

//公告详情
const BulletinScreen = (props) => {
  const current = props.avatar.get('CurrentBulletin')

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
      type: actionType.avatar.addQuote,
      address: address,
      sequence: sequence,
      hash: hash
    })
  }

  const copyToClipboard = () => {
    Clipboard.setString(current.Content)
    Toast.success('拷贝成功！', 1)
  }

  const quote = () => {
    Toast.success('引用成功，请去发布公告！', 1)
  }

  useEffect(() => {
    return props.navigation.addListener('focus', () => {
      props.dispatch({
        type: actionType.avatar.LoadCurrentBulletin,
        address: props.route.params.address,
        sequence: props.route.params.sequence,
        hash: props.route.params.hash,
        to: props.route.params.to
      })
    })
  })

  const handleCollection = () => {
    markBulletin(current.Hash)
    Toast.success('收藏成功！', 1)
  }

  const cancelCollection = () => {
    unmarkBulletin(current.Hash)
    Toast.success('取消收藏！', 1)
  }

  return (
    <View style={tw`h-full bg-neutral-200 dark:bg-neutral-800 pt-5px px-5px`}>
      {
        current == null ?
          <ViewEmpty msg={'加载中...'} />
          :
          <ScrollView style={tw``}>
            {/* main bulletin */}
            <View style={tw`flex flex-col bg-neutral-100`}>
              <View style={tw`flex flex-row mx-5px mt-5px`}>
                <Avatar address={current.Address} />

                <View style={tw`flex flex-col`}>
                  <View style={tw`flex flex-row`}>
                    <LinkName onPress={() => props.navigation.push('AddressMark', { address: current.Address })} name={AddressToName(props.avatar.get('AddressMap'), current.Address)} />
                    <StrSequence sequence={current.Sequence} />
                    {
                      current.PreHash != GenesisHash && (props.avatar.get('Follows').includes(current.Address) || props.avatar.get('Address') == current.Address) &&
                      <LinkBulletin address={current.Address} sequence={current.Sequence - 1} hash={current.PreHash} to={current.Address} display={`上一篇`} />
                    }
                  </View>

                  {/* 发帖时间 */}
                  <View style={tw`flex flex-row`}>
                    <TextTimestamp timestamp={current.Timestamp} textSize={'text-xs'} />
                  </View>
                </View>
              </View>


              {/* 帖子引用 */}
              {
                current.QuoteList != undefined &&
                <View style={tw`flex flex-row mx-5px flex-wrap rounded-tl-lg bg-yellow-100`}>
                  {
                    current.QuoteList.length > 0 &&
                    <Text>
                      {
                        current.QuoteList.map((item, index) => (
                          <LinkBulletin key={index} address={item.Address} sequence={item.Sequence} hash={item.Hash} to={current.Address} />
                        ))
                      }
                    </Text>
                  }
                </View>
              }

              {/* 快捷操作 */}
              <View style={tw`flex flex-row mx-5px rounded-b-lg bg-yellow-100`}>
                {/* 取消收藏按键 */}
                {
                  current.IsMark == "TRUE" &&
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
                  current.IsMark == "FALSE" &&
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
                  quoteBulletin(current.Address,
                    current.Sequence,
                    current.Hash)
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
                  quoteBulletin(current.Address,
                    current.Sequence,
                    current.Hash)
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
                      Address: current.Address,
                      Sequence: current.Sequence,
                      Hash: current.Hash
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
                  props.navigation.push('BulletinInfo', { hash: current.Hash })
                }}>
                  <IconMaterial
                    name='info-outline'
                    size={32}
                    color={tw.color('blue-500')}
                  />
                </TouchableOpacity>
              </View>

              <BulletinContent content={current.Content} />
            </View>

            {/* reply */}
            {
              props.avatar.get('ReplyList').length > 0 &&
              <View style={tw`flex flex-col flex-nowrap`}>
                {
                  props.avatar.get('ReplyList').map((reply, index) => (
                    <ItemReply key={index} itemIndex={index} address={reply.address} sequence={reply.sequence} hash={reply.quote_hash} content={reply.content} timestamp={reply.signed_at} />
                  ))
                }
              </View>
            }
          </ScrollView>
      }
    </View >
  )
}


const ReduxBulletinScreen = connect((state) => {
  return {
    avatar: state.avatar
  }
})(BulletinScreen)

export default function (props) {
  const navigation = useNavigation()
  const route = useRoute()
  return <ReduxBulletinScreen{...props} navigation={navigation} route={route} />
}