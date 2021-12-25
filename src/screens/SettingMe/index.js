import React, { useContext, useState } from 'react';
import { View, Alert, Appearance } from 'react-native'
import QRCode from 'react-native-qrcode-svg'
import { connect } from 'react-redux'
import { actionType } from '../../redux/actions/actionType'
import Clipboard from '@react-native-clipboard/clipboard'
import { Icon, Toast } from '@ant-design/react-native';
import { List, WhiteSpace } from '@ant-design/react-native';
import { ThemeContext } from '../../theme/theme-context';
import BaseList from '../BaseList'
import AlertView from '../AlertView'

//设置
const Item = List.Item;
const Brief = Item.Brief;

const SettingMeScreen = (props) => {

  const [address, setAddress] = useState(props.avatar.get('Address'))
  const [name, setName] = useState(props.avatar.get('Name'))
  const [visible, showModal] = useState(false)
  const { theme } = useContext(ThemeContext);

  const json = {
    "Relay": props.avatar.get('CurrentHost'),
    "PublicKey": props.avatar.get('PublicKey')
  }
  const [qrcode, setQrcode] = useState(JSON.stringify(json))

  const copyToClipboard = () => {
    Toast.success('拷贝成功！', 1);
    Clipboard.setString(address)
  }

  

  const viewSeedQrcodeAlert = () => {
    showModal(true)
//     Alert.alert(
//       '提示',
//       `确保在私密环境下，通过可信设备扫描种子二维码，迁移种子。
// 确定要查看种子二维码吗？`,
//       [
//         { text: '确认', onPress: () => props.navigation.navigate('AvatarSeedQrcode') },
//         { text: '取消', style: 'cancel' },
//       ],
//       { cancelable: false }
//     )
  }

  const loadFromDB = () => {
    props.dispatch({
      type: actionType.avatar.loadFromDB
    })
  }

  const onClose = () => {
    showModal(false)
  }

  return (
    <View style={{
      backgroundColor: theme.base_view,
      height: '100%'
    }}>
      <View style={{ alignItems: 'center', backgroundColor: theme.base_body, padding: 24, marginTop: 12 }}>
        <QRCode
          value={qrcode}
          size={350}
          logo={require('../../assets/app.png')}
          logoSize={50}
          backgroundColor={theme.QR_code_view}
          color={theme.QR_code_text}
          logoBackgroundColor='grey'
        />
      </View>
      <WhiteSpace size='lg' />
      <BaseList data={[
        { title: address, icon: 'block', onpress: copyToClipboard },
        { title: name, onpress: () => { props.navigation.navigate('AvatarNameEdit') } },
        { title: '应用异常退出，导致数据显示：重载', onpress: loadFromDB },
        { title: '查看种子二维码', onpress: viewSeedQrcodeAlert },
      ]} />
      <AlertView
        visible={visible}
        onClose={onClose}
        msg='确保在私密环境下，通过可信设备扫描种子二维码，迁移种子。
        确定要查看种子二维码？'
        onPress={() => props.navigation.navigate('AvatarSeedQrcode')}
      />
    </View >
  )
}

const ReduxSettingMeScreen = connect((state) => {
  return {
    avatar: state.avatar
  }
})(SettingMeScreen)

export default ReduxSettingMeScreen