import React from 'react'
import { Text, View } from 'react-native'
import Avatar from './Avatar'
import LinkBulletin from './LinkBulletin'
import TextTimestamp from './TextTimestamp'
import BulletinContent from './BulletinContent'
import tw from '../lib/tailwind'

const ItemReply = ({ itemIndex, address, sequence, hash, content, timestamp }) => {
  return (
    <View key={`reply${itemIndex}`} style={tw`flex flex-row bg-neutral-100 p-5px`}>
      <Avatar address={address} />

      <View style={tw``}>
        <Text>
          <LinkBulletin address={address} sequence={sequence} hash={hash} to={address} />
          <View style={tw`rounded-full px-1 border-2 border-gray-300`}>
            <Text style={tw`text-base text-slate-800 text-center`}>
              {`#${itemIndex + 1}楼`}
            </Text>
          </View>
        </Text>

        <Text>
          <TextTimestamp timestamp={timestamp} textSize={'text-xs'} />
        </Text>

        <BulletinContent content={content} />
      </View>
    </View>
  )
}

export default ItemReply