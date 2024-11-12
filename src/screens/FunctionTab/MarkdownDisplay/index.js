import React, { useEffect } from 'react'
import { SafeAreaView, ScrollView, StatusBar } from 'react-native'
import { connect } from 'react-redux'
import Markdown from 'react-native-markdown-display'

//网络设置
const MarkdownDisplayScreen = (props) => {

  useEffect(() => {
    return props.navigation.addListener('focus', () => {
      props.navigation.setOptions({ title: props.route.params.title })
    })
  })

  return (
    <>
      <StatusBar barStyle="light-content" />
      <SafeAreaView>
        <ScrollView
          contentInsetAdjustmentBehavior="automatic"
          style={{ height: '100%', backgroundColor: 'grey' }}
        >
          <Markdown>
            {props.route.params.content}
          </Markdown>
        </ScrollView>
      </SafeAreaView>
    </>
  )
}

const ReduxMarkdownDisplayScreen = connect((state) => {
  return {
    avatar: state.avatar
  }
})(MarkdownDisplayScreen)

export default ReduxMarkdownDisplayScreen