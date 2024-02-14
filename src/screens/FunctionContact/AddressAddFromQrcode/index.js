import React, { useState, useEffect } from 'react'
import { View } from 'react-native'
import { connect } from 'react-redux'
import { actionType } from '../../../redux/actions/actionType'
import { WhiteSpace } from '@ant-design/react-native'
import InputPrimary from '../../../component/InputPrimary'
import ButtonPrimary from '../../../component/ButtonPrimary'
import tw from '../../../lib/tailwind'

// 
const AddressAddFromQrcodeScreen = (props) => {
  const [address, setAddress] = useState('')
  const [relay, setRelay] = useState('')

  const markAddress = () => {
    props.navigation.replace('AddressAdd', { address: address })
  }

  const addHost = () => {
    let host = relay
    let regx = /^ws[s]?:\/\/.+/
    let rs = regx.exec(host)
    if (rs != null) {
      props.dispatch({
        type: actionType.avatar.addHost,
        host: host
      })
    }
    props.navigation.replace('AddressAdd', { address: address })
  }

  useEffect(() => {
    return props.navigation.addListener('focus', () => {
      if (props.route.params && props.route.params.qrcode) {
        setAddress(props.route.params.qrcode.Address)
        setRelay(props.route.params.qrcode.Relay)
      } else {
        props.navigation.goBack()
      }
    })
  })

  return (
    <View style={tw`h-full bg-neutral-200 dark:bg-neutral-800 p-5px`}>
      <View style={tw`my-auto p-25px`}>
        <InputPrimary value={address} editable={false} placeholder={'账户地址'} />
        <InputPrimary value={relay} editable={false} placeholder={'服务地址'} />

        <WhiteSpace size='md' />

        <ButtonPrimary title={'标记地址'} onPress={markAddress} />
        <ButtonPrimary title={'标记地址 + 保存服务器网址'} onPress={addHost} />
      </View>
    </View>
  )
}

const ReduxAddressAddFromQrcodeScreen = connect((state) => {
  return {
    avatar: state.avatar
  }
})(AddressAddFromQrcodeScreen)

export default ReduxAddressAddFromQrcodeScreen