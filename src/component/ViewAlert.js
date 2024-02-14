import React from 'react'
import { View, Text } from 'react-native'
import { Modal } from '@ant-design/react-native'
import tw from '../lib/tailwind'

const ViewAlert = ({ visible, title, msg, onClose, onPress }) => {

  const footerButtons = [
    { text: '取消', onPress: onClose },
    { text: '确认', onPress: onPress },
  ]

  return (
    <Modal
      title={<Text style={tw`text-center text-xl text-neutral-900`}>{title || '提示'}</Text>}
      transparent
      onClose={onClose}
      visible={visible}
      footer={footerButtons}
      style={tw`bg-neutral-200 dark:bg-neutral-800`}
    >
      <View style={{ paddingVertical: 20 }}>
        <Text style={tw`text-left text-base text-neutral-900`}>{msg}</Text>
      </View>
    </Modal>
  )
}

export default ViewAlert