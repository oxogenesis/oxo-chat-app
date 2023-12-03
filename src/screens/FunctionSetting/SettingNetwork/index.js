import React, { useContext, useState } from 'react'
import { View, Text, TextInput, FlatList } from 'react-native'

import { connect } from 'react-redux'
import { actionType } from '../../../redux/actions/actionType'
import { ThemeContext } from '../../../theme/theme-context'
import AlertView from '../../FunctionBase/AlertView'

import { Button, WhiteSpace } from '@ant-design/react-native'
import ErrorMsg from '../../../component/ErrorMsg'
import tw from 'twrnc'

//网络设置
const SettingNetworkScreen = (props) => {
  const [host_input, setHost] = useState('')
  const [error_msg, setMsg] = useState('')
  const [visible, showModal] = useState(false)
  const [host1, setHostData] = useState()
  const { theme } = useContext(ThemeContext)

  const addHost = () => {
    let host_input1 = host_input.trim()
    let regx = /^ws[s]?:\/\/.+/
    let rs = regx.exec(host_input1)
    if (rs == null) {
      setMsg('地址格式无效...')
    } else {
      props.dispatch({
        type: actionType.avatar.addHost,
        host: host_input1
      })
      setHost('')
      setMsg('')
    }
  }

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
    <View>
      {
        !props.avatar.get('ConnStatus') &&
        <View style={tw.style(`bg-red-200 p-4`)}>
          <Text style={tw.style(`text-base text-center`)}>
            未连接服务器，请检查网络设置或连通性
          </Text>
        </View>
      }

      <WhiteSpace size='md' />
      <View style={{
        paddingLeft: 6,
        paddingRight: 6
      }}>
        <TextInput
          placeholder="ws://或者wss://"
          value={host_input}
          onChangeText={setHost}
          placeholderTextColor={tw.color('stone-500')}
          style={tw.style(`rounded-full border-solid border-2 border-gray-300 text-base text-center`)}
        />
        <WhiteSpace size='md' />
        {
          error_msg.length > 0 &&
          <ErrorMsg error_msg={error_msg} />
        }
        <Button style={tw.style(`rounded-full bg-green-500`)} onPress={addHost}>
          <Text style={tw.style(`text-xl text-slate-100`)}>设置</Text>
        </Button>
        <WhiteSpace size='md' />
        <FlatList
          data={props.avatar.get('HostList')}
          keyExtractor={item => item.Address}
          ListEmptyComponent={
            <Text style={{
              paddingLeft: 12,
              color: theme.text2,
              borderBottomWidth: 1,
              borderColor: theme.line,
              paddingBottom: 12,
            }}>
              暂未设置服务器地址...
            </Text>
          }
          renderItem={
            ({ item }) => {
              return (
                <View style={{
                  flexDirection: "row",
                  paddingTop: 5,
                  height: 55,
                  borderBottomWidth: 1,
                  borderColor: theme.line,
                  backgroundColor: theme.base_body,
                  paddingLeft: 6,
                  paddingRight: 6
                }} >
                  <View style={{
                    flex: 0.7,
                  }} >
                    <Text style={{
                      lineHeight: 55,
                      color: theme.text1,
                    }}>{item.Address}</Text>
                  </View>
                  {
                    item.Address == props.avatar.get('CurrentHost') ?
                      <View style={{ flex: 0.25 }} >
                        <Text style={{
                          lineHeight: 45,
                          color: 'green',
                          textAlign: 'right'
                        }}>
                          当前正在使用
                        </Text>
                      </View>
                      :
                      <>
                        <View style={{ flex: 0.20 }} >
                          <Button style={tw.style(`rounded-full bg-green-500 w-15`)} onPress={() => changeCurrentHost(item.Address)}>
                            <Text style={tw.style(`text-xs text-slate-100`)}>使用</Text>
                          </Button>
                        </View>
                        <View style={{ flex: 0.20 }} >
                          <Button style={tw.style(`rounded-full bg-red-500 w-15`)} onPress={() => delHostAlert(item.Address)}>
                            <Text style={tw.style(`text-xs text-slate-100`)}>删除</Text>
                          </Button>
                        </View>
                      </>
                  }
                </View>
              )
            }
          }
        >
        </FlatList >
      </View>
      <AlertView
        visible={visible}
        onClose={onClose}
        msg={`你确定要删除${host1}吗?`}
        onPress={() => delHost(host1)}
      />
    </View>
  )

}


const ReduxSettingNetworkScreen = connect((state) => {
  return {
    avatar: state.avatar
  }
})(SettingNetworkScreen)

export default ReduxSettingNetworkScreen