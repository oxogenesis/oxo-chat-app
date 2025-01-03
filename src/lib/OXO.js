import crypto from 'react-native-quick-crypto'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { Epoch, ActionCode, ObjectType } from './Const'
import { ConsoleError, ConsoleWarn } from './Util'

const oxoKeyPairs = require("oxo-keypairs")

function strToHex(str) {
  let arr = []
  let length = str.length
  for (let i = 0; i < length; i++) {
    arr[i] = (str.charCodeAt(i).toString(16))
  }
  return arr.join('').toUpperCase()
}

//input encode:'utf-8', 'ascii', 'binary'
//output encode:'hex', 'binary', 'base64'
var encrypt = function (key, iv, data) {
  var cipher = crypto.createCipheriv('aes-256-cbc', key, iv)
  var crypted = cipher.update(data, 'utf8', 'base64')
  crypted += cipher.final('base64')
  return crypted
}

var decrypt = function (key, iv, crypted) {
  var decipher = crypto.createDecipheriv('aes-256-cbc', key, iv)
  var decoded = decipher.update(crypted, 'base64', 'utf8')
  decoded += decipher.final('utf8')
  return decoded
}

function hasherSHA512(str) {
  let sha512 = crypto.createHash("sha512")
  sha512.update(str)
  return sha512.digest('hex')
}

function HalfSHA512(str) {
  return hasherSHA512(str).toUpperCase().substring(0, 64)
}

function QuarterSHA512(str) {
  return hasherSHA512(str).toUpperCase().substring(0, 32)
}

function AesEncrypt(content, aes_key) {
  let key = aes_key.slice(0, 32)
  let iv = aes_key.slice(32, 48)

  let str = encrypt(key, iv, content)
  return str
}

function AesDecrypt(str, aes_key) {
  let key = aes_key.slice(0, 32)
  let iv = aes_key.slice(32, 48)
  let content = decrypt(key, iv, str)
  return content
}

async function MasterKeySet(masterKey) {
  let salt = crypto.randomBytes(16).toString('hex')
  let key = HalfSHA512(salt + masterKey).toString('hex').slice(0, 32)
  let iv = crypto.randomBytes(8).toString('hex')
  let info = { "MasterKey": masterKey }
  let crypted = encrypt(key, iv, JSON.stringify(info))
  let save = { "salt": salt, "iv": iv, "ct": crypted }
  try {
    await AsyncStorage.setItem('<#MasterKey#>', JSON.stringify(save))
    return true
  } catch (e) {
    ConsoleError(e)
    return false
  }
}

async function MasterKeyDerive(masterKey) {
  try {
    const result = await AsyncStorage.getItem('<#MasterKey#>')
    let json = JSON.parse(result)
    let key = HalfSHA512(json.salt + masterKey).toString('hex').slice(0, 32)
    let mk = decrypt(key, json.iv, json.ct)
    mk = JSON.parse(mk)
    return true
  } catch (e) {
    ConsoleError(e)
    return false
  }
}

async function MasterConfig({ multi, dark }) {
  try {
    const result = await AsyncStorage.getItem('<#MasterConfig#>')
    let config = { multi: false, dark: false }
    if (result != null) {
      let json = JSON.parse(result)
      config = json
    }

    if (multi != null) {
      config.multi = multi
    }
    if (dark != null) {
      config.dark = dark
    }

    await AsyncStorage.setItem('<#MasterConfig#>', JSON.stringify(config))
    return true
  } catch (e) {
    ConsoleError(e)
    return false
  }
}

async function AvatarCreateNew(name, password) {
  let seed = oxoKeyPairs.generateSeed(password, 'secp256k1')
  let keypair = oxoKeyPairs.deriveKeypair(seed)
  let address = oxoKeyPairs.deriveAddress(keypair.publicKey)
  let salt = crypto.randomBytes(16).toString('hex')
  let key = HalfSHA512(salt + password).toString('hex').slice(0, 32)
  let iv = crypto.randomBytes(8).toString('hex')
  let msg = { "seed": seed }
  let crypted = encrypt(key, iv, JSON.stringify(msg))
  let save = { "salt": salt, "iv": iv, "ct": crypted }

  try {
    const result = await AsyncStorage.getItem('<#Avatars#>')
    let avatarList = []
    if (result != null) {
      avatarList = JSON.parse(result)
    }
    avatarList.unshift({ Name: name, Address: address, save: JSON.stringify(save), LoginAt: Date.now() })
    await AsyncStorage.setItem('<#Avatars#>', JSON.stringify(avatarList))
    return seed
  } catch (e) {
    ConsoleError(e)
    return false
  }
}

