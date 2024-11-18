import React, { useEffect } from 'react'
import { View, ScrollView, Text } from 'react-native'
import { useNavigation, useRoute } from '@react-navigation/native'
import { connect } from 'react-redux'
import { actionType } from '../../../redux/actions/actionType'
import ViewEmpty from '../../../component/ViewEmpty'
import tw from '../../../lib/tailwind'

//公告列表
const MsgInfoScreen = (props) => {

  useEffect(() => {
    return props.navigation.addListener('focus', () => {
      props.dispatch({
        type: actionType.avatar.LoadMsgInfo,
        hash: props.route.params.hash
      })
    })
  })

  return (
    <View style={tw`h-full bg-neutral-200 dark:bg-neutral-800 p-5px`}>
      {
        props.avatar.get('MsgInfo') != null ?
          <>
            <View style={tw`border-b border-stone-500`}>
              <Text style={tw`text-base text-slate-800`}>
                {`哈希：${props.route.params.hash}`}
              </Text>
              {
                props.avatar.get('MsgInfo').SourAddress != null &&
                <Text style={tw`text-base text-slate-800`}>
                  {`发送地址：${props.avatar.get('MsgInfo').SourAddress}`}
                </Text>
              }
              {
                props.avatar.get('MsgInfo').DestAddress != null &&
                <Text style={tw`text-base text-slate-800`}>
                  {`接收地址：${props.avatar.get('MsgInfo').DestAddress}`}
                </Text>
              }
              <Text style={tw`text-base text-slate-800`}>
                {`序号：${props.avatar.get('MsgInfo').Sequence}`}
              </Text>
              <Text style={tw`text-base text-slate-800`}>
                {`签名时间：${props.avatar.get('MsgInfo').Timestamp}`}
              </Text>
              {
                props.avatar.get('MsgInfo').SourAddress != null &&
                <Text style={tw`text-base text-slate-800`}>
                  {`接受时间：${props.avatar.get('MsgInfo').CreatedAt}`}
                </Text>
              }
              {
                props.avatar.get('MsgInfo').ACK && props.avatar.get('MsgInfo').ACK.length != 0 &&
                <View>
                  <Text style={tw`text-base text-slate-800`}>
                    确认消息列表：
                  </Text>
                  {
                    props.avatar.get('MsgInfo').ACK.map((item, index) => (
                      <Text key={index} style={tw`text-sm text-slate-800`}>
                        {`#${item.Sequence}:${item.Hash}`}
                      </Text>
                    ))
                  }
                </View>
              }
            </View>
            <ScrollView>
              <Text style={tw`text-base text-slate-800`}>
                {props.avatar.get('MsgInfo').Content}
              </Text>
            </ScrollView>
          </>
          :
          <ViewEmpty />
      }
    </View>
  )
}

const ReduxMsgInfoScreen = connect((state) => {
  return {
    avatar: state.avatar
  }
})(MsgInfoScreen)

export default function (props) {
  const navigation = useNavigation()
  const route = useRoute()
  return <ReduxMsgInfoScreen{...props} navigation={navigation} route={route} />
}