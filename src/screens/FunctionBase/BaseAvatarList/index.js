import React, { useContext } from 'react'
import { View, Text, TouchableOpacity, Image } from 'react-native'
import { ThemeContext } from '../../../theme/theme-context'
import styles from './style'
import AvatarImage from '../../../component/AvatarImage'

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
              <AvatarImage address={item.address} />
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