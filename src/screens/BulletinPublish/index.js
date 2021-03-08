import * as React from 'react'
import { Text, TextInput, Button, FlatList, View } from 'react-native'

import { connect } from 'react-redux'
import { actionType } from '../../redux/actions/actionType';
import { AddressToName } from '../../lib/Util'

//登录界面
class BulletinPublishScreen extends React.Component {
  constructor(props) {
    super(props)
    this.state = { content: '', error_msg: '' }
  }

  publishBulletin() {
    let content = this.state.content.trim()
    if (content == '') {
      this.setState({ error_msg: 'content could not be blank...' })
      return
    }
    this.props.dispatch({
      type: actionType.avatar.PublishBulletin,
      content: content
    })
    this.setState({ content: '', error_msg: '' })
    this.props.navigation.push('BulletinList', { address: this.props.avatar.get('Address') })
  }

  render() {
    return (
      <>
        <TextInput
          placeholder="content"
          value={this.state.content}
          multiline={true}
          onChangeText={text => this.setState({ content: text })}
        />
        {
          this.state.error_msg.length > 0 &&
          <Text>{this.state.error_msg}</Text>
        }
        <Button
          title="Publish"
          onPress={() => this.publishBulletin()}
        />
        <FlatList
          data={this.props.avatar.get('QuoteList')}
          keyExtractor={item => item.Hash}
          renderItem={
            ({ item }) => {
              return (
                <View>
                  <Text onPress={() => this.props.navigation.push('Bulletin', { hash: item.Hash })}>
                    {`【${AddressToName(this.props.avatar.get('AddressMap'), item.Address)}#${item.Sequence}】`}
                  </Text>
                  <Text onPress={() => this.props.dispatch({
                    type: actionType.avatar.delQuote,
                    hash: item.Hash
                  })}>
                    X
                  </Text>
                </View>)
            }
          }
        >
        </FlatList>
      </>
    )
  }
}

const ReduxBulletinPublishScreen = connect((state) => {
  return {
    avatar: state.avatar
  }
})(BulletinPublishScreen)

export default ReduxBulletinPublishScreen