async function AvatarCreateWithSeed(name, seed, password) {
  let keypair = oxoKeyPairs.deriveKeypair(seed)
  let address = oxoKeyPairs.deriveAddress(keypair.publicKey)
  let salt = crypto.randomBytes(16).toString('hex')
  let key = HalfSHA512(salt + password).toString('hex').slice(0, 32)
  let iv = crypto.randomBytes(8).toString('hex')
  let msg = { "seed": seed }
  let crypted = encrypt(key, iv, JSON.stringify(msg))
  let save = { "salt": salt, "iv": iv, "ct": crypted }

  try {
    const result = await AsyncStorage.getItem('<#Avatars#>')
    let avatarList = []
    if (result != null) {
      avatarList = JSON.parse(result)
    }
    let new_flag = true
    avatarList.forEach(avatar => {
      if (avatar.Address == address) {
        new_flag = false
      }
    })
    if (new_flag) {
      avatarList.unshift({ Name: name, Address: address, save: JSON.stringify(save), LoginAt: Date.now() })
      await AsyncStorage.setItem('<#Avatars#>', JSON.stringify(avatarList))
    }
    return true
  } catch (e) {
    ConsoleError(e)
    return false
  }
}

async function AvatarNameEdit(name, seed, password) {
  let keypair = oxoKeyPairs.deriveKeypair(seed)
  let address = oxoKeyPairs.deriveAddress(keypair.publicKey)
  let salt = crypto.randomBytes(16).toString('hex')
  let key = HalfSHA512(salt + password).toString('hex').slice(0, 32)
  let iv = crypto.randomBytes(8).toString('hex')
  let msg = { "seed": seed }
  let crypted = encrypt(key, iv, JSON.stringify(msg))
  let save = { "salt": salt, "iv": iv, "ct": crypted }

  try {
    const result = await AsyncStorage.getItem('<#Avatars#>')
    let avatarList = []
    if (result != null) {
      avatarList = JSON.parse(result)
      let tmp = []
      avatarList.forEach(avatar => {
        if (avatar.Address != address) {
          tmp.push(avatar)
        }
      })
      avatarList = tmp
    }
    avatarList.push({ Name: name, Address: address, save: JSON.stringify(save), LoginAt: Date.now() })
    await AsyncStorage.setItem('<#Avatars#>', JSON.stringify(avatarList))
    return true
  } catch (e) {
    ConsoleError(e)
    return false
  }
}

// async function AvatarLoginTimeReset(timestamp) {
//   try {
//     const result = await AsyncStorage.getItem('<#Avatars#>')
//     let avatarList = []
//     if (result != null) {
//       avatarList = JSON.parse(result)
//       let tmp = []
//       avatarList.forEach(avatar => {
//         avatar.LoginAt = timestamp
//         tmp.push(avatar)
//       })
//       avatarList = tmp
//     }
//     await AsyncStorage.setItem('<#Avatars#>', JSON.stringify(avatarList))
//     return true
//   } catch (e) {
//     ConsoleError(e)
//     return false
//   }
// }

async function AvatarLoginTimeUpdate(address) {
  // ConsoleWarn(`AvatarLoginTimeUpdate::::address}`)
  try {
    const result = await AsyncStorage.getItem('<#Avatars#>')
    let avatarList = []
    let logout_avatar = null
    if (result != null) {
      avatarList = JSON.parse(result)
      let tmp = []
      avatarList.forEach(avatar => {
        if (avatar.Address != address) {
          tmp.push(avatar)
        } else {
          logout_avatar = avatar
          logout_avatar.LoginAt = Date.now()
        }
      })
      avatarList = tmp
    }
    if (logout_avatar != null) {
      avatarList.unshift(logout_avatar)
    }
    await AsyncStorage.setItem('<#Avatars#>', JSON.stringify(avatarList))
    return true
  } catch (e) {
    ConsoleError(e)
    return false
  }
}

async function AvatarDerive(strSave, masterKey) {
  try {
    let jsonSave = JSON.parse(strSave)
    let key = HalfSHA512(jsonSave.salt + masterKey).toString('hex').slice(0, 32)
    strSave = decrypt(key, jsonSave.iv, jsonSave.ct)
    let seed = JSON.parse(strSave).seed
    return seed
  } catch (e) {
    ConsoleError(e)
    return false
  }
}

