import React, { useState, useEffect } from 'react'
import { View, Text, ScrollView, TouchableOpacity, ActivityIndicator } from 'react-native'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { AvatarDerive } from '../../../lib/OXO'
import { connect } from 'react-redux'
import { actionType } from '../../../redux/actions/actionType'
import ViewEmpty from '../../../component/ViewEmpty'
import { useNavigation, useRoute } from '@react-navigation/native'
import AvatarImage from '../../../component/AvatarImage'
import ButtonPrimary from '../../../component/ButtonPrimary'
import LoadingView from '../../../component/LoadingView'
import TextTimestamp from '../../../component/TextTimestamp'
import TextName from '../../../component/TextName'
import TextAddress from '../../../component/TextAddress'
import tw from '../../../lib/tailwind'

//账号选择界面
const AvatarListScreen = props => {
  const [avatarList, setList] = useState([])
  const [flagLoading, setFlagLoading] = useState(false)

  const loadAvatarList = () => {
    try {
      AsyncStorage.getItem('<#Avatars#>').then(result => {
        if (result != null) {
          let list = JSON.parse(result)
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
    if (props.avatar.get('Database') != null) {
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
    <View style={tw`h-full bg-neutral-200 dark:bg-neutral-800 p-5px`}>
      {
        flagLoading == false ?
          <View style={tw`h-full`}>
            {
              avatarList.length > 0 ?
                <ScrollView
                  style={tw`mb-50px`}
                  automaticallyAdjustContentInsets={false}
                  showsHorizontalScrollIndicator={false}
                  showsVerticalScrollIndicator={false}>
                  {
                    avatarList.map((item, index) => (
                      <TouchableOpacity key={index} onPress={() => enableAvatar(item.Address, item.Name)}>
                        <View style={tw`flex flex-row bg-stone-100 dark:bg-stone-500 p-5px mb-1px`}>
                          <View>
                            <AvatarImage address={item.Address} />
                          </View>
                          <View>
                            <Text>
                              <TextName name={item.Name} />
                              <TextTimestamp timestamp={item.LoginAt} />
                            </Text>
                            <TextAddress address={item.Address} />
                          </View>
                        </View>
                      </TouchableOpacity>
                    ))
                  }
                </ScrollView>
                :
                <ViewEmpty msg={`暂无账号...`} />
            }
            <View style={tw`w-full px-25px absolute bottom-0 z-99`}>
              <ButtonPrimary title={'安全退出'} onPress={lock} bg={'bg-red-500'} />
            </View>
          </View>
          :
          <LoadingView />
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