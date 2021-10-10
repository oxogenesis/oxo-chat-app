import * as React from 'react'
import { Text, TextInput, Button } from 'react-native'

import { connect } from 'react-redux'
import { actionType } from '../../redux/actions/actionType'

//登录界面
class AddressAddFromQrcodeScreen extends React.Component {
  constructor(props) {
    super(props)
    this.state = { address: '', relay: '' }
  }

  // parseQrcode(text) {
  //   this.setState({ qrcode: text })
  //   let result = ParseQrcode(this.state.qrcode)
  //   console.log(result)
  //   if (result != false) {
  //     this.setState({ address: result.Address, relay: result.Relay, error_msg: '' })
  //   } else {
  //     this.setState({ address: '', relay: '', error_msg: 'invalid qrcode...' })
  //   }
  // }

  componentDidMount() {
    this._unsubscribe = this.props.navigation.addListener('focus', () => {
      if (this.props.route.params && this.props.route.params.qrcode) {
        this.setState({ address: this.props.route.params.qrcode.Address, relay: this.props.route.params.qrcode.Relay })
      } else {
        this.props.navigation.goBack()
        // this.setState({ qrcode: this.props.avatar.get('Qrcode') })
        // console.log(this.state.qrcode)
      }
    })
  }

  componentWillUnmount() {
    this._unsubscribe()
  }

  render() {
    return (
      <>
        <Text style={{ color: 'blue', fontWeight: 'bold' }}>
          {this.state.address}
        </Text>
        <Text style={{ color: 'blue', fontWeight: 'bold' }}>
          {this.state.relay}
        </Text>
        <Button
          title="标记地址"
          onPress={() => this.props.navigation.navigate('AddressAdd', { address: this.state.address })} />
      </>
    )
  }
}

const ReduxAddressAddFromQrcodeScreen = connect((state) => {
  return {
    avatar: state.avatar
  }
})(AddressAddFromQrcodeScreen)

export default ReduxAddressAddFromQrcodeScreen