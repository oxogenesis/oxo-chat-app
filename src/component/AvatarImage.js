import React, { useState, useEffect } from 'react'
import { useNavigation, useRoute } from '@react-navigation/native'
import { connect } from 'react-redux'
import { View, Image, Text } from 'react-native'
// import { Dirs, FileSystem } from 'react-native-file-access'
import tw from '../lib/tailwind'

const AvatarImage = (props) => {

  const [avatarImg, setAvatarImg] = useState(null)

  // const loadImg = async () => {
  //   let avatar_img_dir = `${Dirs.DocumentDir}/AvatarImg`
  //   let avatar_img_path = `${avatar_img_dir}/${props.address}`
  //   let result = await FileSystem.exists(avatar_img_path)
  //   if (result) {
  //     result = await FileSystem.readFile(avatar_img_path, 'utf8')
  //     setAvatarImg(result)
  //   }
  // }

  useEffect(() => {
    return props.navigation.addListener('focus', () => {
      let avatar_image = props.master.get("AvatarImage")
      if (avatar_image[props.address]) {
        setAvatarImg(avatar_image[props.address])
      }
    })
  })


  return (
    <View>
      {
        avatarImg != null ?
          <Image
            style={tw`h-50px w-50px border-2 border-gray-300 dark:border-gray-700`}
            source={{ uri: avatarImg }}
            resizeMode='stretch'>
          </Image>
          :
          <Image
            style={tw`h-50px w-50px border-2 border-gray-300 dark:border-gray-700`}
            defaultSource={require('../assets/defult_avatar.png')}
            source={require('../assets/defult_avatar.png')}
            // source={{ uri: `https://www.gravatar.com/avatar/${props.address}?s=${50}&d=retro&r=g` }}
            resizeMode='stretch'>
          </Image>
      }
      {
        props.count &&
        <Text style={tw`absolute top-0 right-0 bg-red-500 rounded-full text-slate-200 p-2px text-xs`}>
          {props.count}
        </Text>
      }
    </View>
  )
}

const ReduxAvatarImage = connect((state) => {
  return {
    master: state.master,
    avatar: state.avatar
  }
})(AvatarImage)

export default function (props) {
  const navigation = useNavigation()
  const route = useRoute()
  return <ReduxAvatarImage{...props} navigation={navigation} route={route} />
}