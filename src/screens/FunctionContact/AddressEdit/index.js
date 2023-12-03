import React, { useContext, useState } from 'react'
import { View, Text, TextInput } from 'react-native'
import { useNavigation, useRoute } from '@react-navigation/native'
import { connect } from 'react-redux'
import { actionType } from '../../../redux/actions/actionType'
import { Button } from '@ant-design/react-native'
import { ThemeContext } from '../../../theme/theme-context'
import { AddressToName } from '../../../lib/Util'
import ErrorMsg from '../../../component/ErrorMsg'
import tw from 'twrnc'

//地址标记
const AddressEditScreen = (props) => {
  const [address, setAddress] = useState(props.route.params.address)
  const [name, setName] = useState(AddressToName(props.avatar.get('AddressMap'), props.route.params.address))
  const [error_msg, setMsg] = useState('')
  const { theme } = useContext(ThemeContext)

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
    <View style={tw`h-full bg-stone-200`}>
      <View style={tw.style(`my-auto`)}>
        <TextInput
          placeholderTextColor={tw.color('stone-500')}
          style={tw.style(`rounded-full border-solid border-2 border-gray-300 text-base text-center`)}
          placeholder="地址"
          value={address}
          editable={false}
          multiline={false}
          onChangeText={text => setAddress(text)}
        />
        <TextInput
          placeholderTextColor={tw.color('stone-500')}
          style={tw.style(`rounded-full border-solid border-2 border-gray-300 text-base text-center`)}
          placeholder="昵称"
          value={name}
          multiline={false}
          onChangeText={text => setName(text)}
        />
        {
          error_msg.length > 0 &&
          <ErrorMsg error_msg={error_msg} />
        }
        <Button style={tw.style(`rounded-full bg-green-500`)} onPress={saveAddressName}>
          <Text style={tw.style(`text-xl text-slate-100`)}>保存</Text>
        </Button>
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