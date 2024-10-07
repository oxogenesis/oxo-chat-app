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
  // const key = props.index ? props.index : bulletin.hash
  return (
    <View style={tw`flex flex-col bg-stone-100 dark:bg-stone-500`}>
      <View style={tw`flex flex-row mx-5px mt-5px`}>
        <Avatar address={bulletin.Address} onPress={() => props.navigation.push('AddressMark', { address: bulletin.Address })} />

        <View style={tw`flex flex-col`}>
          <Text>
            <LinkBulletin address={bulletin.Address} sequence={bulletin.Sequence} hash={bulletin.Hash} to={bulletin.Address} />
          </Text>

          <View style={tw`flex flex-row justify-between`}>
            <TextTimestamp timestamp={bulletin.Timestamp} textSize={'text-xs'} />
            {
              bulletin.QuoteCount != 0 &&
              <Text style={tw`text-sm font-bold text-gray-400 dark:text-gray-200`}>
                引用：{bulletin.QuoteCount}▶
              </Text>
            }
            {
              bulletin.FileCount != 0 &&
              <Text style={tw`text-sm font-bold text-gray-400 dark:text-gray-200`}>
                附件：{bulletin.FileCount}▦
              </Text>
            }
          </View>
        </View>
      </View>

      {bulletin.Content.length <= BulletinPreviewSize ?
        <BulletinContent content={bulletin.Content} onPress={() => props.navigation.push('Bulletin', { hash: bulletin.Hash })} />
        :
        <BulletinContent content={bulletin.Content.slice(0, BulletinPreviewSize)} onPress={() => props.navigation.push('Bulletin', { hash: bulletin.Hash })} />
      }
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