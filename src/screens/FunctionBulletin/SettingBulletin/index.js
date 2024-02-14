import React, { useState } from 'react'
import { View } from 'react-native'
import { connect } from 'react-redux'
import { BulletinHistorySession, BulletinMarkSession } from '../../../lib/Const'
import { actionType } from '../../../redux/actions/actionType'
import { WhiteSpace } from '@ant-design/react-native'
import LinkSetting from '../../../component/LinkSetting'
import ViewAlert from '../../../component/ViewAlert'
import tw from '../../../lib/tailwind'

//设置公告
const SettingBulletinScreen = (props) => {
  const [visible, showModal] = useState(false)

  const clearBulletinCacheAlert = () => {
    showModal(true)
  }

  const clearBulletinCache = () => {
    props.dispatch({
      type: actionType.avatar.clearBulletinCache
    })
  }

  const onClose = () => {
    showModal(false)
  }

  return (
    <View style={tw`h-full bg-neutral-200 dark:bg-neutral-800 p-5px`}>
      <WhiteSpace size='lg' />
      <LinkSetting title={'收藏公告'} onPress={() => {
        props.navigation.push('BulletinList', { session: BulletinMarkSession })
      }} />
      <LinkSetting title={'浏览历史'} onPress={() => {
        props.navigation.push('BulletinList', { session: BulletinHistorySession })
      }} />

      <WhiteSpace size='lg' />
      <LinkSetting title={'随便看看'} onPress={() => {
        props.navigation.push('BulletinRandom')
      }} />
      <LinkSetting title={'活跃用户'} onPress={() => {
        props.navigation.push('BulletinAddressList', { page: 1 })
      }} />

      <WhiteSpace size='lg' />
      <LinkSetting title={'设置缓存'} onPress={() => {
        props.navigation.push('BulletinCache')
      }} />
      <LinkSetting title={'清空缓存'} icon={'delete'} onPress={clearBulletinCacheAlert} />

      <ViewAlert
        visible={visible}
        onClose={onClose}
        msg='确定要清除所有缓存公告吗？'
        onPress={clearBulletinCache}
      />
    </View >
  )
}


const ReduxSettingBulletinScreen = connect((state) => {
  return {
    avatar: state.avatar
  }
})(SettingBulletinScreen)

export default ReduxSettingBulletinScreen