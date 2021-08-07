import * as React from 'react'
import { Text, TextInput, Button } from 'react-native'

import { connect } from 'react-redux'
import { actionType } from '../../redux/actions/actionType'

//登录界面
class AddressAddScreen extends React.Component {
  constructor(props) {
    super(props)
    this.state = { name: '', address: '', error_msg: '' }
  }

  addAddressMark() {
    let address = this.state.address.trim()
    let name = this.state.name.trim()
    if (address == '' || name == '') {
      this.setState({ error_msg: '地址或昵称不能为空...' })
      return
    } else if (address == this.props.avatar.get('Address')) {
      this.setState({ error_msg: '不能标记自己...' })
      return
    }
    this.props.dispatch({
      type: actionType.avatar.addAddressMark,
      address: address,
      name: name
    })
    this.props.navigation.navigate('TabAddressBook')
  }

  componentDidMount() {
    this._unsubscribe = this.props.navigation.addListener('focus', () => {
      if (this.props.route.params && this.props.route.params.address) {
        this.state.address = this.props.route.params.address
      }
    })
  }

  componentWillUnmount() {
    this._unsubscribe()
  }

  render() {
    return (
      <>
        <TextInput
          placeholder="地址"
          value={this.state.address}
          onChangeText={text => this.setState({ address: text })}
        />
        <TextInput
          placeholder="昵称"
          value={this.state.name}
          onChangeText={text => this.setState({ name: text })}
        />
        {
          this.state.error_msg.length > 0 &&
          <Text>{this.state.error_msg}</Text>
        }
        <Button
          title="标记"
          onPress={() => this.addAddressMark()}
        />
      </>
    )
  }
}

const ReduxAddressAddScreen = connect((state) => {
  return {
    avatar: state.avatar
  }
})(AddressAddScreen)

export default ReduxAddressAddScreen