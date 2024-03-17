import React from 'react'
import { View, Text, ScrollView, TouchableOpacity } from 'react-native'
import { connect } from 'react-redux'
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
            <Text style={tw`text-lg text-center text-slate-800 dark:text-slate-200`}>
              请选择好友
            </Text>
            <View style={tw`h-5`}></View>
            <ScrollView
              style={tw`h-full p-5px mb-0`}
              automaticallyAdjustContentInsets={false}
              showsHorizontalScrollIndicator={false}
              showsVerticalScrollIndicator={false}>
              {
                props.avatar.get('Friends').map((item, index) => (
                  <TouchableOpacity key={index} onPress={() => props.navigation.push('Session', { address: item, content: props.route.params.content })} >
                    <View style={tw`flex flex-row bg-stone-100 dark:bg-stone-500 p-5px mb-1px`}>
                      <View>
                        <AvatarImage address={item.Address} />
                      </View>
                      <View>
                        <View style={tw`bg-indigo-500 rounded-full px-1 border-2 border-gray-300 dark:border-gray-700`}>
                          <Text style={tw`text-base text-slate-800 dark:text-slate-200 text-center`}                        >
                            {AddressToName(props.avatar.get('AddressMap'), item)}
                          </Text>
                        </View>
                        <Text style={tw`text-sm text-gray-500 dark:text-slate-200 text-left`}>{item}</Text>
                      </View>
                    </View>
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