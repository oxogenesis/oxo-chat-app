import { Sign } from './OXO'
import {
  DefaultHost,
  Epoch,
  GenesisHash,
  ActionCode,
  DefaultDivision,
  GroupRequestActionCode,
  GroupManageActionCode,
  GroupMemberShip,
  ObjectType,
  SessionType
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

  genDeclare() {
    let json = {
      "Action": ActionCode.Declare,
      "Timestamp": new Date().getTime(),
      "PublicKey": this.PublicKey
    }
    return JSON.stringify(this.signJson(json))
  }

  genBulletinRequest(address, sequence, to) {
    let json = {
      "Action": ActionCode.BulletinRequest,
      "Address": address,
      "Sequence": sequence,
      "To": to,
      "Timestamp": Date.now(),
      "PublicKey": this.PublicKey
    }
    return JSON.stringify(this.signJson(json))
  }

  genObjectResponse(object, to) {
    let json = {
      "Action": ActionCode.ObjectResponse,
      "Object": object,
      "To": to,
      "Timestamp": Date.now(),
      "PublicKey": this.PublicKey,
    }
    return JSON.stringify(this.signJson(json))
  }

  genBulletin(sequence, pre_hash, quote, content, timestamp) {
    let json = {
      "ObjectType": ObjectType.Bulletin,
      "Sequence": sequence,
      "PreHash": pre_hash,
      "Quote": quote,
      "Content": content,
      "Timestamp": timestamp,
      "PublicKey": this.PublicKey
    }
    return this.signJson(json)
  }
}