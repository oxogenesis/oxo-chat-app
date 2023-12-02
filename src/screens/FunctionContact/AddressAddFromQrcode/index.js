import React, { useContext, useState, useEffect } from 'react'
import { View, Text } from 'react-native'
import { connect } from 'react-redux'
import { actionType } from '../../../redux/actions/actionType'
import { Button, WhiteSpace } from '@ant-design/react-native'
import { styles } from '../../../theme/style'
import { ThemeContext } from '../../../theme/theme-context'
import tw from 'twrnc'

//登录界面
const AddressAddFromQrcodeScreen = (props) => {
  const [address, setAddress] = useState('')
  const [relay, setRelay] = useState('')
  const { theme } = useContext(ThemeContext)

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
    <View style={{
      ...styles.base_view,
      backgroundColor: theme.base_view,
      padding: 0,
    }}>
      <View style={{
        flexDirection: "row",
        paddingTop: 5,
        height: 55,
        borderBottomWidth: 1,
        borderColor: theme.line,
        backgroundColor: theme.base_body,
        paddingLeft: 6,
        paddingRight: 6
      }} >
        <View style={{
          flex: 0.7,
        }} >
          <Text style={{
            lineHeight: 55,
            color: theme.text1,
          }}>
            {address}
          </Text>
        </View>
      </View>

      <View style={{
        flexDirection: "row",
        paddingTop: 5,
        height: 55,
        borderBottomWidth: 1,
        borderColor: theme.line,
        backgroundColor: theme.base_body,
        paddingLeft: 6,
        paddingRight: 6
      }} >
        <View style={{
          flex: 0.7,
        }} >
          <Text style={{
            lineHeight: 55,
            color: theme.text1,
          }}>
            {relay}
          </Text>
        </View>
      </View>

      <WhiteSpace size='md' />
      <Button style={tw.style(`rounded-full bg-green-500`)} onPress={markAddress}>
        <Text style={tw.style(`text-xl text-slate-100`)}>标记地址</Text>
      </Button>
      <Button style={tw.style(`rounded-full bg-green-500`)} onPress={addHost}>
        <Text style={tw.style(`text-xl text-slate-100`)}>标记地址 + 保存服务器网址</Text>
      </Button>
    </View>
  )
}

const ReduxAddressAddFromQrcodeScreen = connect((state) => {
  return {
    avatar: state.avatar
  }
})(AddressAddFromQrcodeScreen)

export default ReduxAddressAddFromQrcodeScreen