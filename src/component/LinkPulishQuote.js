import React from 'react'
import { Text, View } from 'react-native'
import tw from 'twrnc'
import LinkBulletin from './LinkBulletin'

export default function LinkPublishQuote(props) {
  return (
    <View style={tw.style(`flex-row rounded-lg border-2 border-gray-400`)}>
      <LinkBulletin onPress={props.onPressQuote} name={props.name} sequence={props.sequence} />
      <View style={tw.style(`bg-gray-300 rounded-full px-1`)}>
        <Text
          style={tw.style(`text-base text-red-500 text-center`)}
          onPress={props.onPressCancel}>
          X
        </Text>
      </View>
    </View>
  )
}
