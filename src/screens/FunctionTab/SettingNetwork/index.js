import React, { useState } from 'react'
import { View, Text, FlatList, TouchableOpacity } from 'react-native'
import { connect } from 'react-redux'
import { actionType } from '../../../redux/actions/actionType'
import ViewModal from '../../../component/ViewModal'
import ViewEmpty from '../../../component/ViewEmpty'
import tw from '../../../lib/tailwind'

//网络设置
const SettingNetworkScreen = (props) => {
  const [visible, showModal] = useState(false)
  const [host1, setHostData] = useState()

  const changeCurrentHost = (host) => {
    props.dispatch({
      type: actionType.avatar.changeCurrentHost,
      host: host
    })
  }

  const delHostAlert = (host) => {
    showModal(true)
    setHostData(host)
  }

  const delHost = (host) => {
    props.dispatch({
      type: actionType.avatar.delHost,
      host: host
    })
  }

  const onClose = () => {
    showModal(false)
  }

  return (
    <View style={tw`h-full bg-neutral-200 dark:bg-neutral-800 p-5px`}>
      {
        !props.avatar.get('ConnStatus') &&
        <View style={tw`bg-red-200 p-4`}>
          <Text style={tw`text-base text-center`}>
            未连接服务器，请检查网络设置或连通性
          </Text>
        </View>
      }
      <View style={{
        paddingLeft: 6,
        paddingRight: 6
      }}>
        <FlatList
          data={props.avatar.get('HostList')}
          keyExtractor={item => item.Address}
          ListEmptyComponent={
            <ViewEmpty msg='暂未设置服务器地址...' />
          }
          renderItem={
            ({ item }) => {
              return (
                <View style={tw`bg-neutral-100 dark:bg-neutral-600 rounded-lg px-1 border-2 border-gray-300 dark:border-gray-700 flex flex-row justify-between py-5px px-15px`}>
                  <View style={tw`basis-3/5`} >
                    <Text style={tw`text-left text-base text-neutral-900`}>
                      {item.Address}
                    </Text>
                  </View>
                  {
                    item.Address == props.avatar.get('CurrentHost') ?
                      <View style={tw``} >
                        <Text style={tw`text-right text-base text-green-700 h-30px`}>
                          当前正在使用
                        </Text>
                      </View>
                      :
                      <>
                        <TouchableOpacity style={tw`rounded-full border border-stone-700 dark:border-stone-300 bg-green-500 h-30px`} onPress={() => changeCurrentHost(item.Address)}>
                          <Text style={tw`px-10px text-sm text-slate-100 text-center align-middle font-bold`}>
                            使用
                          </Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={tw`rounded-full border border-stone-300 bg-red-500 h-30px`} onPress={() => delHostAlert(item.Address)}>
                          <Text style={tw`px-10px text-sm text-slate-100 text-center align-middle font-bold`}>
                            删除
                          </Text>
                        </TouchableOpacity>
                      </>
                  }
                </View>
              )
            }
          }
        >
        </FlatList >
      </View>
      <ViewModal
        visible={visible}
        onClose={onClose}
        msg={`你确定要删除${host1}吗?`}
        onConfirm={() => {
          showModal(false)
          delHost(host1)
        }}
      />
    </View >
  )
}


const ReduxSettingNetworkScreen = connect((state) => {
  return {
    avatar: state.avatar
  }
})(SettingNetworkScreen)

export default ReduxSettingNetworkScreen