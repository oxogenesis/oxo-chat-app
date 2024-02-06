import React, { useContext } from 'react'
import { ScrollView, View, Text, TouchableOpacity } from 'react-native'
import { connect } from 'react-redux'
import { Flex, WhiteSpace, Badge } from '@ant-design/react-native'
import { timestamp_format, AddressToName } from '../../../lib/Util'
import EmptyView from '../../FunctionBase/EmptyView'
import { ThemeContext } from '../../../theme/theme-context'
import AvatarImage from '../../../component/AvatarImage'
import tw from 'twrnc'

//聊天Tab
const TabSessionScreen = (props) => {

  const { theme } = useContext(ThemeContext)

  return (
    <View>
      {
        !props.avatar.get('ConnStatus') &&
        <View style={tw`bg-red-200 p-4`}>
          <Text style={tw`text-base text-center`}>
            未连接服务器，请检查网络设置或连通性
          </Text>
        </View>
      }

      {
        props.avatar.get('SessionList').length > 0 ?
          <View style={tw`h-full bg-stone-200 p-5px`}>
            <ScrollView
              style={tw`mb-60px`}
              automaticallyAdjustContentInsets={false}
              showsHorizontalScrollIndicator={false}
              showsVerticalScrollIndicator={true}>
              {
                props.avatar.get('SessionList').length > 0 ?
                  props.avatar.get('SessionList').map((item, index) => (
                    <View key={index} style={tw`bg-stone-100`}>
                      <TouchableOpacity onPress={() => props.navigation.push('Session', { address: item.Address })}>
                        <Flex>
                          <Flex.Item style={{ flex: 0.15 }}>
                            {
                              item.CountUnread != null && item.CountUnread != 0 ?
                                <Badge text={item.CountUnread} overflowCount={99} size='small'>
                                  <View style={{
                                    width: 55,
                                    height: 55,
                                  }}>
                                    <AvatarImage address={item.Address} />
                                  </View>
                                </Badge>
                                :
                                <AvatarImage address={item.Address} />
                            }
                          </Flex.Item>
                          <Flex.Item >
                            <View style={tw`flex flex-row`}>
                              <View style={tw`rounded-full px-1 border-2 border-gray-300`}>
                                <Text style={tw`text-base text-slate-800 text-center`}>
                                  {`${AddressToName(props.avatar.get('AddressMap'), item.Address)}`}
                                </Text>
                              </View>
                              <View style={tw`rounded-full px-1`}>
                                <Text style={tw`text-base text-slate-400`}>
                                  {timestamp_format(item.Timestamp)}
                                </Text>
                              </View>
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

const ReduxTabSessionScreen = connect((state) => {
  return {
    avatar: state.avatar
  }
})(TabSessionScreen)

export default ReduxTabSessionScreen

