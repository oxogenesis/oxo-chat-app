import React, { useEffect, useRef } from 'react'
import { View, Text, ScrollView, TouchableOpacity } from 'react-native'
import { actionType } from '../../../redux/actions/actionType'
import { connect } from 'react-redux'
import ViewEmpty from '../../../component/ViewEmpty'
import Avatar from '../../../component/Avatar'
import { BulletinAddressSession } from '../../../lib/Const'
import StrSequence from '../../../component/StrSequence'
import tw from '../../../lib/tailwind'

//活跃用户
const BulletinAddressListScreen = (props) => {
  const refPage = useRef(1)

  const loadBulletinAddressList = () => {
    props.dispatch({
      type: actionType.avatar.FetchBulletinAddressList,
      page: refPage.current
    })
  }

  useEffect(() => {
    return props.navigation.addListener('focus', () => {
      if (props.route.params && props.route.params.page > 1) {
        refPage.current = props.route.params.page
      }
      props.navigation.setOptions({
        title: `活跃用户#${refPage.current}`,
      })

      loadBulletinAddressList()
    })
  })

  return (
    <View style={tw`h-full bg-neutral-200 dark:bg-neutral-800 p-5px`}>
      {
        props.avatar.get('BulletinAddressList').length > 0 ?
          <ScrollView
            style={tw``}
            automaticallyAdjustContentInsets={false}
            showsHorizontalScrollIndicator={false}
            showsVerticalScrollIndicator={false}>
            {
              props.avatar.get('BulletinAddressList').map((item, index) => (
                <View key={index} style={tw`flex flex-row bg-stone-100 dark:bg-stone-500 p-5px mb-1px`}>
                  <Avatar address={item.Address} />
                  <View>
                    <View style={tw`flex flex-row`}>
                      <StrSequence sequence={item.Count} />
                      {
                        props.avatar.get('Follows').includes(item.Address) &&
                        <TouchableOpacity onPress={() => props.navigation.push('BulletinList', { session: BulletinAddressSession, address: item.Address })}>
                          <View style={tw`bg-yellow-500 rounded-full px-2 border-2 border-gray-300 dark:border-gray-700`}>
                            <Text style={tw`text-base text-slate-800 text-center`}>
                              公告
                            </Text>
                          </View>
                        </TouchableOpacity>
                      }
                      {
                        props.avatar.get('Friends').includes(item.Address) &&
                        <TouchableOpacity onPress={() => props.navigation.push('Session', { address: item.Address })}>
                          <View style={tw`bg-green-500 rounded-full px-2 border-2 border-gray-300 dark:border-gray-700`}>
                            <Text style={tw`text-base text-slate-800 text-center`}>
                              聊天
                            </Text>
                          </View>
                        </TouchableOpacity>
                      }
                    </View>
                    <TouchableOpacity onPress={() => props.navigation.push('AddressMark', { address: item.Address })}>
                      <View style={tw`bg-indigo-500 rounded-full px-2 border-2 border-gray-300 dark:border-gray-700`}>
                        <Text style={tw`text-sm text-slate-400`}>{item.Address}</Text>
                      </View>
                    </TouchableOpacity>
                  </View>
                </View>
              ))
            }
            <View style={tw`h-5`}></View>
          </ScrollView>
          :
          <ViewEmpty />
      }
    </View>
  )
}

const ReduxBulletinAddressListScreen = connect((state) => {
  return {
    avatar: state.avatar
  }
})(BulletinAddressListScreen)

export default ReduxBulletinAddressListScreen