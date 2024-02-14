import React from 'react'
import { View, Text, ScrollView, TouchableOpacity } from 'react-native'
import { WhiteSpace } from '@ant-design/react-native'
import { connect } from 'react-redux'
import { Flex } from '@ant-design/react-native'
import { AddressToName } from '../../../lib/Util'
import ViewEmpty from '../../../component/ViewEmpty'
import AvatarImage from '../../../component/AvatarImage'
import tw from '../../../lib/tailwind'

// 转发公告到聊天
const AddressSelectScreen = props => {
  return (
    <View style={tw`h-full bg-neutral-200 dark:bg-neutral-800 p-5px`}>
      {
        props.avatar.get('Friends').length > 0 ?
          <View>
            <Text style={tw`text-lg text-center text-neutral-900`}>
              请选择好友
            </Text>
            <WhiteSpace />
            <ScrollView
              style={tw`h-full p-5px mb-0`}
              automaticallyAdjustContentInsets={false}
              showsHorizontalScrollIndicator={false}
              showsVerticalScrollIndicator={false}>
              {
                props.avatar.get('Friends').map((item, index) => (
                  <TouchableOpacity key={index} onPress={() => props.navigation.push('Session', { address: item, content: props.route.params.content })} >
                    <Flex justify="start" align="start" style={tw`bg-stone-100 p-5px mb-1px`}>
                      <View>
                        <AvatarImage address={item.Address} />
                      </View>
                      <View >
                        <View style={tw`flex flex-row`}>
                          <View style={tw`rounded-full px-1 border-2 border-gray-300`}>
                            <Text style={tw`text-base text-slate-800 text-center`}>
                              {AddressToName(props.avatar.get('AddressMap'), item)}
                            </Text>
                          </View>
                        </View>
                        <Text style={tw`text-sm text-slate-400`}>{item}</Text>
                      </View>
                    </Flex>
                  </TouchableOpacity>
                ))
              }
            </ScrollView>
          </View>
          :
          <ViewEmpty msg={`暂无好友...`} />
      }
    </View>
  )
}

const ReduxAddressSelectScreen = connect((state) => {
  return {
    avatar: state.avatar
  }
})(AddressSelectScreen)

export default ReduxAddressSelectScreen