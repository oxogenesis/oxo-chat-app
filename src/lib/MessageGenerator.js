import { Sign, QuarterSHA512 } from './OXO'
import { ActionCode, ObjectType } from './Const'

export default class MessageGenerator {

  constructor(public_key, private_key) {
    this.PublicKey = public_key
    this.PrivateKey = private_key
  }

  sign(msg) {
    return Sign(msg, this.PrivateKey)
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

  genBulletinRandomRequest() {
    let json = {
      Action: ActionCode.BulletinRandomRequest,
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
    let object_hash = QuarterSHA512(object_string)
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
    quote = JSON.stringify(quote)
    quote = JSON.parse(quote)
    file = JSON.stringify(file)
    file = JSON.parse(file)
    let content_hash = QuarterSHA512(content)
    let tmp_json = {
      ObjectType: ObjectType.Bulletin,
      Sequence: sequence,
      PreHash: pre_hash,
      Quote: quote,
      File: file,
      ContentHash: content_hash,
      Timestamp: timestamp,
      PublicKey: this.PublicKey
    }
    if (quote && quote.length == 0) {
      delete tmp_json["Quote"]
    }
    if (file && file.length == 0) {
      delete tmp_json["File"]
    }
    let sig = this.sign(JSON.stringify(tmp_json))

    let json = {
      ObjectType: ObjectType.Bulletin,
      Sequence: sequence,
      PreHash: pre_hash,
      Quote: quote,
      File: file,
      Content: content,
      Timestamp: timestamp,
      PublicKey: this.PublicKey,
      Signature: sig
    }
    if (quote && quote.length == 0) {
      delete json["Quote"]
    }
    if (file && file.length == 0) {
      delete json["File"]
    }

    return json
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
      ObjectType: ObjectType.ChatDH,
      Partition: partition,
      Sequence: sequence,
      DHPublicKey: ecdh_pk,
      Pair: pair,
      To: address,
      Timestamp: timestamp,
      PublicKey: this.PublicKey
    }
    return JSON.stringify(this.signJson(json))
  }

  genFriendMsgSync(address, sequence) {
    let json = {
      Action: ActionCode.ChatMessageSync,
      CurrentSequence: sequence,
      To: address,
      Timestamp: Date.now(),
      PublicKey: this.PublicKey,
    }
    return JSON.stringify(this.signJson(json))
  }

  genFriendMessage(sequence, pre_hash, ack, content, dest_address, timestamp) {
    ack = JSON.stringify(ack)
    ack = JSON.parse(ack)
    let json = {
      ObjectType: ObjectType.ChatMessage,
      Sequence: sequence,
      PreHash: pre_hash,
      ACK: ack,
      Content: content,
      To: dest_address,
      Timestamp: timestamp,
      PublicKey: this.PublicKey,
    }
    if (ack && ack.length == 0) {
      delete json["ACK"]
    }
    return JSON.stringify(this.signJson(json))
  }

}