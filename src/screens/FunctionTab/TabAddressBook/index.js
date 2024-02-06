import React, { useContext } from 'react'
import { View, Text, ScrollView, TouchableOpacity } from 'react-native'
import { connect } from 'react-redux'
import { WhiteSpace, Flex } from '@ant-design/react-native'
import EmptyView from '../../FunctionBase/EmptyView'
import { ThemeContext } from '../../../theme/theme-context'
import Avatar from '../../../component/Avatar'
import { BulletinAddressSession } from '../../../lib/Const'
import tw from 'twrnc'

//联系人Tab
const TabAddressBookScreen = props => {
  const { theme } = useContext(ThemeContext)

  return (
    <View>
      {
        props.avatar.get('AddressArray').length > 0 ?
          <View style={tw`h-full bg-stone-200 p-5px`}>
            <ScrollView
              style={tw`mb-60px`}
              // style={styles.scroll_view}
              automaticallyAdjustContentInsets={false}
              showsHorizontalScrollIndicator={false}
              showsVerticalScrollIndicator={false}>
              {
                props.avatar.get('AddressArray').length > 0 ?
                  props.avatar.get('AddressArray').map((item, index) => (
                    <View key={index} style={tw`bg-stone-100`}>
                      <TouchableOpacity onPress={() => props.navigation.push('AddressMark', { address: item.Address })}>
                        <Flex>
                          <Flex.Item style={{ flex: 0.15 }}>
                            <Avatar address={item.Address} />
                          </Flex.Item>
                          <Flex.Item >
                            <View style={tw`flex flex-row`}>
                              <View style={tw`rounded-full px-1 border-2 border-gray-300`}>
                                <Text style={tw`text-base text-slate-800 text-center`}>
                                  {`${item.Name}`}
                                </Text>
                              </View>
                              {
                                props.avatar.get('Follows').includes(item.Address) &&
                                <TouchableOpacity onPress={() => props.navigation.push('BulletinList', { session: BulletinAddressSession, address: item.Address })}>
                                  <View style={tw`bg-yellow-500 rounded-full px-2 border-2 border-gray-300`}>
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
                            <Text style={tw`text-sm text-slate-400`}>{item.Address}</Text>
                          </Flex.Item>
                        </Flex>
                      </TouchableOpacity>
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

const ReduxTabAddressBookScreen = connect((state) => {
  return {
    avatar: state.avatar
  }
})(TabAddressBookScreen)

export default ReduxTabAddressBookScreen