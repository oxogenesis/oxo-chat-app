import * as React from 'react'
import { View, Text, Alert, Button } from 'react-native'
import { useNavigation, useRoute } from '@react-navigation/native'

import { connect } from 'react-redux'
import QRCode from 'react-native-qrcode-svg'

//地址标记
class AvatarSeedQrcodeScreen extends React.Component {
  constructor(props) {
    super(props)
    this.state = { qrcode: "xxx" }
  }

  viewSeedAlert() {
    Alert.alert(
      '提示',
      `查看种子，应回避具备视觉的生物或设备，应在私密可控环境下。
确定要查看种子吗？`,
      [
        { text: '确认', onPress: () => this.props.navigation.navigate('AvatarSeed') },
        { text: '取消', style: 'cancel' },
      ],
      { cancelable: false }
    )
  }

  componentDidMount() {
    this._unsubscribe = this.props.navigation.addListener('focus', () => {
      let json = { "Name": this.props.avatar.get('Name'), "Seed": this.props.avatar.get('Seed') }
      this.setState({ qrcode: JSON.stringify(json) })
    })
  }

  render() {
    return (
      <View>
        <View style={{ alignItems: 'center' }}>
          <QRCode
            value={this.state.qrcode}
            size={350}
            logo={require('../../assets/app.png')}
            logoSize={50}
            logoBackgroundColor='grey'
          />
        </View>
        <Text>{`注意：查看种子二维码，应回避具备视觉的生物或设备，应在私密可控环境下。`}</Text>
        <Button color="red" title="查看种子" onPress={() => { this.viewSeedAlert() }} />
      </View >
    )
  }
}

const ReduxAvatarSeedQrcodeScreen = connect((state) => {
  return {
    avatar: state.avatar
  }
})(AvatarSeedQrcodeScreen)

//export default AvatarSeedQrcodeScreen
export default function (props) {
  const navigation = useNavigation()
  const route = useRoute()
  return <ReduxAvatarSeedQrcodeScreen{...props} navigation={navigation} route={route} />
}