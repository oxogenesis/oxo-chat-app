import React, { useContext, useState, useEffect } from 'react'
import { View, Text, TextInput } from 'react-native'
import { connect } from 'react-redux'
import { actionType } from '../../../redux/actions/actionType'
import { Button, WhiteSpace } from '@ant-design/react-native'
import { ThemeContext } from '../../../theme/theme-context'
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
    <View style={tw`h-full bg-stone-200`}>
      <View style={tw.style(`my-auto`)}>
        <TextInput
          placeholder="地址"
          placeholderTextColor={tw.color('stone-500')}
          style={tw.style(`rounded-full border-solid border-2 border-gray-300 text-base text-center`)}
          value={address}
          onChangeText={text => setAddress(text)}
        />
        <TextInput
          placeholder="昵称"
          placeholderTextColor={tw.color('stone-500')}
          style={tw.style(`rounded-full border-solid border-2 border-gray-300 text-base text-center`)}
          value={name}
          onChangeText={text => setName(text)}
        />
        {
          error_msg.length > 0 &&
          <View>
            <Text style={tw.style('text-base', 'text-red-500')}>{error_msg}</Text>
            <WhiteSpace size='lg' />
          </View>
        }
        <Button style={tw.style(`rounded-full bg-green-500`)} onPress={addAddressMark}>
          <Text style={tw.style(`text-xl text-slate-100`)}>标记</Text>
        </Button>
      </View>
    </View>
  )
}

const ReduxAddressAddScreen = connect((state) => {
  return {
    avatar: state.avatar
  }
})(AddressAddScreen)

export default ReduxAddressAddScreen