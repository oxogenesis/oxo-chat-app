import React from 'react'
import { Text, View } from 'react-native'
import Avatar from './Avatar'
import LinkBulletin from './LinkBulletin'
import TextTimestamp from './TextTimestamp'
import BulletinContent from './BulletinContent'
import tw from '../lib/tailwind'

const ItemReply = ({ itemIndex, address, sequence, hash, content, timestamp }) => {
  return (
    <View style={tw`flex flex-col bg-stone-100 dark:bg-stone-500`}>
      <View style={tw`flex flex-row mx-5px mt-5px`}>
        <Avatar address={address} />

        <View style={tw`flex flex-col`}>
          <Text>
            <LinkBulletin address={address} sequence={sequence} hash={hash} to={address} />
            <View style={tw`rounded-full px-1 border-2 border-gray-300 dark:border-gray-700`}>
              <Text style={tw`text-base text-slate-800 dark:text-slate-200 text-center`}>
                {`#${itemIndex + 1}楼`}
              </Text>
            </View>
          </Text>

          <Text>
            <TextTimestamp timestamp={timestamp} textSize={'text-xs'} />
          </Text>
        </View>
      </View>

      <BulletinContent content={content} />
    </View>
  )
}

export default ItemReply