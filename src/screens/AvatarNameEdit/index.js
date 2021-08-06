import * as React from 'react'
import { View, Text, Button, TextInput } from 'react-native'
import { useNavigation, useRoute } from '@react-navigation/native'

import { connect } from 'react-redux'
import { AvatarNameEdit } from '../../lib/OXO'
import { actionType } from '../../redux/actions/actionType'

//地址标记
class AvatarNameEditScreen extends React.Component {
  constructor(props) {
    super(props)
    this.state = { address: '', name: '', error_msg: '' }
  }

  saveName() {
    let name = this.state.name.trim()
    if (name == '') {
      this.setState({ error_msg: 'name could not be blank...' })
      return
    }
    AvatarNameEdit(this.state.name, this.props.avatar.get('Seed'), this.props.master.get('MasterKey'))
      .then(result => {
        if (result) {
          this.setState({ name: '', error_msg: '' })
          this.props.dispatch({
            type: actionType.avatar.setAvatarName,
            name: name
          })
          this.props.navigation.goBack()
        }
      })
  }

  loadState() {
    this.setState({
      address: this.props.avatar.get('Address'),
      name: this.props.avatar.get('Name')
    })
  }

  componentDidMount() {
    this._unsubscribe = this.props.navigation.addListener('focus', () => {
      this.loadState()
    });
  }

  componentWillUnmount() {
    this._unsubscribe();
  }

  render() {
    return (
      <View>
        <Text>地址: {this.state.address}</Text>
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
          onPress={() => this.saveName()}
        />
      </View>
    )
  }
}

const ReduxAvatarNameEditScreen = connect((state) => {
  return {
    master: state.master,
    avatar: state.avatar
  }
})(AvatarNameEditScreen)

//export default AvatarNameEditScreen
export default function (props) {
  const navigation = useNavigation()
  const route = useRoute()
  return <ReduxAvatarNameEditScreen{...props} navigation={navigation} route={route} />
}