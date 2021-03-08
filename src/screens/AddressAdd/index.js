import * as React from 'react'
import { Text, TextInput, Button } from 'react-native'

import { connect } from 'react-redux'
import { actionType } from '../../redux/actions/actionType';

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
      this.setState({ error_msg: 'address or name could not be blank...' })
      return
    }
    this.props.dispatch({
      type: actionType.avatar.addAddressMark,
      address: address,
      name: name
    })
    this.props.navigation.navigate('TabAddressBook')
  }

  render() {
    return (
      <>
        <TextInput
          placeholder="address"
          value={this.state.address}
          onChangeText={text => this.setState({ address: text })}
        />
        <TextInput
          placeholder="name"
          value={this.state.name}
          onChangeText={text => this.setState({ name: text })}
        />
        {
          this.state.error_msg.length > 0 &&
          <Text>{this.state.error_msg}</Text>
        }
        <Button
          title="Add"
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