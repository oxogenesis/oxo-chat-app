import React, { useContext, useEffect } from 'react'
import { View, ScrollView } from 'react-native'
import { actionType } from '../../../redux/actions/actionType'
import { connect } from 'react-redux'
import EmptyView from '../../FunctionBase/EmptyView'
import { ThemeContext } from '../../../theme/theme-context'
import Reply from '../../../component/Reply'
import tw from 'twrnc'

// 网络评论
const BulletinReplyListScreen = props => {
  const { theme } = useContext(ThemeContext)

  const loadBulletinReplyList = () => {
    let page = 1
    if (props.route.params.page > 1) {
      page = props.route.params.page
    }
    props.dispatch({
      type: actionType.avatar.FetchBulletinReplyList,
      hash: props.route.params.hash,
      page: 1
    })
  }

  useEffect(() => {
    return props.navigation.addListener('focus', () => {
      loadBulletinReplyList()
    })
  })

  return (
    <View>
      {
        props.avatar.get('BulletinReplyList').length > 0 ?
          <View style={tw`h-full bg-stone-200 p-5px`}>
            <ScrollView
              style={tw``}
              automaticallyAdjustContentInsets={false}
              showsHorizontalScrollIndicator={false}
              showsVerticalScrollIndicator={false}>
              {
                props.avatar.get('BulletinReplyList').length > 0 ?
                  props.avatar.get('BulletinReplyList').map((reply, index) => (
                    <View key={index} style={tw`bg-stone-100`}>
                      <Reply key={index} address={reply.Address} sequence={reply.Sequence} hash={reply.Hash} content={reply.Content} timestamp={reply.Timestamp} />
                    </View>
                  ))
                  :
                  <EmptyView />
              }
            </ScrollView>
          </View>
          :
          <EmptyView />
      }
    </View>
  )
}

const ReduxBulletinReplyListScreen = connect((state) => {
  return {
    avatar: state.avatar
  }
})(BulletinReplyListScreen)

export default ReduxBulletinReplyListScreen