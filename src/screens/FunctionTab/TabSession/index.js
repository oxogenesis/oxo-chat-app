import React, { useContext } from 'react'
import { ScrollView, View, Text, Image, TouchableOpacity } from 'react-native'
import { connect } from 'react-redux'
import { List, Badge } from '@ant-design/react-native'
import { timestamp_format, AddressToName } from '../../../lib/Util'
import EmptyView from '../../FunctionBase/EmptyView'
import { styles } from '../../../theme/style'
import { ThemeContext } from '../../../theme/theme-context'
const Item = List.Item
import tw from 'twrnc'

//聊天Tab
const TabSessionScreen = (props) => {

  const { theme } = useContext(ThemeContext)

  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: theme.base_view }}
      automaticallyAdjustContentInsets={false}
      showsHorizontalScrollIndicator={false}
      showsVerticalScrollIndicator={true}
    >
      {
        !props.avatar.get('ConnStatus') &&
        <View style={tw`bg-red-200 p-4`}>
          <Text style={tw`text-base text-center`}>
            未连接服务器，请检查网络设置或连通性
          </Text>
        </View>
      }

      {
        props.avatar.get('SessionList').length > 0 ? props.avatar.get('SessionList').map((item, index) => {
          return (
            <TouchableOpacity key={index} onPress={() => props.navigation.push('Session', { address: item.Address })}>
              <View style={{
                flex: 1,
                flexDirection: "row",
                backgroundColor: theme.base_body,
                borderBottomWidth: 1,
                borderColor: theme.line,
                padding: 12
              }}

              >
                <View style={{
                  flex: 0.16
                }}>
                  {
                    item.CountUnread != null && item.CountUnread != 0 ?
                      <Badge text={item.CountUnread} overflowCount={99} size='small'>
                        <View style={{
                          width: 55,
                          height: 55,
                        }}>
                          <Image style={{
                            ...styles.msg_img,
                          }} source={require('../../../assets/app.png')}>
                          </Image>
                        </View>
                      </Badge>
                      :
                      <Image style={{
                        ...styles.msg_img,
                      }} source={require('../../../assets/app.png')}></Image>
                  }
                </View>
                <View style={{
                  flex: 0.84
                }}>
                  <View style={{
                    flex: 1,
                    flexDirection: "row",
                  }}>
                    <View style={{
                      flex: 0.6
                    }}>
                      <Text style={{
                        color: theme.text1,
                        fontSize: 20
                      }} ellipsizeMode={"tail"} numberOfLines={1}>{`${AddressToName(props.avatar.get('AddressMap'), item.Address)}`}</Text>
                    </View>
                    <View style={{
                      flex: 0.4
                    }}>
                      <Text style={{
                        color: theme.text2,
                        textAlign: 'right'
                      }}>{timestamp_format(item.Timestamp)}</Text>
                    </View>
                  </View>
                  <View>
                    <Text style={styles.text5} ellipsizeMode={"tail"} numberOfLines={1}>
                      {item.Content}
                    </Text>
                  </View>
                </View>
              </View>
            </TouchableOpacity>

          )
        })
          :
          <EmptyView />
      }
    </ScrollView>
  )
}


const ReduxTabSessionScreen = connect((state) => {
  return {
    avatar: state.avatar
  }
})(TabSessionScreen)

export default ReduxTabSessionScreen

