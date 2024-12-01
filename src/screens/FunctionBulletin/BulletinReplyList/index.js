import React, { useEffect, useRef } from 'react'
import { View, ScrollView } from 'react-native'
import { actionType } from '../../../redux/actions/actionType'
import { connect } from 'react-redux'
import ViewEmpty from '../../../component/ViewEmpty'
import ItemReply from '../../../component/ItemReply'
import tw from '../../../lib/tailwind'

// 网络评论
const BulletinReplyListScreen = props => {
  const refPage = useRef(1)

  const loadBulletinReplyList = () => {
    props.dispatch({
      type: actionType.avatar.FetchBulletinReplyList,
      hash: props.route.params.hash,
      page: refPage.current
    })
  }

  useEffect(() => {
    return props.navigation.addListener('focus', () => {
      if (props.route.params && props.route.params.page > 1) {
        refPage.current = props.route.params.page
      }
      props.navigation.setOptions({
        title: `网络评论#${refPage.current}`,
      })

      loadBulletinReplyList()
    })
  })

  return (
    <View style={tw`h-full bg-neutral-200 dark:bg-neutral-800 pt-5px px-5px`}>
      {
        props.avatar.get('BulletinReplyList').length > 0 ?
          <ScrollView
            style={tw``}
            automaticallyAdjustContentInsets={false}
            showsHorizontalScrollIndicator={false}
            showsVerticalScrollIndicator={false}>
            {
              props.avatar.get('BulletinReplyList').map((reply, index) => (
                <ItemReply key={reply.Hash} itemIndex={index} address={reply.Address} sequence={reply.Sequence} hash={reply.Hash} content={reply.Content} timestamp={reply.Timestamp} />
              ))
            }
          </ScrollView>
          :
          <ViewEmpty />
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