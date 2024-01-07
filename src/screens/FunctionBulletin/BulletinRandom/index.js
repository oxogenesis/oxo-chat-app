import React, { useContext, useEffect, useState } from 'react'
import { View, ScrollView, RefreshControl, Text, Image, TouchableOpacity } from 'react-native'
import { useNavigation, useRoute } from '@react-navigation/native'
import { connect } from 'react-redux'
import { actionType } from '../../../redux/actions/actionType'
import { Toast } from '@ant-design/react-native'
import IconFontisto from 'react-native-vector-icons/Fontisto'
import IconAnt from 'react-native-vector-icons/AntDesign'
import IconMaterial from 'react-native-vector-icons/MaterialIcons'
import { timestamp_format, AddressToName } from '../../../lib/Util'
import Clipboard from '@react-native-clipboard/clipboard'
import { Flex } from '@ant-design/react-native'
import { ThemeContext } from '../../../theme/theme-context'
import Avatar from '../../../component/Avatar'
import LinkBulletin from '../../../component/LinkBulletin'
import LinkName from '../../../component/LinkName'
import StrSequence from '../../../component/StrSequence'
import tw from 'twrnc'

//公告：随便看看
const BulletinRandomScreen = (props) => {
  const { theme } = useContext(ThemeContext)
  const random = props.avatar.get('RandomBulletin')
  const [refreshFlag, setRefreshFlag] = useState(false)
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
    Clipboard.setString(random.Content)
    Toast.success('拷贝成功！', 1)
    setShow(Math.random())
  }

  const quote = () => {
    Toast.success('引用成功！', 1)
    setShow(Math.random())
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
    Toast.success('收藏成功！', 1)
    setShow(Math.random())
  }

  const cancelCollection = () => {
    unmarkBulletin(random.Hash)
    Toast.success('取消收藏！', 1)
    setShow(Math.random())
  }

  return (
    <View style={tw`h-full bg-stone-200`}>
      {
        random == null ?
          <Text style={{ color: theme.text2 }}>公告不存在，正在获取中，请稍后查看...</Text>
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
            <Flex justify="start" align="start" style={tw`mt-5px border-b-4 border-stone-500`}>
              <View style={tw`ml-5px`}>
                <Avatar address={random.Address} />
              </View>

              <View>
                <View>
                  <Text>
                    <LinkName onPress={() => props.navigation.push('AddressMark', { address: random.Address })} name={AddressToName(props.avatar.get('AddressMap'), random.Address)} />
                    <StrSequence sequence={random.Sequence} />
                  </Text>

                  {/* 发帖时间 */}
                  <Text style={tw`mt-5px text-stone-500`}>
                    {timestamp_format(random.Timestamp)}
                  </Text>

                  {/* 帖子引用 */}
                  {
                    random.QuoteList != undefined &&
                    <>
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
                    </>
                  }

                  {/* 快捷操作 */}
                  <View style={tw`flex flex-row border-b border-stone-500 bg-yellow-100 w-100`}>
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
                      random.IsMark == "FALSE" &&
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
                      props.navigation.push('BulletinInfo', { hash: random.Hash })
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
                    {random.Content}
                  </Text>
                </View>
              </View>
            </Flex>
          </ScrollView>
      }
    </View>
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