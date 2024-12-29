import React from 'react'
import { View } from 'react-native'
import { connect } from 'react-redux'
import ButtonPrimary from '../../component/ButtonPrimary'
import { HalfSHA512 } from '../../lib/OXO'
import { FileSystem, Dirs } from 'react-native-file-access'
import { AesEncrypt, AesDecrypt } from '../../lib/OXO'
import tw from '../../lib/tailwind'

const ENCRYPTION_KEY = HalfSHA512('oxo').toString('hex').slice(0, 32)
console.log(ENCRYPTION_KEY)
// 加密文件
async function encryptFile(inputFilePath, outputFilePath) {
  try {
    console.log('00')
    const fileContent = await FileSystem.readFile(inputFilePath, 'base64')
    console.log('01')
    // const encryptedContent = CryptoJS.AES.encrypt(fileContent, ENCRYPTION_KEY)
    let encryptedContent = AesEncrypt(fileContent, ENCRYPTION_KEY)
    console.log('02')
    await FileSystem.writeFile(outputFilePath, encryptedContent, 'base64')
    console.log('文件加密成功')
  } catch (error) {
    console.error('文件加密失败:', error)
  }
}

// 解密文件
async function decryptFile(inputFilePath, outputFilePath) {
  try {
    const encryptedContent = await FileSystem.readFile(inputFilePath, 'base64')
    const decryptedBytes = AesDecrypt(encryptedContent, ENCRYPTION_KEY)
    // const decryptedContent = decryptedBytes.toString(CryptoJS.enc.base64)
    let decryptedContent = decryptedBytes.toString('base64')
    await FileSystem.writeFile(outputFilePath, decryptedContent, 'base64')
    console.log('文件解密成功')
  } catch (error) {
    console.error('文件解密失败:', error)
  }
}

// 转发公告到聊天
const ZZZScreen = props => {
  console.log(Dirs.CacheDir)
  console.log(Dirs.DatabaseDir)
  console.log(Dirs.DocumentDir)
  console.log(Dirs.MainBundleDir)
  console.log(Dirs.SDCardDir)
  // const inputFilePath = Dirs.SDCardDir + '/Download/oxo.jpg'
  // const encryptedFilePath = Dirs.SDCardDir + '/Download/aaa.jpg'
  // const decryptedFilePath = Dirs.SDCardDir + '/Download/bbb.jpg'
  const inputFilePath = Dirs.SDCardDir + '/Download/10m.mp4'
  const encryptedFilePath = Dirs.SDCardDir + '/Download/aaa.mp4'
  const decryptedFilePath = Dirs.SDCardDir + '/Download/bbb.mp4'
  return (
    <View style={tw`h-full bg-neutral-200 dark:bg-neutral-800 p-5px`}>
      <View style={tw`my-auto p-25px`}>
        <ButtonPrimary title={'加密文件'} onPress={() => encryptFile(inputFilePath, encryptedFilePath)} />
        <ButtonPrimary title={'使用教程'} bg={'bg-yellow-500'} onPress={() => decryptFile(encryptedFilePath, decryptedFilePath)} />
      </View>
    </View>
  )
}

const ReduxZZZScreen = connect((state) => {
  return {
    avatar: state.avatar
  }
})(ZZZScreen)

export default ReduxZZZScreen