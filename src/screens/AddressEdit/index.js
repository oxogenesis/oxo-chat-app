import * as React from 'react'
import { View, Text, Button, TextInput } from 'react-native'
import { useNavigation, useRoute } from '@react-navigation/native'

import { connect } from 'react-redux'
import { actionType } from '../../redux/actions/actionType'
import { timestamp_format, AddressToName } from '../../lib/Util'

//地址标记
class AddressEditScreen extends React.Component {
  constructor(props) {
    super(props)
    this.state = { address: '', name: '', error_msg: '' }
  }

  saveAddressName() {
    let address = this.state.address
    let name = this.state.name.trim()
    if (name == '' || address == name) {
      this.setState({ error_msg: '昵称不能为空，且昵称不能与地址相同......' })
      return
    }
    this.props.dispatch({
      type: actionType.avatar.saveAddressName,
      address: address,
      name: name
    })
    this.props.navigation.goBack()
  }

  loadAddressMark() {
    this.setState({
      address: this.props.route.params.address,
      name: AddressToName(this.props.avatar.get('AddressMap'), this.props.route.params.address)
    })
  }

  componentDidMount() {
    this._unsubscribe = this.props.navigation.addListener('focus', () => {
      this.loadAddressMark()
    })
  }

  componentWillUnmount() {
    this._unsubscribe()
  }

  render() {
    return (
      <View>
        <Text>address: {this.state.address}</Text>
        <TextInput
          placeholder="昵称"
          value={this.state.name}
          multiline={false}
          onChangeText={text => this.setState({ name: text })}
        />
        {
          this.state.error_msg.length > 0 &&
          <Text>{this.state.error_msg}</Text>
        }
        <Button
          title="保存"
          onPress={() => this.saveAddressName()}
        />
      </View>
    )
  }
}

const ReduxAddressEditScreen = connect((state) => {
  return {
    avatar: state.avatar
  }
})(AddressEditScreen)

//export default AddressEditScreen
export default function (props) {
  const navigation = useNavigation()
  const route = useRoute()
  return <ReduxAddressEditScreen{...props} navigation={navigation} route={route} />
}