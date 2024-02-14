import React from 'react'
import { Text } from 'react-native'
import QRCodeScanner from 'react-native-qrcode-scanner'
import { RNCamera } from 'react-native-camera'
import { ParseQrcodeAddress } from '../../../lib/OXO'
import tw from '../../../lib/tailwind'

const AddressScanScreen = (props) => {

  const onSuccess = (e) => {
    let result = ParseQrcodeAddress(e.data)
    if (result != false) {
      props.navigation.replace('AddressAddFromQrcode', { qrcode: result })
    }
  }

  return (
    <QRCodeScanner
      onRead={(e) => (onSuccess(e))}
      reactivate={true}
      reactivateTimeout={1500}
      flashMode={RNCamera.Constants.FlashMode.auto}
      showMarker={true}
      topContent={
        <Text style={tw`text-base text-gray-600 mb-30px bg-neutral-200 dark:bg-neutral-800`}>
        </Text>
      }
      bottomContent={
        <Text style={tw`text-base text-gray-600 mb-30px bg-neutral-200 dark:bg-neutral-800`}>
        </Text>
      }
    />
  )
}

export default AddressScanScreen