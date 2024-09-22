import { Sign, quarterSHA512 } from './OXO'
import {
  ActionCode,
  ObjectType
} from './Const'

export default class MessageGenerator {

  constructor(public_key, private_key) {
    this.PublicKey = public_key
    this.PrivateKey = private_key
  }

  signJson(json) {
    let sig = Sign(JSON.stringify(json), this.PrivateKey)
    json.Signature = sig
    return json
  }

  genQrcode(server) {
    let json = {
      Relay: server,
      Timestamp: Date.now(),
      PublicKey: this.PublicKey
    }
    return JSON.stringify(this.signJson(json))
  }

  genDeclare() {
    let json = {
      Action: ActionCode.Declare,
      Timestamp: Date.now(),
      PublicKey: this.PublicKey
    }
    return JSON.stringify(this.signJson(json))
  }

  genBulletinRandom() {
    let json = {
      Action: ActionCode.BulletinRandom,
      Timestamp: Date.now(),
      PublicKey: this.PublicKey
    }
    return JSON.stringify(this.signJson(json))
  }

  genBulletinAddressListRequest(page) {
    let json = {
      Action: ActionCode.BulletinAddressListRequest,
      Page: page,
      Timestamp: Date.now(),
      PublicKey: this.PublicKey
    }
    return JSON.stringify(this.signJson(json))
  }

  genBulletinReplyListRequest(hash, page) {
    let json = {
      Action: ActionCode.BulletinReplyListRequest,
      Hash: hash,
      Page: page,
      Timestamp: Date.now(),
      PublicKey: this.PublicKey
    }
    return JSON.stringify(this.signJson(json))
  }

  genBulletinRequest(address, sequence, to) {
    let json = {
      Action: ActionCode.BulletinRequest,
      Address: address,
      Sequence: sequence,
      To: to,
      Timestamp: Date.now(),
      PublicKey: this.PublicKey
    }
    return JSON.stringify(this.signJson(json))
  }

  genBulletinFileChunkRequest(hash, cursor, to) {
    let json = {
      Action: ActionCode.BulletinFileChunkRequest,
      Hash: hash,
      Cursor: cursor,
      To: to,
      Timestamp: Date.now(),
      PublicKey: this.PublicKey
    }
    return JSON.stringify(this.signJson(json))
  }

  genObjectResponse(object, to) {
    let object_string = JSON.stringify(object)
    let object_hash = quarterSHA512(object_string)
    let tmp_json = {
      Action: ActionCode.ObjectResponse,
      ObjectHash: object_hash,
      To: to,
      Timestamp: Date.now(),
      PublicKey: this.PublicKey
    }
    tmp_json = this.signJson(tmp_json)
    let json = {
      Action: ActionCode.ObjectResponse,
      Object: object,
      To: to,
      Timestamp: Date.now(),
      PublicKey: this.PublicKey,
      Signature: tmp_json.Signature
    }
    return JSON.stringify(json)
  }

  // not a message, a bulletin string
  genBulletinJson(sequence, pre_hash, quote, file, content, timestamp) {
    let json = {
      ObjectType: ObjectType.Bulletin,
      Sequence: sequence,
      PreHash: pre_hash,
      Quote: quote,
      File: file,
      Content: content,
      Timestamp: timestamp,
      PublicKey: this.PublicKey
    }
    if (quote == []) {
      delete json["Quote"]
    }
    if (file == []) {
      delete json["File"]
    }
    return this.signJson(json)
  }

  // not a message
  genBulletinFileChunkJson(hash, cursor, content) {
    let json = {
      ObjectType: ObjectType.BulletinFileChunk,
      Hash: hash,
      Cursor: cursor,
      Content: content
    }
    return json
  }

  //Chat
  genFriendECDHRequest(partition, sequence, ecdh_pk, pair, address, timestamp) {
    let json = {
      Action: ActionCode.ChatDH,
      Partition: partition,
      Sequence: sequence,
      DHPublicKey: ecdh_pk,
      Pair: pair,
      To: address,
      Timestamp: timestamp,
      PublicKey: this.PublicKey
    }
    // console.log(json)
    return JSON.stringify(this.signJson(json))
  }

  genFriendSync(current_sequence, sour_address) {
    let json = {
      Action: ActionCode.ChatSync,
      CurrentSequence: current_sequence,
      To: sour_address,
      Timestamp: Date.now(),
      PublicKey: this.PublicKey,
    }
    // console.log(json)
    return JSON.stringify(this.signJson(json))
  }

  genFriendMessage(sequence, pre_hash, pair_hash, content, dest_address, timestamp) {
    let json = {
      Action: ActionCode.ChatMessage,
      Sequence: sequence,
      PreHash: pre_hash,
      PairHash: pair_hash,
      Content: content,
      To: dest_address,
      Timestamp: timestamp,
      PublicKey: this.PublicKey,
    }
    // console.log(json)
    return JSON.stringify(this.signJson(json))
  }

}