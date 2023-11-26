import React, { useContext, useState, useEffect } from 'react'
import { View, Text, TextInput } from 'react-native'
import { connect } from 'react-redux'
import { actionType } from '../../../redux/actions/actionType'
import { Button, WhiteSpace } from '@ant-design/react-native'
import { ThemeContext } from '../../../theme/theme-context'
import { styles } from '../../../theme/style'
import tw from 'twrnc'

//添加联系人
const AddressAddScreen = (props) => {
  const [name, setName] = useState("")
  const [address, setAddress] = useState("")
  const [error_msg, setMsg] = useState('')
  const { theme } = useContext(ThemeContext)

  const addAddressMark = () => {
    let newAddress = address.trim()
    let newName = name.trim()
    if (address.trim() == '' || newName == '' || newName.length > 16) {
      setMsg('地址或昵称不能为空，昵称长度不能超过16个字符...')
      return
    } else if (newAddress == props.avatar.get('Address')) {
      setMsg('不能标记自己...')
      return
    }
    props.dispatch({
      type: actionType.avatar.addAddressMark,
      address: newAddress,
      name: newName
    })
    props.navigation.goBack()
  }

  useEffect(() => {
    return props.navigation.addListener('focus', () => {
      if (props.route.params && props.route.params.address) {
        setAddress(props.route.params.address)
      }
    })
  })


  return (
    <View style={{
      ...styles.base_view,
      backgroundColor: theme.base_view
    }}>
      <TextInput
        placeholderTextColor={tw.color('stone-500')}
        style={{
          ...styles.input_view,
          color: theme.text1
        }}
        placeholder="地址"
        value={address}
        onChangeText={text => setAddress(text)}
      />
      <WhiteSpace size='lg' />
      <TextInput
        placeholderTextColor={tw.color('stone-500')}
        style={{
          ...styles.input_view,
          color: theme.text1
        }}
        placeholder="昵称"
        value={name}
        onChangeText={text => setName(text)}
      />
      <WhiteSpace size='lg' />
      {
        error_msg.length > 0 &&
        <View>
          <Text style={tw.style('text-base', 'text-red-500')}>{error_msg}</Text>
          <WhiteSpace size='lg' />
        </View>
      }
      <Button
        style={tw.style('px-4', 'py-1', 'rounded', 'bg-blue-800', 'text-white')}
        type='primary'
        onPress={addAddressMark}
      >
        标记
      </Button>
    </View>
  )
}

const ReduxAddressAddScreen = connect((state) => {
  return {
    avatar: state.avatar
  }
})(AddressAddScreen)

export default ReduxAddressAddScreen