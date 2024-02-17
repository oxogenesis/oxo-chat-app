import React, { useEffect, useState } from 'react'
import { Text, TextInput, View } from 'react-native'
import { connect } from 'react-redux'
import { actionType } from '../../../redux/actions/actionType'
import { ReadDraft } from '../../../lib/Util'
import ButtonPrimary from '../../../component/ButtonPrimary'
import LinkPublishQuote from '../../../component/LinkPulishQuote'
import ErrorMsg from '../../../component/ErrorMsg'
import tw from '../../../lib/tailwind'

//发布公告页面
const BulletinPublishScreen = props => {
  const [draft, setDrfat] = useState('')
  const [error_msg, setMsg] = useState('')

  const publishBulletin = () => {
    let newContent = draft.trim()
    if (newContent == '') {
      setMsg('公告不能为空...')
      return
    }
    props.dispatch({
      type: actionType.avatar.PublishBulletin,
      content: newContent
    })
    setDrfat('')
    setMsg('')
    props.navigation.goBack()
  }

  useEffect(() => {
    return props.navigation.addListener('focus', () => {
      ReadDraft(props.avatar.get('Address'))
        .then(saved_draft => {
          if (saved_draft) {
            setDrfat(saved_draft)
          } else {
            setDrfat('')
          }
        })
    })
  })

  useEffect(() => {
    return props.navigation.addListener('blur', () => {
      props.dispatch({
        type: actionType.avatar.SaveBulletinDraft,
        draft: draft
      })
    })
  })

  return (
    <View style={tw`h-full bg-neutral-200 dark:bg-neutral-800 p-5px`}>
      <ButtonPrimary title={'发布'} onPress={publishBulletin} />

      <View style={tw`mt-5px`}>
        <TextInput
          placeholder="内容......"
          placeholderTextColor={tw.color('neutral-500')}
          value={draft}
          multiline={true}
          style={tw`mx-5px rounded-lg border-solid border-2 border-gray-300 dark:border-gray-700 text-slate-800 dark:text-slate-200 text-base text-justify h-500px`}
          // TODO align-text-top
          onChangeText={text => setDrfat(text)}
        />
        {
          error_msg.length > 0 &&
          <ErrorMsg error_msg={error_msg} />
        }
      </View>

      {
        props.avatar.get('QuoteList').length > 0 &&
        <View style={tw`flex flex-row flex-wrap`}>
          {
            props.avatar.get('QuoteList').map((item, index) => (
              <View key={index} style={tw`border rounded-lg mr-5px`}>
                <LinkPublishQuote address={item.Address} sequence={item.Sequence} hash={item.Hash} to={item.Address} />
              </View>
            ))
          }
        </View>
      }
      <Text style={tw`text-base text-red-500`}>
        {`注意：发布内容将以字符串类型进行签名，所以请不要使用英文单引号（'），建议使用英文双引号（"）或者中文单引号（‘’）或者中文双引号（“”）替代，谢谢`}
      </Text>
    </View >
  )
}

const ReduxBulletinPublishScreen = connect((state) => {
  return {
    avatar: state.avatar
  }
})(BulletinPublishScreen)

export default ReduxBulletinPublishScreen