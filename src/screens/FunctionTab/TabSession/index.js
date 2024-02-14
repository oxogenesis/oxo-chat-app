import React from 'react'
import { ScrollView, View, Text, TouchableOpacity } from 'react-native'
import { connect } from 'react-redux'
import { Flex, Badge } from '@ant-design/react-native'
import { AddressToName } from '../../../lib/Util'
import ViewEmpty from '../../../component/ViewEmpty'
import AvatarImage from '../../../component/AvatarImage'
import TextTimestamp from '../../../component/TextTimestamp'
import tw from '../../../lib/tailwind'
import TextName from '../../../component/TextName'
import TextAddress from '../../../component/TextAddress'

//聊天Tab
const TabSessionScreen = (props) => {
  return (
    <View style={tw`h-full bg-neutral-200 dark:bg-neutral-800`}>
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
          <ScrollView
            style={tw`h-full p-5px mb-0`}
            automaticallyAdjustContentInsets={false}
            showsHorizontalScrollIndicator={false}
            showsVerticalScrollIndicator={true}>
            {
              props.avatar.get('SessionList').map((item, index) => (
                <TouchableOpacity key={index} onPress={() => props.navigation.push('Session', { address: item.Address })}>
                  <Flex justify="start" align="start" style={tw`bg-stone-100 p-5px`}>
                    <View>
                      {
                        item.CountUnread != null && item.CountUnread != 0 ?
                          <Badge text={item.CountUnread} overflowCount={99} size="small">
                            <AvatarImage address={item.Address} />
                          </Badge>
                          :
                          <AvatarImage address={item.Address} />
                      }
                    </View>
                    <View >
                      <View style={tw`flex flex-row`}>
                        <Text>
                          <TextName name={AddressToName(props.avatar.get('AddressMap'), item.Address)} />
                          <TextTimestamp timestamp={item.Timestamp} textSize={'text-xs'} />
                        </Text>
                      </View>
                      <TextAddress address={item.Content} />
                    </View>
                  </Flex>
                </TouchableOpacity>
              ))
            }
          </ScrollView>
          :
          <ViewEmpty msg={`暂无会话...`} />
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

