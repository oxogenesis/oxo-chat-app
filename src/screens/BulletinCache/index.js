import * as React from 'react'
import { View, Text, TextInput, Button } from 'react-native'

import { connect } from 'react-redux'
import { actionType } from '../../redux/actions/actionType'

//登录界面
class BulletinCacheScreen extends React.Component {
  constructor(props) {
    super(props)
    this.state = { cache_size: '', error_msg: '' }
  }

  setBulletinCacheSize() {
    let cache_size = parseInt(this.state.cache_size)
    if (cache_size == NaN || cache_size < 0) {
      this.setState({ error_msg: '公告缓存数量不能小于0...' })
    } else {
      this.props.dispatch({
        type: actionType.avatar.setBulletinCacheSize,
        cache_size: cache_size
      })
      this.setState({ cache_size: '', error_msg: '' })
      this.props.navigation.goBack()
    }
  }

  componentDidMount() {
    this._unsubscribe = this.props.navigation.addListener('focus', () => {
      this.setState({ cache_size: `${this.props.avatar.get('Setting').BulletinCacheSize}` })
    })
  }

  componentWillUnmount() {
    this._unsubscribe()
  }

  render() {
    return (
      <>
        <TextInput
          placeholder={`公告缓存数量:${this.props.avatar.get('Setting').BulletinCacheSize}`}
          value={this.state.cache_size}
          onChangeText={text => this.setState({ cache_size: text })}
        />
        {
          this.state.error_msg.length > 0 &&
          <Text>{this.state.error_msg}</Text>
        }
        <Button title="设置" onPress={() => this.setBulletinCacheSize()} />
        <Text>{`说明：
1、关注账户的公告、收藏的公告均不是缓存公告。
2、公告缓存数量设置为0时，应用不会自动删除缓存公告。`}
        </Text>
      </>
    )
  }
}

const ReduxBulletinCacheScreen = connect((state) => {
  return {
    avatar: state.avatar
  }
})(BulletinCacheScreen)

export default ReduxBulletinCacheScreen