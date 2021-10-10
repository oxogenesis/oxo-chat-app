import * as React from 'react'
import { View, Text, TouchableOpacity, Alert } from 'react-native'
import { useNavigation, useRoute } from '@react-navigation/native'

import { connect } from 'react-redux'
import QRCode from 'react-native-qrcode-svg'
import Clipboard from '@react-native-clipboard/clipboard'

//地址标记
class AvatarSeedScreen extends React.Component {
  constructor(props) {
    super(props)
  }

  copyToClipboard() {
    Clipboard.setString(this.props.avatar.get('Seed'))
  }

  copySeedAlert() {
    Alert.alert(
      '提示',
      `确定要复制种子吗？`,
      [
        { text: '确认', onPress: () => this.copyToClipboard() },
        { text: '取消', style: 'cancel' },
      ],
      { cancelable: false }
    )
  }

  render() {
    return (
      <View>
        <TouchableOpacity onPress={() => { this.copySeedAlert() }}>
          <Text style={{ color: 'red', fontWeight: 'bold' }}>
            {this.props.avatar.get('Seed')}
          </Text>
        </TouchableOpacity>
        <View style={{ alignItems: 'center' }}>
          <QRCode
            value={this.props.avatar.get('Qrcode')}
            size={350}
            logo={require('../../assets/app.png')}
            logoSize={50}
            logoBackgroundColor='grey'
          />
        </View>
        <Text>{`注意：查看种子，应回避具备视觉的生物或设备，应在私密可控环境下。`}</Text>
      </View >
    )
  }
}

const ReduxAvatarSeedScreen = connect((state) => {
  return {
    avatar: state.avatar
  }
})(AvatarSeedScreen)

//export default AvatarSeedScreen
export default function (props) {
  const navigation = useNavigation()
  const route = useRoute()
  return <ReduxAvatarSeedScreen{...props} navigation={navigation} route={route} />
}