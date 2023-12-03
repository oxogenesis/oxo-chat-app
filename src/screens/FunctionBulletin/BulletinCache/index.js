import React, { useContext, useState, useEffect } from 'react'
import { View, Text, TextInput } from 'react-native'
import { connect } from 'react-redux'
import { actionType } from '../../../redux/actions/actionType'
import { Button, WhiteSpace } from '@ant-design/react-native'
import { ThemeContext } from '../../../theme/theme-context'
import tw from 'twrnc'
import ErrorMsg from '../../../component/ErrorMsg'

//缓存设置界面
const BulletinCacheScreen = (props) => {
  const [size, setSize] = useState('')
  const [error_msg, setMsg] = useState('')
  const { theme } = useContext(ThemeContext)

  const setBulletinCacheSize = () => {
    let bulletin_cache_size = parseInt(size)
    if (isNaN(bulletin_cache_size) || bulletin_cache_size < 0) {
      setMsg('公告缓存数量不能小于0...')
    } else {
      props.dispatch({
        type: actionType.avatar.changeBulletinCacheSize,
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
    <View style={tw`h-full bg-stone-200`}>
      <View style={tw.style(`my-auto`)}>
        <TextInput
          placeholder={`公告缓存数量:${props.avatar.get('BulletinCacheSize')}`}
          placeholderTextColor={tw.color('stone-500')}
          style={tw.style(`rounded-full border-solid border-2 border-gray-300 text-base text-center`)}
          value={size}
          onChangeText={text => setSize(text)}
        />
        {
          error_msg.length > 0 &&
          <ErrorMsg error_msg={error_msg} />
        }
        <Button style={tw.style(`rounded-full bg-green-500`)} onPress={setBulletinCacheSize}>
          <Text style={tw.style(`text-xl text-slate-100`)}>设置</Text>
        </Button>
        <WhiteSpace size='lg' />
        <Text style={{
          color: 'red',
          paddingTop: 0
        }}>{`说明：
      1、关注账户的公告、收藏的公告均不是缓存公告。
      2、公告缓存数量设置为0时，应用不会自动删除缓存公告。`}</Text>
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