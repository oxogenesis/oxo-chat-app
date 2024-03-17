import React from 'react'
import { View, Text, Modal, TouchableOpacity } from 'react-native'
import tw from '../lib/tailwind'

const ViewModal = ({ visible, title = "提示", msg, onClose, onConfirm }) => {
  return (
    <Modal
      animationType="fade"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}>
      <View style={tw`h-full bg-transparent p-5px`}>
        <View style={tw`my-auto p-15px`}>
          <View style={tw`mx-25px bg-neutral-300 dark:bg-neutral-500 rounded-md border border-stone-700 dark:border-stone-300`}>
            <Text style={tw`mt-20px text-3xl text-center align-middle font-bold text-slate-700 dark:text-slate-200`}>
              {title}
            </Text>
            <Text style={tw`text-base m-10px align-middle text-slate-700 dark:text-slate-200`}>
              {msg}
            </Text>
            <View style={tw`mt-10px w-full flex flex-row`}>
              <View style={tw`basis-1/2`}>
                <TouchableOpacity style={tw`m-10px p-5px bg-gray-500 rounded-full px-2 border-2 border-gray-300 dark:border-gray-700`} onPress={onClose}>
                  <Text style={tw`text-base text-slate-800 text-center`}>
                    取消
                  </Text>
                </TouchableOpacity>
              </View>
              <View style={tw`basis-1/2`}>
                <TouchableOpacity style={tw`m-10px p-5px bg-blue-500 rounded-full px-2 border-2 border-gray-300 dark:border-gray-700`} onPress={onConfirm}>
                  <Text style={tw`text-base text-slate-800 text-center`}>
                    确定
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </View>
      </View>
    </Modal>
  )
}

export default ViewModal