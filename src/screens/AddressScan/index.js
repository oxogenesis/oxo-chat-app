'use strict'

import * as React from 'react'

import { StyleSheet, Text, TouchableOpacity, Linking } from 'react-native'

import QRCodeScanner from 'react-native-qrcode-scanner'
import { RNCamera } from 'react-native-camera'
import { ParseQrcode } from '../../lib/OXO'

class AddressScanScreen extends React.Component {
  onSuccess(e) {
    let result = ParseQrcode(e.data)
    if (result != false) {
      this.props.navigation.replace('AddressAddFromQrcode', { qrcode: result })
    }
  }

  render() {
    return (
      <QRCodeScanner
        onRead={(e) => (this.onSuccess(e))}
        reactivate={true}
        reactivateTimeout={1500}
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

export default AddressScanScreen