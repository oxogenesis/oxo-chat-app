import React, { useContext, useEffect, useState } from 'react'
import { View, ScrollView, RefreshControl, Text, Image, TouchableOpacity } from 'react-native'
import { useNavigation, useRoute } from '@react-navigation/native'
import { connect } from 'react-redux'
import { actionType } from '../../../redux/actions/actionType'
import { Icon, Toast } from '@ant-design/react-native'
import { timestamp_format, AddressToName } from '../../../lib/Util'
import Clipboard from '@react-native-clipboard/clipboard'
import { Flex } from '@ant-design/react-native'
import { styles } from '../../../theme/style'
import { ThemeContext } from '../../../theme/theme-context'
import Avatar from '../../../component/Avatar'
import LinkBulletin from '../../../component/LinkBulletin'
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
    <View style={{
      ...styles.base_body,
      backgroundColor: theme.base_body
    }}>
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
            <View style={{
              backgroundColor: theme.base_body
            }}>
              <Flex justify="start" align="start">
                <View>
                  <View style={tw`mx-auto mt-2`}>
                    <Avatar address={random.Address} />
                  </View>
                  {/* 取消收藏按键 */}
                  {
                    random.IsMark == "TRUE" &&
                    <View style={tw`mx-auto mt-2`}>
                      <TouchableOpacity onPress={cancelCollection}>
                        <Icon
                          name="star"
                          size="md"
                          color={tw.color('red-500')}
                        />
                        <Text style={tw.style(`text-sm text-slate-500`)}>{`取消\n收藏`}</Text>
                      </TouchableOpacity>
                    </View>
                  }
                  {/* 收藏按键 */}
                  {
                    random.IsMark == "FALSE" &&
                    <View style={tw`mx-auto mt-2`}>
                      <TouchableOpacity onPress={handleCollection}>
                        <Icon
                          name='star'
                          size="md"
                          color={tw.color('slate-500')}
                        />
                        <Text style={tw.style(`text-sm text-slate-500`)}>收藏</Text>
                      </TouchableOpacity>
                    </View>
                  }

                  {/* 评论按键 */}
                  <View style={tw`mx-auto mt-2`}>
                    <TouchableOpacity onPress={() => {
                      quoteBulletin(random.Address,
                        random.Sequence,
                        random.Hash)
                      props.navigation.push('BulletinPublish')
                      setShow(Math.random())
                    }
                    }>
                      <Icon
                        name='comment'
                        size="md"
                        color={tw.color('slate-500')}
                      />
                      <Text style={tw.style(`text-sm text-slate-500`)}>评论</Text>
                    </TouchableOpacity>
                  </View>

                  {/* 引用按键 */}
                  <View style={tw`mx-auto mt-2`}>
                    <TouchableOpacity onPress={() => {
                      quoteBulletin(random.Address,
                        random.Sequence,
                        random.Hash)
                      quote()
                    }
                    }
                    >
                      <View style={styles.icon_view}>
                        <Icon
                          name='link'
                          size="md"
                          color={tw.color('slate-500')}
                        />
                        <Text style={tw.style(`text-sm text-slate-500`)}>引用</Text>
                      </View>
                    </TouchableOpacity>
                  </View>

                  {/* 分享按键 */}
                  <View style={tw`mx-auto mt-2`}>
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
                      <View style={styles.icon_view}>
                        <Icon
                          name='branches'
                          size="md"
                          color={tw.color('slate-500')}
                        />
                        <Text style={tw.style(`text-sm text-slate-500`)}>分享</Text>
                      </View>
                    </TouchableOpacity>
                  </View>

                  {/* 拷贝按键 */}
                  <View style={tw`mx-auto mt-2`}>
                    <TouchableOpacity onPress={() => {
                      copyToClipboard()
                    }}>
                      <View style={styles.icon_view}>
                        <Icon
                          name='block'
                          size="md"
                          color={tw.color('slate-500')}
                        />
                        <Text style={tw.style(`text-sm text-slate-500`)}>拷贝</Text>
                      </View>
                    </TouchableOpacity>
                  </View>
                </View>

                <View >
                  <View>
                    <Text>
                      <View>
                        <Text style={tw.style(`text-base text-slate-800 bg-indigo-500 rounded-full`)}
                          onPress={() => props.navigation.push('AddressMark',
                            { address: random.Address })}
                        >{AddressToName(props.avatar.get('AddressMap'), random.Address)}</Text>
                      </View>
                      <View>
                        <Text style={tw.style(`text-base text-slate-800 bg-yellow-500 rounded-full`)}>
                          {`#${random.Sequence}`}
                        </Text>
                      </View>
                    </Text>

                    <Text style={styles.desc_view}>
                      {timestamp_format(random.Timestamp)}
                    </Text>

                    {
                      random.QuoteList != undefined &&
                      <>
                        {
                          random.QuoteList.length > 0 &&
                          <View style={tw.style(`flex flex-row flex-nowrap`)}>
                            {
                              random.QuoteList.map((item, index) => (
                                <LinkBulletin
                                  key={index}
                                  onPress={() => props.navigation.push('Bulletin', {
                                    address: item.Address,
                                    sequence: item.Sequence,
                                    hash: item.Hash,
                                    to: random.Address
                                  })}
                                  name={AddressToName(props.avatar.get('AddressMap'), item.Address)}
                                  sequence={item.Sequence} />
                              ))
                            }
                          </View>
                        }
                      </>
                    }
                  </View>

                  <View style={styles.content_view}>
                    <Text style={{
                      ...styles.content_text,
                      color: theme.text1
                    }}>
                      {random.Content}
                    </Text>
                  </View>
                </View>
              </Flex>
            </View>
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