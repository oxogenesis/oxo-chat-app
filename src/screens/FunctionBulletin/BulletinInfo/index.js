import React, { useEffect } from 'react'
import { View, ScrollView, Text } from 'react-native'
import { useNavigation, useRoute } from '@react-navigation/native'
import { connect } from 'react-redux'
import { actionType } from '../../../redux/actions/actionType'
import ViewEmpty from '../../../component/ViewEmpty'
import tw from '../../../lib/tailwind'

//公告列表
const BulletinInfoScreen = (props) => {

  useEffect(() => {
    return props.navigation.addListener('focus', () => {
      props.dispatch({
        type: actionType.avatar.LoadCurrentBulletin,
        address: props.route.params.address,
        sequence: props.route.params.sequence,
        hash: props.route.params.hash,
        to: props.route.params.to
      })
    })
  })

  return (
    <View style={tw`h-full bg-neutral-200 dark:bg-neutral-800 p-5px`}>
      {
        props.avatar.get('CurrentBulletin') != null ?
          <>
            <View style={tw`border-b border-stone-500`}>
              <Text style={tw`text-base text-slate-800`}>
                {`哈希：${props.route.params.hash}`}
              </Text>
              <Text style={tw`text-base text-slate-800`}>
                {`地址：${props.avatar.get('CurrentBulletin').Address}`}
              </Text>
              <Text style={tw`text-base text-slate-800`}>
                {`序号：${props.avatar.get('CurrentBulletin').Sequence}`}
              </Text>
              <Text style={tw`text-base text-slate-800`}>
                {`时间：${props.avatar.get('CurrentBulletin').Timestamp}`}
              </Text>
              <Text style={tw`text-base text-slate-800`}>
                {`引用：${props.avatar.get('CurrentBulletin').QuoteCount}`}
              </Text>
              <Text style={tw`text-base text-slate-800`}>
                {`附件：${props.avatar.get('CurrentBulletin').FileCount}`}
              </Text>
              {
                <View>
                  {
                    props.avatar.get('CurrentBulletin').QuoteList.map((item, index) => (
                      <Text key={index} style={tw`text-sm text-slate-800`}>
                        {index + 1} : {item.Address}#{item.Sequence}({item.Hash})
                      </Text>
                    ))
                  }
                </View>
              }
            </View>
            <ScrollView>
              <Text style={tw`text-base text-slate-800`}>
                {props.avatar.get('CurrentBulletin').Content}
              </Text>
            </ScrollView>
          </>
          :
          <ViewEmpty />
      }
    </View>
  )
}

const ReduxBulletinInfoScreen = connect((state) => {
  return {
    avatar: state.avatar
  }
})(BulletinInfoScreen)

export default function (props) {
  const navigation = useNavigation()
  const route = useRoute()
  return <ReduxBulletinInfoScreen{...props} navigation={navigation} route={route} />
}