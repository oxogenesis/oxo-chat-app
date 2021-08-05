import * as React from 'react'
import { Text, Button, TextInput } from 'react-native'

import { AvatarCreateNew } from '../../lib/OXO'

import { connect } from 'react-redux'

//口令创建账户
class AvatarCreateScreen extends React.Component {
  constructor(props) {
    super(props)
    this.state = { name: '', error_msg: '' }
  }

  createAvatar() {
    if (this.state.name.trim() == '') {
      this.setState({ error_msg: 'name could not be blank...' })
      return
    }
    AvatarCreateNew(this.state.name, this.props.master.get('MasterKey'))
      .then(result => {
        if (result) {
          this.setState({ name: '', error_msg: '' })
          this.props.navigation.navigate('AvatarList')
        }
      })
  }
  render() {
    return (
      <>
        <TextInput
          placeholder="name"
          value={this.state.name}
          onChangeText={text => this.setState({ name: text })}
        />
        {
          this.state.error_msg.length > 0 &&
          <Text>{this.state.error_msg}</Text>
        }
        <Button title="Create" onPress={() => this.createAvatar()}
        />
        <Button title="Cancel" onPress={() => this.props.navigation.navigate('AvatarList')} />
      </>
    )
  }
}

const ReduxAvatarCreateScreen = connect((state) => {
  return {
    master: state.master
  }
})(AvatarCreateScreen)

export default ReduxAvatarCreateScreen