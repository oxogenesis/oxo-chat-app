import React from 'react'
import { View, Text, ScrollView, TouchableOpacity } from 'react-native'
import { connect } from 'react-redux'
import ViewEmpty from '../../../component/ViewEmpty'
import Avatar from '../../../component/Avatar'
import { BulletinAddressSession } from '../../../lib/Const'
import TextName from '../../../component/TextName'
import TextAddress from '../../../component/TextAddress'
import tw from '../../../lib/tailwind'

//联系人Tab
const TabAddressBookScreen = props => {
  return (
    <View style={tw`h-full bg-neutral-200 dark:bg-neutral-800`}>
      {
        props.avatar.get('AddressArray').length > 0 ?
          <ScrollView
            style={tw`h-full p-5px mb-0`}
            automaticallyAdjustContentInsets={false}
            showsHorizontalScrollIndicator={false}
            showsVerticalScrollIndicator={false}>
            {
              props.avatar.get('AddressArray').map((item, index) => (
                <TouchableOpacity key={index} onPress={() => props.navigation.push('AddressMark', { address: item.Address })} >
                  <View style={tw`flex flex-row bg-stone-100 dark:bg-stone-500 p-5px mb-1px`}>
                    <View>
                      <Avatar address={item.Address} />
                    </View>
                    <View >
                      <View style={tw`flex flex-row`}>
                        <TextName name={item.Name} />
                        {
                          props.avatar.get('Follows').includes(item.Address) &&
                          <TouchableOpacity onPress={() => props.navigation.push('BulletinList', { session: BulletinAddressSession, address: item.Address })}>
                            <View style={tw`bg-yellow-500 rounded-full px-2 border-2 border-gray-300 dark:border-gray-700`}>
                              <Text style={tw`text-base text-slate-800 dark:text-slate-200 text-center`}>
                                公告
                              </Text>
                            </View>
                          </TouchableOpacity>
                        }
                        {
                          props.avatar.get('Friends').includes(item.Address) &&
                          <TouchableOpacity onPress={() => props.navigation.push('Session', { address: item.Address })}>
                            <View style={tw`bg-green-500 rounded-full px-2 border-2 border-gray-300 dark:border-gray-700`}>
                              <Text style={tw`text-base text-slate-800 dark:text-slate-200 text-center`}>
                                聊天
                              </Text>
                            </View>
                          </TouchableOpacity>
                        }
                      </View>
                      <TextAddress address={item.Address} />
                    </View>
                  </View>
                </TouchableOpacity>
              ))
            }
          </ScrollView>
          :
          <ViewEmpty msg={`暂无联系人...`} />
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