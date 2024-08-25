import React, { useState, useEffect } from 'react'
import { View, Text } from 'react-native'
import { connect } from 'react-redux'
import { actionType } from '../../../redux/actions/actionType'
import ButtonPrimary from '../../../component/ButtonPrimary'
import InputPrimary from '../../../component/InputPrimary'
import ErrorMsg from '../../../component/ErrorMsg'
import tw from '../../../lib/tailwind'

//缓存设置界面
const BulletinCacheScreen = (props) => {
  const [size, setSize] = useState('')
  const [error_msg, setMsg] = useState('')

  const setBulletinCacheSize = () => {
    let bulletin_cache_size = parseInt(size)
    if (isNaN(bulletin_cache_size) || bulletin_cache_size < 0) {
      setMsg('公告缓存数量不能小于0...')
    } else {
      props.dispatch({
        type: actionType.avatar.ChangeBulletinCacheSize,
        bulletin_cache_size: bulletin_cache_size
      })
      setSize('')
      setMsg('')
      props.navigation.goBack()
    }
  }

  useEffect(() => {
    return props.navigation.addListener('focus', () => {
      setSize(`${props.avatar.get('BulletinCacheSize')}`)
    })
  })

  return (
    <View style={tw`h-full bg-neutral-200 dark:bg-neutral-800 p-5px`}>
      <View style={tw`my-auto p-25px`}>
        <InputPrimary value={size} setValue={setSize} placeholder={`公告缓存数量:${props.avatar.get('BulletinCacheSize')}`} />

        {
          error_msg.length > 0 &&
          <ErrorMsg error_msg={error_msg} />
        }

        <ButtonPrimary title={'设置'} onPress={setBulletinCacheSize} />
        <View style={tw`h-5`}></View>
        <Text style={tw`text-base text-red-500`}>
          {`说明：
1、关注账户的公告、收藏的公告均不占用缓存公告数量。
2、公告缓存数量设置为0时，应用不会自动删除缓存公告。`}
        </Text>
      </View>
    </View>
  )
}

const ReduxBulletinCacheScreen = connect((state) => {
  return {
    avatar: state.avatar
  }
})(BulletinCacheScreen)

export default ReduxBulletinCacheScreen