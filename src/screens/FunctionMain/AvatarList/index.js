import React, { useContext, useState, useEffect } from 'react'
import { Button, WhiteSpace, Flex } from '@ant-design/react-native'
import { View, Text, ScrollView, TouchableOpacity, ActivityIndicator } from 'react-native'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { AvatarDerive } from '../../../lib/OXO'
// import { AvatarDerive, AvatarLoginTimeReset } from '../../../lib/OXO'
import { connect } from 'react-redux'
import { actionType } from '../../../redux/actions/actionType'
import EmptyView from '../../FunctionBase/EmptyView'
import { ThemeContext } from '../../../theme/theme-context'
import { useNavigation, useRoute } from '@react-navigation/native'
import AvatarImage from '../../../component/AvatarImage'
import { timestamp_format } from '../../../lib/Util'
import tw from 'twrnc'

//账号选择界面
const AvatarListScreen = props => {
  const { theme } = useContext(ThemeContext)
  const [avatarList, setList] = useState([])
  const [flagLoading, setFlagLoading] = useState(false)

  const loadAvatarList = () => {
    try {
      AsyncStorage.getItem('<#Avatars#>').then(result => {
        if (result != null) {
          let list = JSON.parse(result)
          // let timestamp = Date.now()
          // if (list.length > 0 && list[0].LoginAt == null) {
          //   for (let i = 0; i < list.length; i++) {
          //     list[i].LoginAt = timestamp;
          //   }
          //   AvatarLoginTimeReset(timestamp)
          //     .then(result => {
          //       if (result) {
          //         console.log(`AvatarLoginTimeReset`
          //       }
          //     })
          // }
          setList(list)
        }
      })
    } catch (e) {
      console.log(e)
    }
  }

  useEffect(() => {
    return props.navigation.addListener('focus', () => {
      loadAvatarList()
    })
  })

  // useEffect(() => {
  //   console.log('>>>>>>>>>useEffect flagLoading is: ', props.flagLoading);
  // }, [props.flagLoading])

  // useEffect(() => {
  //   console.log('>>>>>>>>>useEffect master is: ', props.master);
  // }, [props.master])

  useEffect(() => {
    if (props.avatar.get('Database') != null && props.avatar.get('Database') != null) {
      props.navigation.replace('TabHome')
    }
  }, [props.avatar])

  const enableAvatar = (address, name) => {
    setFlagLoading(true)
    let avatar = avatarList.filter(item => item.Address == address)[0]
    AvatarDerive(avatar.save, props.master.get('MasterKey'))
      .then(result => {
        if (result) {
          props.dispatch({
            type: actionType.avatar.enableAvatar,
            seed: result,
            name: name
          })
        } else {
          setFlagLoading(false)
        }
      })
  }

  const lock = () => {
    props.dispatch({
      type: actionType.master.setMasterKey,
      MasterKey: null
    })
    props.navigation.replace('Unlock')
  }

  return (
    <View>
      {
        flagLoading == false ?
          <View style={tw`h-full bg-stone-200 p-5px`}>
            <ScrollView
              style={tw`mb-60px`}
              // style={styles.scroll_view}
              automaticallyAdjustContentInsets={false}
              showsHorizontalScrollIndicator={false}
              showsVerticalScrollIndicator={false}>
              {
                avatarList.length > 0 ?
                  avatarList.map((item, index) => (
                    <TouchableOpacity key={index} onPress={() => enableAvatar(item.Address, item.Name)}>
                      <View style={tw`bg-stone-100`}>
                        <Flex>
                          <Flex.Item style={{ flex: 0.15 }}>
                            <AvatarImage address={item.Address} />
                          </Flex.Item>
                          <Flex.Item >
                            <Text>
                              <View style={tw`bg-indigo-500 rounded-full px-2 border-2 border-gray-300`}>
                                <Text style={tw`text-base text-slate-800 text-center`}>
                                  {`${item.Name}`}
                                </Text>
                              </View>
                              <View style={tw`rounded-full px-1`}>
                                <Text style={tw`text-base text-slate-400`}>{timestamp_format(item.LoginAt)}</Text>
                              </View>
                            </Text>
                            <Text style={tw`text-sm text-slate-400`}>{item.Address}</Text>
                          </Flex.Item>
                        </Flex>
                      </View>
                    </TouchableOpacity>
                  ))
                  :
                  <EmptyView pTop={1} />
              }
              <WhiteSpace size='lg' />
            </ScrollView>

            <View style={tw`w-full absolute bottom-0 z-99`}>
            {/* <View style={styles.base_view_a}> */}
              <Button style={tw`rounded-full bg-red-500`} onPress={() => lock()}>
                <Text style={tw`text-xl text-slate-100`}>安全退出</Text>
              </Button>
            </View>
          </View>
          :
          <ActivityIndicator size="large" color={tw.color('blue-500')} />
      }
    </View>

  )
}

const ReduxAvatarListScreen = connect((state) => {
  return {
    master: state.master,
    avatar: state.avatar
  }
})(AvatarListScreen)

export default function (props) {
  const navigation = useNavigation()
  const route = useRoute()
  return <ReduxAvatarListScreen{...props} navigation={navigation} route={route} />
}