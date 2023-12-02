import React, { useContext, useState } from 'react'
import { View, Text, TouchableOpacity } from 'react-native'
import { connect } from 'react-redux'
import { actionType } from '../../../redux/actions/actionType'
import { AvatarRemove } from '../../../lib/OXO'
import { Toast, Button } from '@ant-design/react-native'
import { ThemeContext } from '../../../theme/theme-context'
import Clipboard from '@react-native-clipboard/clipboard'
import AlertView from '../../FunctionBase/AlertView'
import { styles } from '../../../theme/style'
import tw from 'twrnc'

//地址标记
const AvatarSeedScreen = (props) => {

  const alert_remove_account = `！！！种子是账号的唯一凭证，只存储在本地，服务器不提供找回功能！！！
  ！！！移除账号前，请务必备份种子！！！
  确定要移除账号吗？`
  const [seed, setSeed] = useState(props.avatar.get('Seed'))
  const [visible, showCopySeed] = useState(false)
  const { theme } = useContext(ThemeContext)
  const [visible_remove_account, showRemoveAvatar] = useState(false)

  const copyToClipboard = () => {
    Toast.success('拷贝成功！', 1)
    Clipboard.setString(seed)
  }

  const copySeedAlert = () => {
    showCopySeed(true)
  }

  const viewRemoveAvatar = () => {
    showRemoveAvatar(true)
  }

  const onClose = () => {
    showCopySeed(false)
    showRemoveAvatar(false)
  }
  const removeAvatar = () => {
    AvatarRemove(props.avatar.get('Address'))
      .then((result) => {
        if (result) {
          props.dispatch({
            type: actionType.avatar.disableAvatar
          })
          props.navigation.reset({
            index: 0,
            routes: [{ name: 'AvatarList' }],
          });
        }
      })
  }

  return (
    <View style={{
      backgroundColor: theme.base_view,
      height: '100%'
    }}>
      <TouchableOpacity onPress={() => { copySeedAlert() }}>
        <Text style={{ color: 'red', fontWeight: 'bold' }}>
          {props.avatar.get('Seed')}
        </Text>
      </TouchableOpacity>
      <Text style={{
        color: theme.text2
      }}>{`注意：查看种子，应回避具备视觉的生物或设备，应在私密可控环境下。`}</Text>

      <View style={styles.base_view_a}>
        <Button style={tw.style(`rounded-full bg-red-500`)} onPress={() => viewRemoveAvatar()}>
          <Text style={tw.style(`text-xl text-slate-100`)}>删除账号</Text>
        </Button>
      </View>
      <AlertView
        visible={visible}
        onClose={onClose}
        msg='确定要复制种子吗？'
        onPress={copyToClipboard}
      />
      <AlertView
        visible={visible_remove_account}
        onClose={onClose}
        msg={alert_remove_account}
        onPress={() => removeAvatar()}
      />
    </View>
  )
}

const ReduxAvatarSeedScreen = connect((state) => {
  return {
    avatar: state.avatar
  }
})(AvatarSeedScreen)

export default ReduxAvatarSeedScreen