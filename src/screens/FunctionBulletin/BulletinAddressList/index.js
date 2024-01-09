import React, { useEffect, useContext, useRef } from 'react'
import { View, Text, ScrollView, TouchableOpacity } from 'react-native'
import { actionType } from '../../../redux/actions/actionType'
import { connect } from 'react-redux'
import { WhiteSpace, Flex } from '@ant-design/react-native'
import EmptyView from '../../FunctionBase/EmptyView'
import { ThemeContext } from '../../../theme/theme-context'
import Avatar from '../../../component/Avatar'
import { BulletinAddressSession } from '../../../lib/Const'
import StrSequence from '../../../component/StrSequence'
import tw from 'twrnc'


//活跃用户
const BulletinAddressListScreen = (props) => {
  const { theme } = useContext(ThemeContext)
  const refPage = useRef(1)

  const loadBulletinAddressList = () => {
    props.dispatch({
      type: actionType.avatar.FetchBulletinAddressList,
      page: refPage.current
    })
  }

  useEffect(() => {
    return props.navigation.addListener('focus', () => {
      if (props.route.params && props.route.params.page > 1) {
        refPage.current = props.route.params.page
      }
      props.navigation.setOptions({
        title: `活跃用户#${refPage.current}`,
      })

      loadBulletinAddressList()
    })
  })

  return (
    <View>
      {
        props.avatar.get('BulletinAddressList').length > 0 ?
          <View style={tw`h-full bg-stone-200 p-5px`}>
            <ScrollView
              style={tw``}
              automaticallyAdjustContentInsets={false}
              showsHorizontalScrollIndicator={false}
              showsVerticalScrollIndicator={false}>
              {
                props.avatar.get('BulletinAddressList').length > 0 ?
                  props.avatar.get('BulletinAddressList').map((item, index) => (
                    <View key={index} style={tw`bg-stone-100`}>
                      <Flex>
                        <Flex.Item style={{ flex: 0.15 }}>
                          <Avatar address={item.Address} />
                        </Flex.Item>
                        <Flex.Item >
                          <View style={tw`flex flex-row`}>
                            <StrSequence sequence={item.Count} />
                            {
                              props.avatar.get('Follows').includes(item.Address) &&
                              <TouchableOpacity onPress={() => props.navigation.push('BulletinList', { session: BulletinAddressSession, address: item.Address })}>
                                <View style={tw`bg-yellow-500 rounded-full`}>
                                  <Text style={tw`text-base text-slate-800 text-center`}>
                                    公告
                                  </Text>
                                </View>
                              </TouchableOpacity>
                            }
                            {
                              props.avatar.get('Friends').includes(item.Address) &&
                              <TouchableOpacity onPress={() => props.navigation.push('Session', { address: item.Address })}>
                                <View style={tw`bg-green-500 rounded-full px-2 border-2 border-gray-300`}>
                                  <Text style={tw`text-base text-slate-800 text-center`}>
                                    聊天
                                  </Text>
                                </View>
                              </TouchableOpacity>
                            }
                          </View>
                          <TouchableOpacity onPress={() => props.navigation.push('AddressMark', { address: item.Address })}>
                            <View style={tw`bg-indigo-500 rounded-full px-2 border-2 border-gray-300`}>
                              <Text style={tw`text-sm text-slate-400`}>{item.Address}</Text>
                            </View>
                          </TouchableOpacity>
                        </Flex.Item>
                      </Flex>
                    </View>
                  ))
                  :
                  <EmptyView />
              }
              <WhiteSpace size='lg' />
            </ScrollView>
          </View>
          :
          <EmptyView />
      }
    </View>
  )
}

const ReduxBulletinAddressListScreen = connect((state) => {
  return {
    avatar: state.avatar
  }
})(BulletinAddressListScreen)

export default ReduxBulletinAddressListScreen