import React, { useContext, useEffect } from 'react';
import { View, ScrollView, Text, Image, TouchableOpacity } from 'react-native'
import { useNavigation, useRoute } from '@react-navigation/native'
import { connect } from 'react-redux'
import { actionType } from '../../redux/actions/actionType'
import { Icon, WhiteSpace, Tag, Toast, Popover } from '@ant-design/react-native';
import { GenesisHash } from '../../lib/Const'
import { timestamp_format, AddressToName } from '../../lib/Util'
import Clipboard from '@react-native-clipboard/clipboard'
import { Flex } from '@ant-design/react-native';
import { styles } from '../../theme/style'
import { ThemeContext } from '../../theme/theme-context';
import BaseList from '../BaseList';

//公告列表
const BulletinScreen = (props) => {
  const { theme } = useContext(ThemeContext);

  const markBulletin = (hash) => {
    props.dispatch({
      type: actionType.avatar.MarkBulletin,
      hash: hash
    })
  }

  const unmarkBulletin = (hash) => {
    props.dispatch({
      type: actionType.avatar.UnmarkBulletin,
      hash: hash
    })
  }

  const quoteBulletin = (address, sequence, hash) => {
    props.dispatch({
      type: actionType.avatar.addQuote,
      address: address,
      sequence: sequence,
      hash: hash
    })
  }

  const copyToClipboard = () => {
    Clipboard.setString(props.avatar.get('CurrentBulletin').Content)
    Toast.success('拷贝成功！', 1);
  }

  const quote = () => {
    Toast.success('引用成功！', 1);
  }


  useEffect(() => {
    props.navigation.addListener('focus', () => {
      console.log(props.route.params.hash)
      props.dispatch({
        type: actionType.avatar.LoadCurrentBulletin,
        address: props.route.params.address,
        sequence: props.route.params.sequence,
        hash: props.route.params.hash,
        to: props.route.params.to
      })
    })
  })


  const handleCollection = () => {
    markBulletin(props.avatar.get('CurrentBulletin').Hash)
    Toast.success('收藏成功！', 1);
  }

  const cancelCollection = () => {
    unmarkBulletin(props.avatar.get('CurrentBulletin').Hash)
    Toast.success('取消收藏！', 1);
  }


  return (
    <View style={{
      ...styles.base_body,
      backgroundColor: theme.base_body
    }}>
      {
        props.avatar.get('CurrentBulletin') == null ?
          <Text style={{ color: theme.text2 }}>公告不存在，正在获取中，请稍后查看...</Text>
          :
          <ScrollView>
            <View style={{
              backgroundColor: theme.base_body
            }}>
              <Flex justify="start" align="start">
                <TouchableOpacity 
                onPress={() => props.navigation.push('AddressMark',
                { address: props.avatar.get('CurrentBulletin').Address })}
                 >
                  <Image style={styles.img_md} source={require('../../assets/app.png')}></Image>
                </TouchableOpacity>

                <View style={{
                  marginLeft: 8
                }}>
                  <Text>
                    <View>
                      <Text style={{
                        ...styles.name2,
                        color: theme.link_color,
                      }}
                        onPress={() => props.navigation.push('AddressMark',
                          { address: props.avatar.get('CurrentBulletin').Address })}
                      >{AddressToName(props.avatar.get('AddressMap'), props.avatar.get('CurrentBulletin').Address)}&nbsp;&nbsp;</Text>
                    </View>
                    <Text
                    // onPress={() => props.navigation.push('Bulletin', { hash: props.avatar.get('CurrentBulletin').Hash })}
                    >
                      <View style={{
                        borderWidth: 1,
                        borderColor: theme.split_line,
                        borderRadius: 6,
                        paddingLeft: 6,
                        paddingRight: 6,

                      }}>
                        <Text style={{
                          color: theme.text1,
                          fontSize: 18
                        }}>{props.avatar.get('CurrentBulletin').Sequence}</Text>
                      </View>
                    </Text>
                  </Text>
                  <Text style={styles.desc_view}>
                    {timestamp_format(props.avatar.get('CurrentBulletin').Timestamp)}
                  </Text>

                  <View style={styles.content_view}>
                    <Text style={{
                      ...styles.content_text,
                      color: theme.text1
                    }}>
                      {props.avatar.get('CurrentBulletin').Content}
                    </Text>
                  </View>
                  <WhiteSpace size='lg' />
                  <View style={styles.content_view}>
                    <Text style={styles.desc_view}>
                    </Text>
                    <Popover
                      overlay={
                        <Popover.Item style={{
                          backgroundColor: '#434343',
                          flexDirection: 'row',
                          justifyContent: 'flex-end',
                          borderRadius: 5,
                          borderColor: '#434343'
                        }}>
                          {
                            props.avatar.get('CurrentBulletin').IsMark == "TRUE" &&
                            <TouchableOpacity onPress={cancelCollection}>
                              <View style={styles.icon_view}>
                                <Icon
                                  color='red'
                                  name="star" size="md"
                                />
                                <Text style={styles.icon_text}>收藏</Text>
                              </View>
                            </TouchableOpacity>
                          }
                          {
                            props.avatar.get('CurrentBulletin').IsMark == "FALSE" &&
                            <TouchableOpacity onPress={handleCollection}>
                              <View style={styles.icon_view}>
                                <Icon
                                  name='star'
                                  size="md"
                                  color='#fff'
                                />
                                <Text style={styles.icon_text}>收藏</Text>
                              </View>
                            </TouchableOpacity>

                          }
                          {
                            props.avatar.get('CurrentBulletin').PreHash != GenesisHash &&
                            <TouchableOpacity onPress={() => props.navigation.push('Bulletin', {
                              address: props.avatar.get('CurrentBulletin').Address,
                              sequence: props.avatar.get('CurrentBulletin').Sequence - 1,
                              hash: props.avatar.get('CurrentBulletin').PreHash,
                              to: props.avatar.get('CurrentBulletin').Address
                            })}>
                              <View style={styles.icon_view}>
                                <Icon
                                  name='backward'
                                  size="md"
                                  color='#fff'
                                  style={{
                                    textAlign: 'center'
                                  }}
                                />
                                <Text style={styles.icon_text}>上一个</Text>
                              </View>
                            </TouchableOpacity>

                          }

                          <TouchableOpacity onPress={() => {
                            quoteBulletin(props.avatar.get('CurrentBulletin').Address,
                            props.avatar.get('CurrentBulletin').Sequence,
                            props.avatar.get('CurrentBulletin').Hash)
                            quote()
                          }
                            }
                              >
                            <View style={styles.icon_view}>
                              <Icon
                                name='link'
                                size="md"
                                color='#fff' />
                              <Text style={styles.icon_text}>引用</Text>
                            </View>
                          </TouchableOpacity>

                          <TouchableOpacity onPress={() =>
                            props.navigation.push('AddressSelect', {
                              content: {
                                ObjectType: "Bulletin",
                                Address: props.avatar.get('CurrentBulletin').Address,
                                Sequence: props.avatar.get('CurrentBulletin').Sequence,
                                Hash: props.avatar.get('CurrentBulletin').Hash
                              }
                            })}>
                            <View style={styles.icon_view}>
                              <Icon
                                name='branches'
                                size="md"
                                color='#fff'

                              />
                              <Text style={styles.icon_text}>分享</Text>
                            </View>
                          </TouchableOpacity>
                          <TouchableOpacity onPress={() => {
                            copyToClipboard();
                          }}>
                            <View style={styles.icon_view}>
                              <Icon
                                name='block'
                                color='#fff'
                                size="md"
                              />
                              <Text style={styles.icon_text}>拷贝</Text>
                            </View>
                          </TouchableOpacity>
                        </Popover.Item>
                      }
                    >
                      <Text style={{
                        fontSize: 24,
                        backgroundColor: theme.icon_view,
                        lineHeight: 20,
                        width: 32,
                        height: 25,
                        textAlign: 'center',
                        color: theme.text1
                      }}>...</Text>
                    </Popover>
                  </View>
                  <WhiteSpace />


                </View>
              </Flex>
            </View>


            {
              props.avatar.get('CurrentBulletin').QuoteList.length > 0 && <View style={{
                ...styles.link_list,
                backgroundColor: theme.tab_view
              }}>
                {
                  props.avatar.get('CurrentBulletin').QuoteList.map((item, index) => (
                    <Text key={index} style={{
                      ...styles.link_list_text,
                      color: theme.link_color,
                      borderColor: theme.line,
                    }} onPress={() => props.navigation.push('Bulletin', {
                      address: item.Address,
                      sequence: item.Sequence,
                      hash: item.Hash,
                      to: props.avatar.get('CurrentBulletin').Address
                    })}>
                      {`${AddressToName(props.avatar.get('AddressMap'), item.Address)}#${item.Sequence}`}
                      {props.avatar.get('CurrentBulletin').QuoteList.length - 1 !== index && ','}
                    </Text>
                  ))
                }
              </View>
            }

          </ScrollView>
      }
    </View>
  )
}


const ReduxBulletinScreen = connect((state) => {
  return {
    avatar: state.avatar
  }
})(BulletinScreen)

//export default BulletinScreen
export default function (props) {
  const navigation = useNavigation()
  const route = useRoute()
  return <ReduxBulletinScreen{...props} navigation={navigation} route={route} />
}