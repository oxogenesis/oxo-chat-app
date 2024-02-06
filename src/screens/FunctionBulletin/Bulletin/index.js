import React, { useContext, useEffect, useState } from 'react'
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
import { timestamp_format, AddressToName } from '../../../lib/Util'
import Clipboard from '@react-native-clipboard/clipboard'
import { Flex } from '@ant-design/react-native'
import { ThemeContext } from '../../../theme/theme-context'
import Avatar from '../../../component/Avatar'
import LinkBulletin from '../../../component/LinkBulletin'
import LinkName from '../../../component/LinkName'
import StrSequence from '../../../component/StrSequence'
import Reply from '../../../component/Reply'
import tw from 'twrnc'

//公告详情
const BulletinScreen = (props) => {
  const { theme } = useContext(ThemeContext)
  const current = props.avatar.get('CurrentBulletin')
  const [show, setShow] = useState('0')

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
    setShow(Math.random())
  }

  const quote = () => {
    Toast.success('引用成功，请去发布公告！', 1)
    setShow(Math.random())
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
    setShow(Math.random())
  }

  const cancelCollection = () => {
    unmarkBulletin(current.Hash)
    Toast.success('取消收藏！', 1)
    setShow(Math.random())
  }

  return (
    <View style={tw`h-full bg-stone-200`}>
      {
        current == null ?
          <Text style={{ color: theme.text2 }}>公告不存在，正在获取中，请稍后查看...</Text>
          :
          <ScrollView>
            <Flex justify="start" align="start" style={tw`mt-5px border-b-4 border-stone-500`}>
              <View style={tw`ml-5px`}>
                <Avatar address={current.Address} />
              </View>

              <View>
                <View>
                  <View style={tw`flex flex-row`}>
                    <LinkName onPress={() => props.navigation.push('AddressMark', { address: current.Address })} name={AddressToName(props.avatar.get('AddressMap'), current.Address)} />
                    <StrSequence sequence={current.Sequence} />
                    {
                      current.PreHash != GenesisHash && (props.avatar.get('Follows').includes(current.Address) || props.avatar.get('Address') == current.Address) &&
                      <LinkBulletin address={current.Address} sequence={current.Sequence - 1} hash={current.PreHash} to={current.Address} display={`上一篇`} />
                    }
                  </View>

                  {/* 发帖时间 */}
                  <Text style={tw`text-stone-500`}>
                    {timestamp_format(current.Timestamp)}
                  </Text>

                  {/* 帖子引用 */}
                  {
                    current.QuoteList != undefined &&
                    <View style={tw`flex flex-row flex-wrap bg-yellow-100 w-100`}>
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
                  <View style={tw`flex flex-row border-b border-stone-500 bg-yellow-100 w-100`}>
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
                      setShow(Math.random())
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
                      setShow(Math.random())
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
                </View>

                <View style={tw`pr-50px`}>
                  <Text style={tw`text-base`}>
                    {current.Content}
                  </Text>
                </View>
              </View>
            </Flex>

            {/* reply */}
            {
              props.avatar.get('ReplyList').length > 0 &&
              <View style={tw`flex flex-row flex-nowrap`}>
                {
                  props.avatar.get('ReplyList').map((reply, index) => (
                    <Reply key={index} address={reply.address} sequence={reply.sequence} hash={reply.quote_hash} content={reply.content} timestamp={reply.signed_at} />
                  ))
                }
              </View>
            }
          </ScrollView>
      }
    </View>
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