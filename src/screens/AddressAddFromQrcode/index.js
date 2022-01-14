import React, { useContext, useState } from 'react'
import { Text } from 'react-native'
import { connect } from 'react-redux'
import { actionType } from '../../redux/actions/actionType'
import { Button, WhiteSpace } from '@ant-design/react-native'
import { ThemeContext } from '../../theme/theme-context'

//登录界面
const AddressAddFromQrcodeScreen = (props) => {
  const { theme } = useContext(ThemeContext)
  const [address, setAddress] = useState('')
  const [relay, setRelay] = useState('')


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
    props.navigation.navigate('AddressAdd', { address: address })
  }

  useEffect(() => {
    props.navigation.addListener('focus', () => {
      if (props.route.params && props.route.params.qrcode) {
        setAddress(props.route.params.qrcode.Address)
        setRelay(props.route.params.qrcode.Relay)
      } else {
        props.navigation.goBack()
      }
    })
    return () => {
    }
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
      <Button type='primary' style={{ height: 55 }}
        onPress={props.navigation.navigate('AddressAdd', { address: address })}>标记地址</Button>
      <WhiteSpace size='md' />
      <Button type='primary' style={{ height: 55 }}
        onPress={addHost}>保存服务器网址+标记地址</Button>
    </View>
  )
}

const ReduxAddressAddFromQrcodeScreen = connect((state) => {
  return {
    avatar: state.avatar
  }
})(AddressAddFromQrcodeScreen)

export default ReduxAddressAddFromQrcodeScreen