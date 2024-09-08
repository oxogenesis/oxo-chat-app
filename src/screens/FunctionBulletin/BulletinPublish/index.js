import React, { useEffect, useState } from 'react'
import { Text, TextInput, View, ScrollView } from 'react-native'
import { connect } from 'react-redux'
import { actionType } from '../../../redux/actions/actionType'
import { ReadDraft } from '../../../lib/Util'
import ButtonPrimary from '../../../component/ButtonPrimary'
import LinkPublishQuote from '../../../component/LinkPulishQuote'
import LinkPublishFile from '../../../component/LinkPublishFile'
import ErrorMsg from '../../../component/ErrorMsg'
import tw from '../../../lib/tailwind'

//发布公告页面
const BulletinPublishScreen = props => {
  const [keyboardAppearance, setKeyboardAppearance] = useState()
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
      console.log('focus', Date.now())
      ReadDraft(props.avatar.get('Address'))
        .then(saved_draft => {
          if (saved_draft) {
            setDrfat(saved_draft)
          } else {
            setDrfat('')
          }
        })

      props.navigation.setOptions({ title: `发布第${props.avatar.get('NextBulletinSequence')}号公告` })

      if (props.route.params && props.route.params.file_json) {
        props.dispatch({
          type: actionType.avatar.CacheLocalBulletinFile,
          file_json: props.route.params.file_json
        })
      }


      if (props.master.get('Dark')) {
        setKeyboardAppearance('dark')
      } else {
        setKeyboardAppearance('light')
      }
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

      <ScrollView style={tw`mt-5px`}>
        <TextInput
          placeholder="内容......"
          placeholderTextColor={tw.color('neutral-500')}
          value={draft}
          multiline={true}
          keyboardAppearance={keyboardAppearance}
          style={tw`mx-5px rounded-lg border-solid border-2 border-gray-300 dark:border-gray-700 text-slate-800 dark:text-slate-200 text-base text-justify`}
          // TODO:align-text-top
          onChangeText={text => setDrfat(text)}
        />
        {
          error_msg.length > 0 &&
          <ErrorMsg error_msg={error_msg} />
        }
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
        {
          props.avatar.get('FileList').length > 0 &&
          <View style={tw`flex flex-row flex-wrap`}>
            {
              props.avatar.get('FileList').map((item, index) => (
                <View key={index} style={tw`border rounded-lg mr-5px`}>
                  <LinkPublishFile name={item.Name} ext={item.Ext} hash={item.Hash} size={item.Size} onPress={() => props.dispatch({
                    type: actionType.avatar.delFileList,
                    Hash: item.Hash
                  })} />
                </View>
              ))
            }
          </View>
        }
        <Text style={tw`text-base text-red-500`}>
          {``}
        </Text>
      </ScrollView>
    </View >
  )
}

const ReduxBulletinPublishScreen = connect((state) => {
  return {
    avatar: state.avatar,
    master: state.master
  }
})(BulletinPublishScreen)

export default ReduxBulletinPublishScreen