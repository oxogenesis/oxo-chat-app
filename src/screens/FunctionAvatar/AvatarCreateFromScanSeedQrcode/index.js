import React, { useEffect } from 'react'
import { View, Text } from 'react-native'
import { connect } from 'react-redux'
import QRCodeScanner from 'react-native-qrcode-scanner'
import { actionType } from '../../../redux/actions/actionType'
import { RNCamera } from 'react-native-camera'
import { ParseQrcodeSeed, AvatarCreateWithSeed, DeriveKeypair, DeriveAddress, MasterConfig } from '../../../lib/OXO'
import tw from '../../../lib/tailwind'

const AvatarCreateFromScanSeedQrcode = (props) => {

  const onSuccess = (e) => {
    let json = ParseQrcodeSeed(e.data)
    if (json != false) {
      AvatarCreateWithSeed(json.Name, json.Seed, props.master.get('MasterKey'))
        .then(result => {
          if (result) {
            let multi = props.master.get("Multi")
            if (multi == true) {
              // true not address
              props.navigation.goBack()
            } else {
              // false
              let keypair = DeriveKeypair(json.Seed)
              let address = DeriveAddress(keypair.publicKey)
              MasterConfig({ multi: address })
                .then(result => {
                  if (result) {
                    props.dispatch({
                      type: actionType.master.setMulti,
                      multi: address
                    })
                  }
                })
              props.dispatch({
                type: actionType.avatar.enableAvatar,
                seed: json.Seed,
                name: json.Name
              })
            }
          }
        })
    }
  }

  useEffect(() => {
    if (props.avatar.get('Database') != null) {
      props.navigation.replace('TabHome')
    }
  }, [props.avatar])

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
    avatar: state.avatar,
    master: state.master
  }
})(AvatarCreateFromScanSeedQrcode)

export default ReduxAvatarCreateFromScanSeedQrcode