function ParseQrcodeAddress(qrcode) {
  try {
    let json = JSON.parse(qrcode)
    let address = json.Address
    if (json.PublicKey) {
      address = oxoKeyPairs.deriveAddress(json.PublicKey)
    }
    return { Relay: json.Relay, Address: address }
  } catch (e) {
    ConsoleError(e)
    return false
  }
}

async function AvatarRemove(address) {
  try {
    const result = await AsyncStorage.getItem('<#Avatars#>')
    let avatar_list = []
    if (result != null) {
      avatar_list = JSON.parse(result)
      for (let i = 0; i < avatar_list.length; i++) {
        const avatar = avatar_list[i]
        if (avatar.Address == address) {
          avatar_list.splice(i, 1)
          break
        }
      }
    }
    await AsyncStorage.setItem('<#Avatars#>', JSON.stringify(avatar_list))
    return true
  } catch (e) {
    ConsoleError(e)
    return false
  }
}

function ParseQrcodeSeed(qrcode) {
  try {
    let json = JSON.parse(qrcode)
    let keypair = oxoKeyPairs.deriveKeypair(json.Seed)
    return { Name: json.Name, Seed: json.Seed }
  } catch (e) {
    ConsoleError(e)
    return false
  }
}

function DHSequence(partition, timestamp, address1, address2) {
  let tmpStr = ''
  if (address1 > address2) {
    tmpStr = address1 + address2
  } else {
    tmpStr = address2 + address1
  }
  let tmpInt = parseInt(HalfSHA512(tmpStr).substring(0, 6), 16)
  let cursor = (tmpInt % partition) * 1000
  let seq = parseInt((timestamp - (Epoch + cursor)) / (partition * 1000))
  return seq
}

function Sign(msg, sk) {
  let msgHexStr = strToHex(msg)
  let sig = oxoKeyPairs.sign(msgHexStr, sk)
  return sig
}

function verifySignature(msg, sig, pk) {
  let hexStrMsg = strToHex(msg)
  try {
    return oxoKeyPairs.verify(hexStrMsg, sig, pk)
  } catch (e) {
    return false
  }
}

function VerifyJsonSignature(json) {
  let sig = json["Signature"]
  delete json["Signature"]
  let tmpMsg = JSON.stringify(json)
  if (verifySignature(tmpMsg, sig, json.PublicKey)) {
    json["Signature"] = sig
    return true
  } else {
    ConsoleWarn('signature invalid...')
    return false
  }
}

function VerifyBulletinJson(bulletin) {
  let content_hash = QuarterSHA512(bulletin.Content)
  let tmp_json = {
    ObjectType: ObjectType.Bulletin,
    Sequence: bulletin.Sequence,
    PreHash: bulletin.PreHash,
    Quote: bulletin.Quote,
    File: bulletin.File,
    ContentHash: content_hash,
    Timestamp: bulletin.Timestamp,
    PublicKey: bulletin.PublicKey,
    Signature: bulletin.Signature
  }
  if (!bulletin.Quote) {
    delete tmp_json.Quote
  }
  if (!bulletin.File) {
    delete tmp_json.File
  }
  return VerifyJsonSignature(tmp_json)
}

function VerifyObjectResponseJson(object_response) {
  let object_string = JSON.stringify(object_response.Object)
  let object_hash = QuarterSHA512(object_string)
  let tmp_json = {
    Action: ActionCode.ObjectResponse,
    ObjectHash: object_hash,
    To: object_response.To,
    Timestamp: object_response.Timestamp,
    PublicKey: object_response.PublicKey,
    Signature: object_response.Signature
  }
  return VerifyJsonSignature(tmp_json)
}

function DeriveAddress(publicKey) {
  return oxoKeyPairs.deriveAddress(publicKey)
}

function DeriveKeypair(seed) {
  return oxoKeyPairs.deriveKeypair(seed)
}

export {
  strToHex,
  HalfSHA512,
  QuarterSHA512,
  encrypt,
  decrypt,
  DeriveAddress,
  DeriveKeypair,
  Sign,
  VerifyJsonSignature,
  VerifyBulletinJson,
  VerifyObjectResponseJson,
  AesEncrypt,
  AesDecrypt,
  MasterKeySet,
  MasterKeyDerive,
  MasterConfig,
  AvatarCreateNew,
  AvatarCreateWithSeed,
  AvatarDerive,
  // AvatarLoginTimeReset,
  AvatarLoginTimeUpdate,
  AvatarNameEdit,
  AvatarRemove,
  ParseQrcodeAddress,
  ParseQrcodeSeed,
  DHSequence
}