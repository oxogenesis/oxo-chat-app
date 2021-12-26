import * as React from 'react'
import { Text } from 'react-native'
import { connect } from 'react-redux'
import { actionType } from '../../redux/actions/actionType'
import { WhiteSpace, Button } from '@ant-design/react-native'

//登录界面
class AddressAddFromQrcodeScreen extends React.Component {
  constructor(props) {
    super(props)
    this.state = { address: '', relay: '' }
  }

  addHost() {
    let host = this.state.relay
    let regx = /^ws[s]?:\/\/.+/
    let rs = regx.exec(host)
    if (rs != null) {
      this.props.dispatch({
        type: actionType.avatar.addHost,
        host: host
      })
    }
    this.props.navigation.navigate('AddressAdd', { address: this.state.address })
  }

  componentDidMount() {
    this._unsubscribe = this.props.navigation.addListener('focus', () => {
      if (this.props.route.params && this.props.route.params.qrcode) {
        this.setState({ address: this.props.route.params.qrcode.Address, relay: this.props.route.params.qrcode.Relay })
      } else {
        this.props.navigation.goBack()
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
        <WhiteSpace size='lg' />
        <Text style={{ color: 'blue', fontWeight: 'bold' }}>
          {this.state.relay}
        </Text>
        <WhiteSpace size='lg' />
        <Button
          style={{
            height: 55
          }}
          onPress={() => this.props.navigation.navigate('AddressAdd', { address: this.state.address })}>标记地址</Button>
        <WhiteSpace size='lg' />
        <Button
          style={{
            height: 55
          }}
          onPress={() => this.addHost()} >保持服务器网址+标记地址</Button>
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