import React, { useContext, useEffect } from 'react'
import { View, Text, ScrollView } from 'react-native'
import { useNavigation, useRoute } from '@react-navigation/native'
import { connect } from 'react-redux'
import { actionType } from '../../../redux/actions/actionType'
import { BulletinAddressSession, BulletinHistorySession, BulletinMarkSession, BulletinPreviewSize } from '../../../lib/Const'
import { timestamp_format, AddressToName } from '../../../lib/Util'
import { Flex, WhiteSpace } from '@ant-design/react-native'
import { styles } from '../../../theme/style'
import { ThemeContext } from '../../../theme/theme-context'
import EmptyView from '../../FunctionBase/EmptyView'
import Avatar from '../../../component/Avatar'
import LinkBulletin from '../../../component/LinkBulletin'
import tw from 'twrnc'


//公告列表
const BulletinListScreen = (props) => {
  const { theme } = useContext(ThemeContext)

  const loadBulletinList = (flag) => {
    if (props.route.params.session == BulletinMarkSession) {
      props.navigation.setOptions({ title: '收藏公告' })
    } else if (props.route.params.session == BulletinHistorySession) {
      props.navigation.setOptions({ title: '公告浏览历史' })
    } else if (props.route.params.session == BulletinAddressSession) {
      if (props.route.params.address == props.avatar.get('Address')) {
        props.navigation.setOptions({ title: '我的公告' })
      } else {
        props.navigation.setOptions({ title: `公告：${AddressToName(props.avatar.get('AddressMap'), props.route.params.address)}` })
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
    <ScrollView
      style={{
        backgroundColor: theme.base_body
      }}
      automaticallyAdjustContentInsets={false}
      showsHorizontalScrollIndicator={false}
      showsVerticalScrollIndicator={false}>
      {
        props.avatar.get('BulletinList').length > 0 ?
          props.avatar.get('BulletinList').map((item, index) => (
            <Flex key={index} justify="start" align="start" style={tw`mt-5px border-b border-stone-500`}>
              <Avatar address={item.Address} onPress={() => props.navigation.push('AddressMark', { address: item.Address })} />
              <View style={tw`ml-2px`}>
                <Text>
                  <LinkBulletin address={item.Address} sequence={item.Sequence} hash={item.Hash} to={item.Address} />

                </Text>

                <View style={tw`flex flex-row w-100`}>
                  <Text style={tw`basis-1/2 flex-auto text-stone-500`}>
                    {timestamp_format(item.Timestamp)}
                  </Text>
                  {
                    item.QuoteSize != 0 &&
                    <Text style={tw`basis-1/2 text-stone-500`}>
                      引用：◀{item.QuoteSize}
                    </Text>
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
                  : <View style={styles.content_view}>
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
          ))
          :
          <EmptyView />
      }
    </ScrollView >
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