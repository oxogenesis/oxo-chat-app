import React, { useContext, useState, useEffect } from 'react';
import { View, Text, TextInput } from 'react-native'
import { connect } from 'react-redux'
import { actionType } from '../../redux/actions/actionType'
import { Button, WhiteSpace } from '@ant-design/react-native';
import { styles } from '../../theme/style'
import { ThemeContext } from '../../theme/theme-context';

//缓存设置界面
const BulletinCacheScreen = (props) => {
  const [cache_size, setSize] = useState('')
  const [error_msg, setMsg] = useState('')
  const { theme } = useContext(ThemeContext);

  const setBulletinCacheSize = () => {
    let cache_size = parseInt(cache_size)
    if (cache_size == NaN || cache_size < 0) {
      setMsg('公告缓存数量不能小于0...')
    } else {
      props.dispatch({
        type: actionType.avatar.setBulletinCacheSize,
        cache_size: cache_size
      })
      setSize('')
      setMsg('')
      props.navigation.goBack()
    }
  }

  useEffect(() => {
    props.navigation.addListener('focus', () => {
      setSize(props.avatar.get('Setting').BulletinCacheSize)
    })
  })

  return (
    <View style={{
      ...styles.base_view,
      backgroundColor: theme.base_view
    }}>
      <TextInput
        placeholderTextColor={theme.text2}
        style={{
          ...styles.input_view,
          color: theme.text1
        }}
        placeholder={`公告缓存数量:${props.avatar.get('Setting').BulletinCacheSize}`}
        value={cache_size}
        onChangeText={setSize}
      />
      <WhiteSpace size='lg' />
      <Button style={{
        height: 55
      }} type='primary' onPress={setBulletinCacheSize}>设置</Button>
      <WhiteSpace size='lg' />
      <Text style={{
        color: 'red',
        paddingTop: 0
      }}>{`说明：
      1、关注账户的公告、收藏的公告均不是缓存公告。
      2、公告缓存数量设置为0时，应用不会自动删除缓存公告。`}</Text>
    </View>
  )

}

const ReduxBulletinCacheScreen = connect((state) => {
  return {
    avatar: state.avatar
  }
})(BulletinCacheScreen)

export default ReduxBulletinCacheScreen