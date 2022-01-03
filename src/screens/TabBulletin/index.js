import React, { useContext, useState, useEffect } from 'react'
import { View, Text, ScrollView, Image, TouchableOpacity } from 'react-native'
import { useNavigation, useRoute } from '@react-navigation/native'
import { connect } from 'react-redux'
import { actionType } from '../../redux/actions/actionType'
import { timestamp_format, AddressToName } from '../../lib/Util'
import { Button, Flex, WhiteSpace } from '@ant-design/react-native'
import EmptyView from '../EmptyView'
import { ThemeContext } from '../../theme/theme-context'
import { styles } from '../../theme/style'

//公告列表
const TabBulletinScreen = (props) => {
  const { theme } = useContext(ThemeContext)

  const loadTabBulletinList = (flag) => {
    props.dispatch({
      type: actionType.avatar.LoadTabBulletinList,
      bulletin_list_flag: flag
    })
  }

  // @网友 向上拉到底部，加载更到本地公告
  // loadTabBulletinList(false)

  // @网友 向下拉，从服务器请求更多公告
  // props.dispatch({ type: actionType.avatar.UpdateFollowBulletin })

  // @网友
  // https://reactnative.dev/docs/scrollview
  //   <ScrollView> vs <FlatList> - which one to use?
  // ScrollView renders all its react child components at once, but this has a performance downside.
  // Imagine you have a very long list of items you want to display, maybe several screens worth of content. Creating JS components and native views for everything all at once, much of which may not even be shown, will contribute to slow rendering and increased memory usage.
  // This is where FlatList comes into play. FlatList renders items lazily, when they are about to appear, and removes items that scroll way off screen to save memory and processing time.
  // FlatList is also handy if you want to render separators between your items, multiple columns, infinite scroll loading, or any number of other features it supports out of the box.
  // 这个页面是不是用FlatList更好？

  useEffect(() => {
    return props.navigation.addListener('focus', () => {
      console.log(`<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<TabBulletin focus`)
      if (props.avatar.get('TabBulletinList').length == 0) {
        loadTabBulletinList(true)
      }
    })
  })

  const list = props.avatar.get('TabBulletinList')

  return (
    <View
      style={{
        ...styles.base_view_r,
        backgroundColor: theme.base_view
      }}
    >
      <ScrollView
        style={{
          ...styles.base_color,
          backgroundColor: theme.base_body,
          marginBottom: 60
        }}
        automaticallyAdjustContentInsets={false}
        showsHorizontalScrollIndicator={false}
        showsVerticalScrollIndicator={true}>
        {
          !props.avatar.get('ConnStatus') && <View style={{
            alignItems: 'center',
            backgroundColor: theme.off_line_view,
            height: 55,
            lineHeight: 55,
          }} >
            <Text style={{
              lineHeight: 55,
              fontSize: 16,
              color: theme.off_line_text
            }}>
              当前网络不可用，请检查你的网络设置
            </Text>
          </View>
        }
        {
          list.length > 0 ? list.map((item, index) => (
            <View
              key={index}
              style={{
                ...styles.list_border,
                borderColor: theme.split_line
              }}>
              <Flex justify="start" align="start">
                <TouchableOpacity
                  onPress={() => props.navigation.push('AddressMark', { address: item.Address })}
                >
                  <Image style={styles.img_md} source={require('../../assets/app.png')}></Image>
                </TouchableOpacity>
                <View style={{
                  marginLeft: 8,
                }}>
                  <Text style={{
                    marginBottom: 6
                  }}>
                    {
                      props.avatar.get('Address') == item.Address ? <View>
                        <Text style={{
                          ...styles.name2,
                          color: theme.link_color,
                        }}
                        >{AddressToName(props.avatar.get('AddressMap'), item.Address)}&nbsp;&nbsp;</Text>
                      </View> : <View>
                        <Text style={{
                          ...styles.name2,
                          color: theme.link_color,
                        }}
                          onPress={() => props.navigation.push('AddressMark', { address: item.Address })}
                        >{AddressToName(props.avatar.get('AddressMap'), item.Address)}&nbsp;</Text>
                      </View>
                    }
                    <Text onPress={() => props.navigation.push('Bulletin', { hash: item.Hash })}>
                      <View style={{
                        borderWidth: 1,
                        borderColor: theme.split_line,
                        borderRadius: 6,
                        paddingLeft: 6,
                        paddingRight: 6,

                      }}>
                        <Text style={{
                          color: theme.text1,
                          fontSize: 16
                        }}>{`#${item.Sequence}`}</Text>
                      </View>
                    </Text>
                  </Text>

                  <View style={{
                    flex: 1,
                    flexDirection: "row",
                    paddingRight: 50,
                  }}>
                    <Text style={{
                      ...styles.content_view,
                      color: theme.text2
                    }}>{timestamp_format(item.Timestamp)}</Text>
                    {
                      item.QuoteSize != 0 && <Text style={{
                        ...styles.form_view,
                        color: theme.text2
                      }}>
                        来自：◀{item.QuoteSize}</Text>
                    }
                  </View>
                  <View style={styles.content_view}>
                    <Text style={{
                      fontSize: 16,
                      width: '100%',
                      color: theme.text1
                    }}
                      onPress={() => props.navigation.push('Bulletin', { hash: item.Hash })}
                    >{item.Content}</Text>
                  </View>
                </View>
              </Flex>
            </View>
          )) : <EmptyView />
        }
      </ScrollView >

      <View style={styles.base_view_a}>
        <Button
          style={styles.btn_high}
          type='primary'
          onPress={() => props.navigation.navigate('BulletinPublish')}>发布公告</Button>
      </View>
    </View>
  )
}


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