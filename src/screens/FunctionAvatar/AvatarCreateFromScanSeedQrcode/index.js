import React from 'react'
import { View, Text } from 'react-native'
import { connect } from 'react-redux'
import QRCodeScanner from 'react-native-qrcode-scanner'
import { RNCamera } from 'react-native-camera'
import { ParseQrcodeSeed, AvatarCreateWithSeed } from '../../../lib/OXO'
import tw from '../../../lib/tailwind'

const AvatarCreateFromScanSeedQrcode = (props) => {

  const onSuccess = (e) => {
    let result = ParseQrcodeSeed(e.data)
    if (result != false) {
      AvatarCreateWithSeed(result.Name, result.Seed, props.master.get('MasterKey'))
        .then(result => {
          if (result) {
            props.navigation.goBack()
          }
        })
    }
  }

  return (
    <View style={tw`h-full bg-neutral-200 dark:bg-neutral-800`}>
      <QRCodeScanner
        onRead={(e) => (onSuccess(e))}
        reactivate={true}
        reactivateTimeout={1500}
        flashMode={RNCamera.Constants.FlashMode.auto}
        showMarker={true}
        topContent={
          <Text style={tw`text-base text-gray-600 mb-30px bg-neutral-200 dark:bg-neutral-800`}>
            请扫描【种子二维码】
          </Text>
        }
        bottomContent={
          <Text style={tw`text-base text-gray-600 mt-30px bg-neutral-200 dark:bg-neutral-800`}>
            {'种子二维码可在【设置-->查看种子-->种子二维码】获取'}
          </Text>
        }
      />
    </View>
  )
}

const ReduxAvatarCreateFromScanSeedQrcode = connect((state) => {
  return {
    master: state.master
  }
})(AvatarCreateFromScanSeedQrcode)

export default ReduxAvatarCreateFromScanSeedQrcode