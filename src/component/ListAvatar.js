import React from 'react'
import { View, ScrollView, TouchableOpacity } from 'react-native'
import AvatarImage from './AvatarImage'
import TextName from './TextName'
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
            <View style={tw`flex flex-row bg-stone-100 dark:bg-stone-500 p-5px mb-1px`}>
              <View>
                <AvatarImage address={item.address} />
              </View>
              <View >
                <View style={tw`flex flex-row`}>
                  <TextName name={item.title} />
                </View>
                {
                  item.timestamp &&
                  <TextTimestamp timestamp={item.timestamp} textSize='text-base' />
                }
              </View>
            </View>
          </TouchableOpacity>
        ))
      }
    </ScrollView>
  )
}

export default ListAvatar