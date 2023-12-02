import React, { useContext, useState } from 'react'
import { View, Text, TextInput } from 'react-native'
import { useNavigation, useRoute } from '@react-navigation/native'
import { connect } from 'react-redux'
import { actionType } from '../../../redux/actions/actionType'
import { WhiteSpace, Button } from '@ant-design/react-native'
import { styles } from '../../../theme/style'
import { ThemeContext } from '../../../theme/theme-context'
import { AddressToName } from '../../../lib/Util'
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
    <View style={{
      ...styles.base_view,
      backgroundColor: theme.base_body
    }}>
      <Text style={{
        color: theme.text1
      }}>地址：</Text>
      <TextInput
        placeholderTextColor={tw.color('stone-500')}
        style={{
          ...styles.input_view,
          color: theme.text1
        }}
        placeholder="地址"
        value={address}
        editable={false}
        multiline={false}
        onChangeText={text => setAddress(text)}
      />
      <Text style={{
        color: theme.text1
      }}>昵称：</Text>
      <TextInput
        placeholderTextColor={tw.color('stone-500')}
        style={{
          ...styles.input_view,
          color: theme.text1
        }}
        placeholder="昵称"
        value={name}
        multiline={false}
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
      <Button style={tw.style(`rounded-full bg-green-500`)} onPress={saveAddressName}>
        <Text style={tw.style(`text-xl text-slate-100`)}>保存</Text>
      </Button>
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