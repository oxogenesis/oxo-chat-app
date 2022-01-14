import * as React from 'react'
import { StyleSheet, Text, TouchableOpacity } from 'react-native'
import { connect } from 'react-redux'
import QRCodeScanner from 'react-native-qrcode-scanner'
import { RNCamera } from 'react-native-camera'
import { ParseQrcodeSeed, AvatarCreateWithSeed } from '../../lib/OXO'

class AvatarCreateFromScanSeedQrcode extends React.Component {
  onSuccess(e) {
    let result = ParseQrcodeSeed(e.data)
    if (result != false) {
      AvatarCreateWithSeed(result.Name, result.Seed, this.props.master.get('MasterKey'))
        .then(result => {
          if (result) {
            this.props.navigation.replace('AvatarList')
          }
        })
    }
  }

  render() {
    return (
      <QRCodeScanner
        onRead={(e) => (this.onSuccess(e))}
        reactivate={true}
        reactivateTimeout={3000}
        flashMode={RNCamera.Constants.FlashMode.auto}
        showMarker={true}
        topContent={
          <Text style={styles.centerText}>
          </Text>
        }
        bottomContent={
          <TouchableOpacity style={styles.buttonTouchable}>
            <Text style={styles.buttonText}></Text>
          </TouchableOpacity>
        }
      />
    )
  }
}

const styles = StyleSheet.create({
  centerText: {
    flex: 1,
    fontSize: 18,
    padding: 32,
    color: '#777'
  },
  textBold: {
    fontWeight: '500',
    color: '#000'
  },
  buttonText: {
    fontSize: 21,
    color: 'rgb(0,122,255)'
  },
  buttonTouchable: {
    padding: 16
  }
})

const ReduxAvatarCreateFromScanSeedQrcode = connect((state) => {
  return {
    master: state.master
  }
})(AvatarCreateFromScanSeedQrcode)

export default ReduxAvatarCreateFromScanSeedQrcode