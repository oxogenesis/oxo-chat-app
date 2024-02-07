import React, { useContext, useState, useEffect } from 'react'
import { View, Text, FlatList } from 'react-native'
import { useNavigation, useRoute } from '@react-navigation/native'
import { connect } from 'react-redux'
import { actionType } from '../../../redux/actions/actionType'
import { timestamp_format } from '../../../lib/Util'
import { Flex } from '@ant-design/react-native'
import EmptyView from '../../FunctionBase/EmptyView'
import { ThemeContext } from '../../../theme/theme-context'
import { styles } from '../../../theme/style'
import { BulletinPreviewSize } from '../../../lib/Const'
import Avatar from '../../../component/Avatar'
import LinkBulletin from '../../../component/LinkBulletin'
import tw from 'twrnc'

//公告Tab
const TabBulletinScreen = (props) => {
  const { theme } = useContext(ThemeContext)
  const [refreshFlag, setRefreshFlag] = useState(false)
  const [isLoadMore, setIsLoadMore] = useState(false)

  const loadTabBulletinList = (flag) => {
    props.dispatch({
      type: actionType.avatar.LoadTabBulletinList,
      bulletin_list_flag: flag
    })
  }

  useEffect(() => {
    return props.navigation.addListener('focus', () => {
      if (props.avatar.get('TabBulletinList').length == 0) {
        loadTabBulletinList(true)
      }
    })
  })

  //向上拉到底部，加载更到本地公告
  const loadMore = () => {
    console.log("上拉加载")
    setIsLoadMore(true)
    loadTabBulletinList(false)
    setTimeout(() => {
      setIsLoadMore(false)
    }, 500)
  }

  //向下拉，从服务器请求更多公告
  const refreshing = () => {
    if (refreshFlag) {
      console.log("现在正在刷新")
    } else {
      console.log("下拉刷新")
      setRefreshFlag(true)
      props.dispatch({ type: actionType.avatar.UpdateFollowBulletin })
      setRefreshFlag(false)
    }
  }

  useEffect(() => {
    // TODO
    // console.log(`TabBulletinScreen===========================${props.avatar.get('TabBulletinList').length}`)
    // if (props.avatar.get('Database') != null && props.avatar.get('Database') != null) {
    //   props.navigation.replace('TabHome')
    // }
  }, [props.avatar])

  const list = props.avatar.get('TabBulletinList')

  return (
    <View
      style={{
        ...styles.base_view_r,
        backgroundColor: theme.base_view
      }}
    >
      {
        !props.avatar.get('ConnStatus') &&
        <View style={tw`bg-red-200 p-4`}>
          <Text style={tw`text-base text-center`}>
            未连接服务器，请检查网络设置或连通性
          </Text>
        </View>
      }
      <FlatList
        style={{
          ...styles.base_color,
          backgroundColor: theme.base_body,
          marginBottom: 0
        }}
        data={props.avatar.get('TabBulletinList')}
        keyExtractor={item => item.Hash}
        onEndReached={loadMore}
        onEndReachedThreshold={0.05}
        refreshing={refreshFlag}
        onRefresh={refreshing}
        ListEmptyComponent={<EmptyView />}
        renderItem={({ item }) => (
          <View
            style={{
              ...styles.list_border,
              borderColor: theme.split_line
            }}>
            <Flex justify="start" align="start">
              <Avatar address={item.Address} onPress={() => props.navigation.push('AddressMark', { address: item.Address })} />
              <View style={tw`ml-2px`}>
                <Text style={{
                  marginBottom: 6
                }}>
                  <LinkBulletin address={item.Address} sequence={item.Sequence} hash={item.Hash} to={item.Address} />
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
                      引用：◀{item.QuoteSize}</Text>
                  }
                </View>
                {item.Content.length <= BulletinPreviewSize ?
                  <View style={styles.content_view}>
                    <Text style={{
                      ...styles.content_text,
                      color: theme.text1
                    }}
                      onPress={() => props.navigation.push('Bulletin', { hash: item.Hash })}
                    >{item.Content}</Text>
                  </View>
                  :
                  <View style={styles.content_view}>
                    <Text style={{
                      ...styles.content_text,
                      color: theme.text1
                    }}
                      onPress={() => props.navigation.push('Bulletin', { hash: item.Hash })}
                    >{item.Content.slice(0, BulletinPreviewSize)}</Text>
                  </View>
                }
              </View>
            </Flex>
          </View>
        )}
      />

      {/* <View style={tw`absolute inset-x-0 bottom-0 bg-stone-200 z-50`}>
        <Button style={tw`rounded-full bg-green-500`} onPress={() => props.navigation.navigate('BulletinPublish')}>
          <Text style={tw`text-xl text-slate-100`}>发布公告</Text>
        </Button>
      </View> */}
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