import React, { useContext } from 'react'
import { View, Text, ScrollView, TouchableOpacity, ActivityIndicator } from 'react-native'
import { connect } from 'react-redux'
import { List } from '@ant-design/react-native'
import { WhiteSpace, Flex } from '@ant-design/react-native'
import EmptyView from '../../FunctionBase/EmptyView'
import { ThemeContext } from '../../../theme/theme-context'
import AvatarImage from '../../../component/AvatarImage'
import { BulletinAddressSession } from '../../../lib/Const'
import BaseImageList from '../../FunctionBase/BaseImageList'
import BaseAvatarList from '../../FunctionBase/BaseAvatarList'
const Item = List.Item
import { styles } from '../../../theme/style'
import tw from 'twrnc'

//联系人Tab
const TabAddressBookScreen = props => {
  const { theme } = useContext(ThemeContext)

  const lists = props.avatar.get('AddressArray').map(item => ({
    title: item.Name,
    address: item.Address,
    onpress: () => props.navigation.push('AddressMark', { address: item.Address })
  }))


  return (
    <ScrollView
      style={{ flex: 1, height: '100%', backgroundColor: theme.base_view }}
      automaticallyAdjustContentInsets={false}
      showsHorizontalScrollIndicator={false}
      showsVerticalScrollIndicator={false}>
      {/* <WhiteSpace />
      <View>
        <Text style={{
          paddingLeft: 12,
          color: theme.text2,
          borderBottomWidth: 1,
          borderColor: theme.line,
          paddingBottom: 12,
        }}>添加好友</Text>
        <BaseImageList data={[{
          title: '扫一扫',
          img: 'sys',
          backgroundColor: '#1296db',
          onpress: () => props.navigation.navigate('AddressScan')
        }, {
          title: '新朋友',
          img: 'add',
          backgroundColor: '#0e932e',
          onpress: () => props.navigation.navigate('AddressAdd')
        }]} />
      </View>
      <WhiteSpace /> */}


      {
        props.avatar.get('AddressArray').length > 0 ?
          <View style={tw`h-full bg-stone-200 p-5px`}>
            <ScrollView
              style={styles.scroll_view}
              automaticallyAdjustContentInsets={false}
              showsHorizontalScrollIndicator={false}
              showsVerticalScrollIndicator={false}>
              {
                props.avatar.get('AddressArray').length > 0 ?
                  props.avatar.get('AddressArray').map((item, index) => (
                    <View key={index} style={tw`bg-stone-100`}>
                      <Flex>
                        <Flex.Item style={{ flex: 0.15 }}>
                          <AvatarImage address={item.Address} />
                        </Flex.Item>
                        <Flex.Item >
                          <View style={tw`flex flex-row`}>
                            <TouchableOpacity onPress={() => props.navigation.push('AddressMark', { address: item.Address })}>
                              <View style={tw`bg-indigo-500 rounded-full px-2 border-2 border-gray-300`}>
                                <Text style={tw`text-base text-slate-800 text-center`}>
                                  {`${item.Name}`}
                                </Text>
                              </View>
                            </TouchableOpacity>
                            {
                              props.avatar.get('Follows').includes(item.Address) &&
                              <TouchableOpacity onPress={() => props.navigation.push('BulletinList', { session: BulletinAddressSession, address: item.Address })}>
                                <View style={tw`bg-yellow-500 rounded-full px-2 border-2 border-gray-300`}>
                                  <Text style={tw`text-base text-slate-800 text-center`}>
                                    公告
                                  </Text>
                                </View>
                              </TouchableOpacity>
                            }
                            {
                              props.avatar.get('Friends').includes(item.Address) &&
                              <TouchableOpacity onPress={() => props.navigation.push('Session', { address: item.Address })}>
                                <View style={tw`bg-green-500 rounded-full px-2 border-2 border-gray-300`}>
                                  <Text style={tw`text-base text-slate-800 text-center`}>
                                    聊天
                                  </Text>
                                </View>
                              </TouchableOpacity>
                            }
                          </View>
                          <Text style={tw`text-sm text-slate-400`}>{item.Address}</Text>
                        </Flex.Item>
                      </Flex>
                    </View>
                  ))
                  :
                  <EmptyView pTop={1} />
              }
              <WhiteSpace size='lg' />
            </ScrollView>
          </View>
          :
          <EmptyView />
      }
    </ScrollView>
  )
}


const ReduxTabAddressBookScreen = connect((state) => {
  return {
    avatar: state.avatar
  }
})(TabAddressBookScreen)

export default ReduxTabAddressBookScreen