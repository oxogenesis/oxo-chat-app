import React, { useContext } from 'react'
import { View, Text, TouchableOpacity, Image } from 'react-native'
import { ThemeContext } from '../../theme/theme-context'
import styles from './style'

const BaseAvatarList = ({ data = [] }) => {
  const { theme } = useContext(ThemeContext)

  return (
    <View>
      {
        data.map((item, index) => (
          <TouchableOpacity key={index} onPress={item.onpress}>
            <View style={{
              ...styles.item,
              backgroundColor: theme.base_body,
              borderColor: theme.line,
              flexDirection: 'row'
            }}>
              <Image style={styles.img1} defaultSource={require('../../assets/app.png')} source={{ uri: `https://www.gravatar.com/avatar/${item.address}?s=${50}&d=retro&r=g` }}></Image>
              <Text style={{
                color: theme.text1,
                ...styles.text,
                flex: 0.6
              }}>{item.title}</Text>
              {
                item.desc && <Text style={{
                  color: theme.text2,
                  lineHeight: 55,
                  textAlign: 'right',
                  flex: 0.4
                }}>{item.desc}</Text>
              }
            </View>
          </TouchableOpacity>
        ))
      }
    </View>
  )
}

export default BaseAvatarList