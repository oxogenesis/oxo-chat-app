import React, { useContext, useEffect, useState } from 'react'
import { View, ScrollView, Text, Image, TouchableOpacity } from 'react-native'
import { useNavigation, useRoute } from '@react-navigation/native'
import { connect } from 'react-redux'
import { actionType } from '../../../redux/actions/actionType'
import { Icon, Toast } from '@ant-design/react-native'
import { GenesisHash } from '../../../lib/Const'
import { timestamp_format, AddressToName } from '../../../lib/Util'
import Clipboard from '@react-native-clipboard/clipboard'
import { Flex } from '@ant-design/react-native'
import { styles } from '../../../theme/style'
import { ThemeContext } from '../../../theme/theme-context'
import Avatar from '../../../component/Avatar'
import LinkBulletin from '../../../component/LinkBulletin'
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
            <Flex justify="start" align="start">
              <View>
                <View style={tw`mx-auto mt-2`}>
                  <Avatar address={current.Address} />
                </View>
                {/* 取消收藏按键 */}
                {
                  current.IsMark == "TRUE" &&
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
                  current.IsMark == "FALSE" &&
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
                    quoteBulletin(current.Address,
                      current.Sequence,
                      current.Hash)
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
                    quoteBulletin(current.Address,
                      current.Sequence,
                      current.Hash)
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
                        Address: current.Address,
                        Sequence: current.Sequence,
                        Hash: current.Hash
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
                      <Text style={{
                        ...styles.name2,
                        color: theme.link_color,
                      }}
                        onPress={() => props.navigation.push('AddressMark',
                          { address: current.Address })}
                      >{AddressToName(props.avatar.get('AddressMap'), current.Address)}&nbsp;&nbsp;</Text>
                    </View>
                    <View style={{
                      borderWidth: 1,
                      borderColor: theme.split_line,
                      borderRadius: 6,
                      paddingLeft: 6,
                      paddingRight: 6,
                    }}>
                      <Text style={{
                        color: theme.text1,
                        fontSize: 18
                      }}>
                        {`#${current.Sequence}`}
                      </Text>
                    </View>
                    {
                      current.PreHash != GenesisHash &&
                      <TouchableOpacity onPress={() => {
                        props.navigation.push('Bulletin', {
                          address: current.Address,
                          sequence: current.Sequence - 1,
                          hash: current.PreHash,
                          to: current.Address
                        })
                      }
                      }>
                        <View style={{
                          borderWidth: 1,
                          borderColor: theme.split_line,
                          borderRadius: 6,
                          paddingLeft: 6,
                          paddingRight: 6,
                        }}>
                          <Text style={{
                            color: theme.text1,
                            fontSize: 18
                          }}>
                            上一条
                          </Text>
                        </View>
                      </TouchableOpacity>
                    }
                  </Text>

                  <Text style={styles.desc_view}>
                    {timestamp_format(current.Timestamp)}
                  </Text>

                  {
                    current.QuoteList != undefined &&
                    <>
                      {
                        current.QuoteList.length > 0 &&
                        <View style={tw.style(`flex flex-row flex-nowrap`)}>
                          {
                            current.QuoteList.map((item, index) => (
                              <LinkBulletin
                                key={index}
                                onPress={() => props.navigation.push('Bulletin', {
                                  address: item.Address,
                                  sequence: item.Sequence,
                                  hash: item.Hash,
                                  to: current.Address
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
                    {current.Content}
                  </Text>
                </View>
              </View>
            </Flex>
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