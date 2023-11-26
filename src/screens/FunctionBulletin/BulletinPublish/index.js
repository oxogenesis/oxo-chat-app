import React, { useContext, useEffect, useState } from 'react'
import { Text, TextInput, View } from 'react-native'
import { connect } from 'react-redux'
import { actionType } from '../../../redux/actions/actionType'
import { AddressToName, ReadDraft } from '../../../lib/Util'
import { Button, List, WhiteSpace, Toast } from '@ant-design/react-native'
import { styles } from '../../../theme/style'
import { ThemeContext } from '../../../theme/theme-context'
import tw from 'twrnc'

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
            height: 200,
            textAlignVertical: 'top'
          }}
        />
        {
          error_msg.length > 0 &&
          <View>
            <Text style={tw.style('text-base', 'text-red-500')}>{error_msg}</Text>
          </View>
        }
        <WhiteSpace size='lg' />
        <Text style={tw.style('text-base', 'text-red-500')}>
          {`注意：发布内容将以字符串形式进行签名，所有请不要使用英文单引号（'），建议使用英文双引号（"）或者中文单引号（‘’）替代，谢谢`}
        </Text>
      </View>

      {
        props.avatar.get('QuoteList').map((item, index) => (
          <View key={item.Hash}>
            <Text style={{
              ...styles.link_list_text,
              color: theme.link_color,
              borderColor: theme.line,
            }} onPress={() => props.navigation.push('Bulletin', { hash: item.Hash })}>
              {AddressToName(props.avatar.get('AddressMap'), item.Address)}#{item.Sequence}
              {props.avatar.get('CurrentBulletin').QuoteList.length - 1 !== index && ','}
            </Text>
            <WhiteSpace size='lg' />
            <View style={{
              padding: 6,
            }}>
              <Text
                onPress={() => props.dispatch({
                  type: actionType.avatar.delQuote,
                  hash: item.Hash
                })}
                style={{
                  ...styles.cancel_text,
                  color: theme.link_color
                }}>取消引用</Text>
            </View>
            <WhiteSpace size='lg' />
          </View>
        ))
      }

      <View style={styles.base_view_a}>
        <Button
          style={styles.btn_high}
          type='primary'
          onPress={() => publishBulletin()}
        >发布</Button>
      </View>
    </View>
  )
}

const ReduxBulletinPublishScreen = connect((state) => {
  return {
    avatar: state.avatar
  }
})(BulletinPublishScreen)

export default ReduxBulletinPublishScreen