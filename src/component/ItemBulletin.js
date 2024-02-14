import React from 'react'
import { useNavigation, useRoute } from '@react-navigation/native'
import { View, Text } from 'react-native'
import { connect } from 'react-redux'
import { BulletinPreviewSize } from '../lib/Const'
import TextTimestamp from './TextTimestamp'
import Avatar from './Avatar'
import LinkBulletin from './LinkBulletin'
import BulletinContent from './BulletinContent'
import tw from '../lib/tailwind'

const ItemBulletin = (props) => {
  const bulletin = props.item
  const key = props.index ? props.index : bulletin.hash
  return (
    <View key={key} style={tw`flex flex-row bg-neutral-100 p-5px`}>
      <Avatar address={bulletin.Address} onPress={() => props.navigation.push('AddressMark', { address: bulletin.Address })} />

      <View>
        <Text>
          <LinkBulletin address={bulletin.Address} sequence={bulletin.Sequence} hash={bulletin.Hash} to={bulletin.Address} />
        </Text>

        <View style={tw`flex flex-row mr-55px`}>
          <TextTimestamp timestamp={bulletin.Timestamp} textSize={'text-sm'} />
          {
            bulletin.QuoteSize != 0 &&
            <Text style={tw`absolute right-0 text-sm text-gray-400`}>
              引用：◀{bulletin.QuoteSize}
            </Text>
          }
        </View>
        {bulletin.Content.length <= BulletinPreviewSize ?
          <BulletinContent content={bulletin.Content} onPress={() => props.navigation.push('Bulletin', { hash: bulletin.Hash })} />
          :
          <BulletinContent content={bulletin.Content.slice(0, BulletinPreviewSize)} onPress={() => props.navigation.push('Bulletin', { hash: bulletin.Hash })} />
        }
      </View>
    </View>
  )
}

const ReduxItemBulletin = connect((state) => {
  return {
    avatar: state.avatar
  }
})(ItemBulletin)

export default function (props) {
  const navigation = useNavigation()
  const route = useRoute()
  return <ReduxItemBulletin{...props} navigation={navigation} route={route} />
}