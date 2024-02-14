import React, { useState, useEffect } from 'react'
import { View } from 'react-native'
import { connect } from 'react-redux'
import { actionType } from '../../../redux/actions/actionType'
import ButtonPrimary from '../../../component/ButtonPrimary'
import InputPrimary from '../../../component/InputPrimary'
import ErrorMsg from '../../../component/ErrorMsg'
import tw from '../../../lib/tailwind'

//添加联系人
const AddressAddScreen = (props) => {
  const [name, setName] = useState("")
  const [address, setAddress] = useState("")
  const [flagFromScan, setFlagFromScan] = useState(false)
  const [error_msg, setMsg] = useState('')

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
        setFlagFromScan(true)
      }
    })
  })


  return (
    <View style={tw`h-full bg-neutral-200 dark:bg-neutral-800 p-5px`}>
      <View style={tw`my-auto`}>
        {
          flagFromScan ?
            <InputPrimary value={address} editable={false} setValue={setAddress} placeholder={'地址'} textSize={'text-sm'} />
            :
            <InputPrimary value={address} setValue={setAddress} placeholder={'地址'} textSize={'text-sm'} />
        }
        <InputPrimary value={name} setValue={setName} placeholder={'昵称'} />

        {
          error_msg.length > 0 &&
          <ErrorMsg error_msg={error_msg} />
        }

        <ButtonPrimary title={'标记'} onPress={addAddressMark} />
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