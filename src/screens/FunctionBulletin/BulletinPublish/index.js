import React, { useContext, useEffect, useState } from 'react'
import { Text, TextInput, View } from 'react-native'
import { connect } from 'react-redux'
import { actionType } from '../../../redux/actions/actionType'
import { AddressToName, ReadDraft } from '../../../lib/Util'
import { Button, List, WhiteSpace, Toast } from '@ant-design/react-native'
import { styles } from '../../../theme/style'
import { ThemeContext } from '../../../theme/theme-context'
import tw from 'twrnc'
import LinkPublishQuote from '../../../component/LinkPulishQuote'
import ErrorMsg from '../../../component/ErrorMsg'

//发布公告页面
const Item = List.Item
const BulletinPublishScreen = props => {
  const { theme } = useContext(ThemeContext)
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
    <View style={{
      ...styles.base_body1,
      backgroundColor: theme.base_view
    }}>
      <View style={{
        padding: 6
      }}>
        <TextInput
          placeholder="内容"
          value={draft}
          multiline={true}
          onChangeText={text => setDrfat(text)}
          placeholderTextColor={tw.color('stone-500')}
          numberOfLines={4}
          style={{
            ...styles.input_view,
            color: theme.text1,
            height: 400,
            textAlignVertical: 'top'
          }}
        />
        {
          error_msg.length > 0 &&
          <ErrorMsg error_msg={error_msg} />
        }

      </View>

      {
        props.avatar.get('QuoteList').length > 0 &&
        <View style={{
          ...styles.link_list,
          backgroundColor: theme.tab_view,
          flexDirection: 'row',
          flexWrap: 'wrap'
        }}>
          {
            props.avatar.get('QuoteList').map((item, index) => (
              <View
                key={item.Hash}
                style={{
                  borderWidth: 1,
                  borderColor: theme.split_line,
                  borderRadius: 6,
                  paddingLeft: 6,
                  paddingRight: 6
                }}>
                <LinkPublishQuote
                  name={AddressToName(props.avatar.get('AddressMap'), item.Address)}
                  sequence={item.Sequence}
                  onPressQuote={() => props.navigation.push('Bulletin', { hash: item.Hash })}
                  onPressCancel={() => props.dispatch({
                    type: actionType.avatar.delQuote,
                    hash: item.Hash
                  })} />
              </View>
            ))
          }
        </View>
      }
      <Text style={tw.style('text-base', 'text-red-500')}>
        {`注意：发布内容将以字符串类型进行签名，所有请不要使用英文单引号（'），建议使用英文双引号（"）或者中文单引号（‘’）替代，谢谢`}
      </Text>
      <View style={styles.base_view_a}>
        <Button style={tw.style(`rounded-full bg-green-500`)} onPress={() => publishBulletin()}>
          <Text style={tw.style(`text-xl text-slate-100`)}>发布</Text>
        </Button>
      </View>
    </View >
  )
}

const ReduxBulletinPublishScreen = connect((state) => {
  return {
    avatar: state.avatar
  }
})(BulletinPublishScreen)

export default ReduxBulletinPublishScreen