import * as React from 'react'
import { View, Text, TextInput } from 'react-native'
import { useNavigation, useRoute } from '@react-navigation/native'

import { connect } from 'react-redux'

//地址标记
class AvatarSeedScreen extends React.Component {
  constructor(props) {
    super(props)
  }

  render() {
    return (
      <View>
        <TextInput
          style={{ color: 'red', fontWeight: 'bold' }}
          value={this.props.avatar.get('Seed')}
          multiline={false}
        />
        <Text>{`注意：查看种子，应回避具备视觉的生物或设备，应在私密可控环境下。`}</Text>
      </View>
    )
  }
}

const ReduxAvatarSeedScreen = connect((state) => {
  return {
    avatar: state.avatar
  }
})(AvatarSeedScreen)

//export default AvatarSeedScreen
export default function (props) {
  const navigation = useNavigation()
  const route = useRoute()
  return <ReduxAvatarSeedScreen{...props} navigation={navigation} route={route} />
}