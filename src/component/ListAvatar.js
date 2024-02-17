import React from 'react'
import { View, Text, ScrollView, TouchableOpacity } from 'react-native'
import { Flex } from '@ant-design/react-native'
import AvatarImage from './AvatarImage'
import TextTimestamp from './TextTimestamp'
import tw from '../lib/tailwind'

const ListAvatar = ({ data = [] }) => {
  return (
    <ScrollView
      style={tw`h-full p-5px mb-0`}
      automaticallyAdjustContentInsets={false}
      showsHorizontalScrollIndicator={false}
      showsVerticalScrollIndicator={false}>
      {
        data.map((item, index) => (
          <TouchableOpacity key={index} onPress={item.onPress} >
            <Flex justify="start" align="start" style={tw`bg-stone-100 p-5px mb-1px`}>
              <View>
                <AvatarImage address={item.address} />
              </View>
              <View >
                <View style={tw`flex flex-row`}>
                  <View style={tw`rounded-full px-1 border-2 border-gray-300 dark:border-gray-700`}>
                    <Text style={tw`text-base text-slate-800 text-center`}>
                      {`${item.title}`}
                    </Text>
                  </View>
                </View>
                {
                  item.timestamp &&
                  <TextTimestamp timestamp={item.timestamp} textSize='text-base' />
                }
              </View>
            </Flex>
          </TouchableOpacity>
        ))
      }
    </ScrollView>
  )
}

export default ListAvatar