import React, { useEffect, useContext } from 'react'
import { View, ScrollView, Text } from 'react-native'
import { useNavigation, useRoute } from '@react-navigation/native'
import { connect } from 'react-redux'
import { actionType } from '../../../redux/actions/actionType'
import { timestamp_format, AddressToName } from '../../../lib/Util'
import { my_styles, styles } from '../../../theme/style'
import { ThemeContext } from '../../../theme/theme-context'
import EmptyView from '../../FunctionBase/EmptyView'
import LinkBulletin from '../../../component/LinkBulletin'
import tw from 'twrnc'

//公告列表
const BulletinInfoScreen = (props) => {
  const { theme } = useContext(ThemeContext)

  useEffect(() => {
    return props.navigation.addListener('focus', () => {
      props.dispatch({
        type: actionType.avatar.LoadCurrentBulletin,
        address: props.route.params.address,
        sequence: props.route.params.sequence,
        hash: props.route.params.hash,
        to: props.route.params.to
      })
    })
  })

  const data = [{
    name: 'zhss',
    num: 1
  }]
  return (
    <View style={[my_styles.container, {
      flexDirection: "column",
      backgroundColor: theme.base_view
    }]}>
      {
        props.avatar.get('CurrentBulletin') == null ?
          <EmptyView />
          :
          <>
            <View style={tw`border-b border-stone-500`}>
              <Text style={{ color: theme.text1 }}>
                {`哈希：${props.route.params.hash}`}
              </Text>
              <Text style={{ color: theme.text1 }}>
                {`地址：${props.avatar.get('CurrentBulletin').Address}`}
              </Text>
              <Text style={{ color: theme.text1 }}>
                {`序号：${props.avatar.get('CurrentBulletin').Sequence}`}
              </Text>
              <Text style={{ color: theme.text1 }}>
                {`时间：${props.avatar.get('CurrentBulletin').Timestamp}`}
              </Text>
              <Text style={{ color: theme.text1 }}>
                {`引用：${props.avatar.get('CurrentBulletin').QuoteSize}`}
              </Text>
              {
                <View>
                  {
                    props.avatar.get('CurrentBulletin').QuoteList.map((item, index) => (
                      <Text key={index} style={{ color: theme.text1 }}>
                        {index + 1} : {item.Address}#{item.Sequence}({item.Hash})
                      </Text>
                    ))
                  }
                </View>
              }
            </View>
            <ScrollView>
              <Text style={{ color: theme.text1 }}>
                {props.avatar.get('CurrentBulletin').Content}
              </Text>
            </ScrollView>


          </>
      }
    </View>
  )
}

const ReduxBulletinInfoScreen = connect((state) => {
  return {
    avatar: state.avatar
  }
})(BulletinInfoScreen)

export default function (props) {
  const navigation = useNavigation()
  const route = useRoute()
  return <ReduxBulletinInfoScreen{...props} navigation={navigation} route={route} />
}