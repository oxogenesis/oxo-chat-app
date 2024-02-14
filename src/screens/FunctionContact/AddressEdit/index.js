import React, { useState } from 'react'
import { View } from 'react-native'
import { useNavigation, useRoute } from '@react-navigation/native'
import { connect } from 'react-redux'
import { actionType } from '../../../redux/actions/actionType'
import ButtonPrimary from '../../../component/ButtonPrimary'
import InputPrimary from '../../../component/InputPrimary'
import { AddressToName } from '../../../lib/Util'
import ErrorMsg from '../../../component/ErrorMsg'
import tw from '../../../lib/tailwind'

//地址标记
const AddressEditScreen = (props) => {
  const [address, setAddress] = useState(props.route.params.address)
  const [name, setName] = useState(AddressToName(props.avatar.get('AddressMap'), props.route.params.address))
  const [error_msg, setMsg] = useState('')

  const saveAddressName = () => {
    let newName = name.trim()
    if (name == '') {
      setMsg('昵称不能为空...')
      return
    }
    console.log(address)
    props.dispatch({
      type: actionType.avatar.saveAddressName,
      address: address,
      name: newName
    })
    props.navigation.goBack()
  }

  return (
    <View style={tw`h-full bg-neutral-200 dark:bg-neutral-800 p-5px`}>
      <View style={tw`my-auto`}>
        <InputPrimary value={address} setValue={setAddress} placeholder={'地址'} editable={false} textSize={'text-sm'} />
        <InputPrimary value={name} setValue={setName} placeholder={'昵称'} />

        {
          error_msg.length > 0 &&
          <ErrorMsg error_msg={error_msg} />
        }

        <ButtonPrimary title={'保存'} onPress={saveAddressName} />
      </View>
    </View>
  )
}

const ReduxAddressEditScreen = connect((state) => {
  return {
    master: state.master,
    avatar: state.avatar
  }
})(AddressEditScreen)

//export default AddressEditScreen
export default function (props) {
  const navigation = useNavigation()
  const route = useRoute()
  return <ReduxAddressEditScreen{...props} navigation={navigation} route={route} />
}