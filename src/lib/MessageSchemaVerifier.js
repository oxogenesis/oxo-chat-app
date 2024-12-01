const Ajv = require('ajv')
const ajv = new Ajv({ allErrors: true })
const { ActionCode, ObjectType } = require('./Const')
const { ConsoleWarn } = require('./Util')

// client schema
// >>>declare<<<
const DeclareSchema = {
  "type": "object",
  "required": ["Action", "Timestamp", "PublicKey", "Signature"],
  "maxProperties": 5,
  "properties": {
    "Action": {
      "type": "number",
      "const": ActionCode.Declare
    },
    "URL": {
      "type": "string"
    },
    "Timestamp": {
      "type": "number"
    },
    "PublicKey": {
      "type": "string"
    },
    "Signature": {
      "type": "string"
    }
  }
}

const ObjectResponseSchema = {
  "type": "object",
  "required": ["Action", "Object", "To", "Timestamp", "PublicKey", "Signature"],
  "maxProperties": 6,
  "properties": {
    "Action": {
      "type": "number",
      "const": ActionCode.ObjectResponse
    },
    "Object": {
      "type": "object"
    },
    "To": {
      "type": "string"
    },
    "Timestamp": {
      "type": "number"
    },
    "PublicKey": {
      "type": "string"
    },
    "Signature": {
      "type": "string"
    }
  }
}

// >>>bulletin<<<
let BulletinSchema = {
  "type": "object",
  "required": ["ObjectType", "Sequence", "PreHash", "Content", "Timestamp", "PublicKey", "Signature"],
  "maxProperties": 9,
  "properties": {
    "ObjectType": {
      "type": "number",
      "const": ObjectType.Bulletin
    },
    "Sequence": {
      "type": "number"
    },
    "PreHash": {
      "type": "string"
    },
    "Content": {
      "type": "string"
    },
    "Quote": {
      "type": "array",
      "minItems": 1,
      // "maxItems": 8,
      "items": {
        "type": "object",
        "required": ["Address", "Sequence", "Hash"],
        "properties": {
          "Address": { "type": "string" },
          "Sequence": { "type": "number" },
          "Hash": { "type": "string" }
        }
      }
    },
    "File": {
      "type": "array",
      "minItems": 1,
      // "maxItems": 8,
      "items": {
        "type": "object",
        "required": ["Name", "Ext", "Size", "Hash"],
        "properties": {
          "Name": { "type": "string" },
          "Ext": { "type": "string" },
          "Size": { "type": "number" },
          "Hash": { "type": "string" }
        }
      }
    },
    "Timestamp": {
      "type": "number"
    },
    "PublicKey": {
      "type": "string"
    },
    "Signature": {
      "type": "string"
    }
  }
}

const BulletinRandomRequestSchema = {
  "type": "object",
  "required": ["Action", "Timestamp", "PublicKey", "Signature"],
  "maxProperties": 4,
  "properties": {
    "Action": {
      "type": "number",
      "const": ActionCode.BulletinRandomRequest
    },
    "Timestamp": {
      "type": "number"
    },
    "PublicKey": {
      "type": "string"
    },
    "Signature": {
      "type": "string"
    }
  }
}

const BulletinRequestSchema = {
  "type": "object",
  "required": ["Action", "Address", "Sequence", "To", "Timestamp", "PublicKey", "Signature"],
  "maxProperties": 7,
  "properties": {
    "Action": {
      "type": "number",
      "const": ActionCode.BulletinRequest
    },
    "Address": {
      "type": "string"
    },
    "Sequence": {
      "type": "number"
    },
    "To": {
      "type": "string"
    },
    "Timestamp": {
      "type": "number"
    },
    "PublicKey": {
      "type": "string"
    },
    "Signature": {
      "type": "string"
    }
  }
}

const BulletinFileChunkRequestSchema = {
  "type": "object",
  "required": ["Action", "Hash", "Cursor", "To", "Timestamp", "PublicKey", "Signature"],
  "maxProperties": 7,
  "properties": {
    "Action": {
      "type": "number",
      "const": ActionCode.BulletinFileChunkRequest
    },
    "Hash": {
      "type": "string"
    },
    "Cursor": {
      "type": "number"
    },
    "To": {
      "type": "string"
    },
    "Timestamp": {
      "type": "number"
    },
    "PublicKey": {
      "type": "string"
    },
    "Signature": {
      "type": "string"
    }
  }
}

// BulletinCount DESC
const BulletinAddressListRequestSchema = {
  "type": "object",
  "required": ["Action", "Page", "Timestamp", "PublicKey", "Signature"],
  "maxProperties": 5,
  "properties": {
    "Action": {
      "type": "number",
      "const": ActionCode.BulletinAddressListRequest
    },
    "Page": {
      "type": "number"
    },
    "Timestamp": {
      "type": "number"
    },
    "PublicKey": {
      "type": "string"
    },
    "Signature": {
      "type": "string"
    }
  }
}

let BulletinFileChunkSchema = {
  "type": "object",
  "required": ["ObjectType", "Hash", "Cursor", "Content"],
  "maxProperties": 4,
  "properties": {
    "ObjectType": {
      "type": "number",
      "const": ObjectType.BulletinFileChunk
    },
    "Hash": {
      "type": "string"
    },
    "Cursor": {
      "type": "number"
    },
    "Content": {
      "type": "string"
    }
  }
}

let BulletinFileChunkRequest = {
  "type": "object",
  "required": ["Action", "Hash", "Cursor", "To", "Timestamp", "PublicKey", "Signature"],
  "maxProperties": 7,
  "properties": {
    "Action": {
      "type": "number",
      "const": ActionCode.BulletinFileChunkRequest
    },
    "Hash": {
      "type": "string"
    },
    "Cursor": {
      "type": "number"
    },
    "To": {
      "type": "string"
    },
    "Timestamp": {
      "type": "number"
    },
    "PublicKey": {
      "type": "string"
    },
    "Signature": {
      "type": "string"
    }
  }
}

const BulletinAddressListResponseSchema = {
  "type": "object",
  "required": ["Action", "Page", "List", "Timestamp", "PublicKey", "Signature"],
  "maxProperties": 6,
  "properties": {
    "Action": {
      "type": "number",
      "const": ActionCode.BulletinAddressListResponse
    },
    "Page": {
      "type": "number"
    },
    "List": {
      "type": "array",
      "minItems": 1,
      // "maxItems": 8,
      "items": {
        "type": "object",
        "required": ["Address", "Count"],
        "maxProperties": 2,
        "properties": {
          "Address": { "type": "string" },
          "Count": { "type": "number" }
        }
      }
    },
    "Timestamp": {
      "type": "number"
    },
    "PublicKey": {
      "type": "string"
    },
    "Signature": {
      "type": "string"
    }
  }
}

// Timestamp DESC
const BulletinReplyListRequestSchema = {
  "type": "object",
  "required": ["Action", "Hash", "Page", "Timestamp", "PublicKey", "Signature"],
  "maxProperties": 6,
  "properties": {
    "Action": {
      "type": "number",
      "const": ActionCode.BulletinReplyListRequest
    },
    "Hash": {
      "type": "string"
    },
    "Page": {
      "type": "number"
    },
    "Timestamp": {
      "type": "number"
    },
    "PublicKey": {
      "type": "string"
    },
    "Signature": {
      "type": "string"
    }
  }
}

let BulletinReplyListResponseSchema = {
  "type": "object",
  "required": ["Action", "Hash", "Page", "List"],
  "maxProperties": 4,
  "properties": {
    "Action": {
      "type": "number",
      "const": ActionCode.BulletinReplyListResponse
    },
    "Hash": {
      "type": "string"
    },
    "Page": {
      "type": "number"
    },
    "List": {
      "type": "array",
      "minItems": 1,
      // "maxItems": 8,
      "items": {
        "type": "object",
        "required": ["Address", "Sequence", "Hash", "Content", "Timestamp"],
        "maxProperties": 5,
        "properties": {
          "Address": { "type": "string" },
          "Sequence": { "type": "number" },
          "Hash": { "type": "string" },
          "Content": { "type": "string" },
          "Timestamp": { "type": "number" }
        }
      }
    }
  }
}

// >>>chat<<<
// ChatDH
const ChatDHSchema = {
  "type": "object",
  "required": ["ObjectType", "Partition", "Sequence", "DHPublicKey", "Pair", "To", "Timestamp", "PublicKey", "Signature"],
  "maxProperties": 9,
  "properties": {
    "ObjectType": {
      "type": "number",
      "const": ObjectType.ChatDH
    },
    "Partition": {
      "type": "number"
    },
    "Sequence": {
      "type": "number"
    },
    "DHPublicKey": {
      "type": "string"
    },
    "Pair": {
      "type": "string"
    },
    "To": {
      "type": "string"
    },
    "Timestamp": {
      "type": "number"
    },
    "PublicKey": {
      "type": "string"
    },
    "Signature": {
      "type": "string"
    }
  }
}

const ChatMessageSchema = {
  "type": "object",
  "required": ["ObjectType", "Sequence", "PreHash", "Content", "To", "Timestamp", "PublicKey", "Signature"],
  "maxProperties": 9,
  "properties": {
    "ObjectType": {
      "type": "number",
      "const": ObjectType.ChatMessage
    },
    "Sequence": {
      "type": "number"
    },
    "PreHash": {
      "type": "string"
    },
    "ACK": {
      "type": "array",
      "minItems": 1,
      // "maxItems": 8,
      "items": {
        "type": "object",
        "required": ["Sequence", "Hash"],
        "maxProperties": 5,
        "properties": {
          "Sequence": { "type": "number" },
          "Hash": { "type": "string" }
        }
      }
    },
    "Content": {
      "type": "string"
    },
    "To": {
      "type": "string"
    },
    "Timestamp": {
      "type": "number"
    },
    "PublicKey": {
      "type": "string"
    },
    "Signature": {
      "type": "string"
    }
  }
}

const ChatMessageSyncSchema = {
  "type": "object",
  "required": ["Action", "CurrentSequence", "To", "Timestamp", "PublicKey", "Signature"],
  "maxProperties": 6,
  "properties": {
    "Action": {
      "type": "number",
      "const": ActionCode.ChatMessageSync
    },
    "CurrentSequence": {
      "type": "number"
    },
    "To": {
      "type": "string"
    },
    "Timestamp": {
      "type": "number"
    },
    "PublicKey": {
      "type": "string"
    },
    "Signature": {
      "type": "string"
    }
  }
}

let ChatMessageSyncFromServerSchema = {
  "type": "object",
  "required": ["Action", "PairAddress", "CurrentSequence", "Timestamp", "PublicKey", "Signature"],
  "maxProperties": 6,
  "properties": {
    "Action": {
      "type": "number",
      "const": ActionCode.ChatMessageSyncFromServer
    },
    "PairAddress": {
      "type": "string"
    },
    "CurrentSequence": {
      "type": "number"
    },
    "Timestamp": {
      "type": "number"
    },
    "PublicKey": {
      "type": "string"
    },
    "Signature": {
      "type": "string"
    }
  }
}

let ChatFileChunkSchema = {
  "type": "object",
  "required": ["ObjectType", "Hash", "Cursor", "Content"],
  "maxProperties": 4,
  "properties": {
    "ObjectType": {
      "type": "number",
      "const": ObjectType.ChatFileChunk
    },
    "Hash": {
      "type": "string"
    },
    "Cursor": {
      "type": "number"
    },
    "Content": {
      "type": "string"
    }
  }
}

// >>>group<<<
// group request
const GroupRequestSchema = {
  "type": "object",
  "required": ["Action", "GroupHash", "GroupManageAction", "To", "Timestamp", "PublicKey", "Signature"],
  "maxProperties": 7,
  "properties": {
    "Action": {
      "type": "number",
      "const": ActionCode.GroupRequest
    },
    "GroupHash": {
      "type": "string"
    },
    //leave:0
    //join:1
    "GroupManageAction": {
      "type": "number"
    },
    "To": {
      "type": "string"
    },
    "Timestamp": {
      "type": "number"
    },
    "PublicKey": {
      "type": "string"
    },
    "Signature": {
      "type": "string"
    }
  }
}

const GroupManageSyncSchema = {
  "type": "object",
  "required": ["Action", "GroupHash", "CurrentSequence", "To", "Timestamp", "PublicKey", "Signature"],
  "maxProperties": 7,
  "properties": {
    "Action": {
      "type": "number",
      "const": ActionCode.GroupManageSync
    },
    "GroupHash": {
      "type": "string"
    },
    "CurrentSequence": {
      "type": "number"
    },
    "To": {
      "type": "string"
    },
    "Timestamp": {
      "type": "number"
    },
    "PublicKey": {
      "type": "string"
    },
    "Signature": {
      "type": "string"
    }
  }
}

const GroupDHSchema = {
  "type": "object",
  "required": ["Action", "GroupHash", "DHPublicKey", "Pair", "To", "Timestamp", "PublicKey", "Signature"],
  "maxProperties": 8,
  "properties": {
    "Action": {
      "type": "number",
      "const": ActionCode.GroupDH
    },
    "GroupHash": {
      "type": "string"
    },
    "DHPublicKey": {
      "type": "string"
    },
    "Pair": {
      "type": "string"
    },
    "To": {
      "type": "string"
    },
    "Timestamp": {
      "type": "number"
    },
    "PublicKey": {
      "type": "string"
    },
    "Signature": {
      "type": "string"
    }
  }
}

const GroupMessageSyncSchema = {
  "type": "object",
  "required": ["Action", "GroupHash", "Address", "CurrentSequence", "To", "Timestamp", "PublicKey", "Signature"],
  "maxProperties": 8,
  "properties": {
    "Action": {
      "type": "number",
      "const": ActionCode.GroupMessageSync
    },
    "GroupHash": {
      "type": "string"
    },
    "Address": {
      "type": "string"
    },
    "CurrentSequence": {
      "type": "number"
    },
    "To": {
      "type": "string"
    },
    "Timestamp": {
      "type": "number"
    },
    "PublicKey": {
      "type": "string"
    },
    "Signature": {
      "type": "string"
    }
  }
}

let GroupMessageSchema = {
  "type": "object",
  "required": ["GroupHash", "Sequence", "PreHash", "Content", "Timestamp", "PublicKey", "Signature"],
  "maxProperties": 8,
  "properties": {
    "GroupHash": {
      "type": "string"
    },
    "Sequence": {
      "type": "number"
    },
    "PreHash": {
      "type": "string"
    },
    "Confirm": {
      "type": "object",
      "required": ["Address", "Sequence", "Hash"],
      "properties": {
        "Address": { "type": "string" },
        "Sequence": { "type": "number" },
        "Hash": { "type": "string" }
      }
    },
    "Content": {
      "type": "string"
    },
    "Timestamp": {
      "type": "number"
    },
    "PublicKey": {
      "type": "string"
    },
    "Signature": {
      "type": "string"
    }
  }
}
//end client schema










//group control for group admin
let GroupManageSchema = {
  "type": "object",
  "required": ["ObjectType", "GroupHash", "Sequence", "PreHash", "GroupManageAction", "Timestamp", "PublicKey", "Signature"],
  "maxProperties": 9,
  "properties": {
    "ObjectType": {
      "type": "number"
    },
    "GroupHash": {
      "type": "string"
    },
    "Sequence": {
      "type": "number"
    },
    "PreHash": {
      "type": "string"
    },
    //dismiss:0
    //create:1
    //member approve:2   need Request
    //remove member:3    Request = {"Address":address}
    //member release:4   need Request
    "GroupManageAction": {
      "type": "number"
    },
    "Request": {
      "type": "object"
    },
    "Timestamp": {
      "type": "number"
    },
    "PublicKey": {
      "type": "string"
    },
    "Signature": {
      "type": "string"
    }
  }
}

let FileSchema = {
  "type": "object",
  "required": ["Name", "Ext", "Size", "Chunk", "Hash"],
  "maxProperties": 5,
  "properties": {
    "Name": {
      "type": "string"
    },
    "Ext": {
      "type": "string"
    },
    "Size": {
      "type": "number"
    },
    "Chunk": {
      "type": "number"
    },
    "Hash": {
      "type": "string"
    }
  }
}
//end client schema

//local schema
let ObjectBulletinSchema = {
  "type": "object",
  "required": ["ObjectType", "Address", "Sequence", "Hash"],
  "maxProperties": 4,
  "properties": {
    "ObjectType": {
      "type": "number",
      "const": ObjectType.Bulletin
    },
    "Address": {
      "type": "string"
    },
    "Sequence": {
      "type": "number"
    },
    "Hash": {
      "type": "string"
    }
  }
}

let ObjectChatFileSchema = {
  "type": "object",
  "required": ["ObjectType", "Address", "Sequence", "Hash"],
  "maxProperties": 4,
  "properties": {
    "ObjectType": {
      "type": "number",
      "const": ObjectType.ChatFile
    },
    "Name": {
      "type": "string"
    },
    "Size": {
      "type": "number"
    },
    "Hash": {
      "type": "string"
    },
    "EHash": {
      "type": "string"
    }
  }
}
//end local schema


//client
let vDeclare = ajv.compile(DeclareSchema)
let vObjectResponseSchema = ajv.compile(ObjectResponseSchema)

let vBulletinRequestSchema = ajv.compile(BulletinRequestSchema)

let vBulletinFileChunkRequest = ajv.compile(BulletinFileChunkRequest)

let vChatMessageSchema = ajv.compile(ChatMessageSchema)
let vChatMessageSyncSchema = ajv.compile(ChatMessageSyncSchema)
let vChatMessageSyncFromServerSchema = ajv.compile(ChatMessageSyncFromServerSchema)
let vChatDHSchema = ajv.compile(ChatDHSchema)

let vGroupManageSyncSchema = ajv.compile(GroupManageSyncSchema)
let vGroupDHSchema = ajv.compile(GroupDHSchema)
let vGroupMessageSyncSchema = ajv.compile(GroupMessageSyncSchema)
let vGroupRequestSchema = ajv.compile(GroupRequestSchema)

function checkJsonSchema(json) {
  if (vObjectResponseSchema(json) || vBulletinRequestSchema(json) || vBulletinFileChunkRequest(json) || vChatMessageSchema(json) || vChatMessageSyncSchema(json) || vChatMessageSyncFromServerSchema(json) || vChatDHSchema(json) || vDeclare(json) || vGroupManageSyncSchema(json) || vGroupDHSchema(json) || vGroupMessageSyncSchema(json) || vGroupRequestSchema(json)) {
    return true
  } else {
    return false
  }
}

let vBulletinAddressListResponseSchema = ajv.compile(BulletinAddressListResponseSchema)
function checkBulletinAddressListResponseSchema(json) {
  try {
    if (vBulletinAddressListResponseSchema(json)) {
      return true
    } else {
      ConsoleWarn(`BulletinAddressListResponse Schema invalid`)
      return false
    }
  } catch (e) {
    return false
  }
}
let vBulletinReplyListResponseSchema = ajv.compile(BulletinReplyListResponseSchema)
function checkBulletinReplyListResponseSchema(json) {
  try {
    if (vBulletinReplyListResponseSchema(json)) {
      return true
    } else {
      ConsoleWarn(`BulletinReplyListResponse Schema invalid`)
      return false
    }
  } catch (e) {
    return false
  }
}

let vBulletinSchema = ajv.compile(BulletinSchema)

function checkBulletinSchema(json) {
  try {
    if (vBulletinSchema(json)) {
      ConsoleWarn(`Bulletin schema ok`)
      return true
    } else {
      ConsoleWarn(`Bulletin schema invalid`)
      return false
    }
  } catch (e) {
    return false
  }
}

let vBulletinFileChunkSchema = ajv.compile(BulletinFileChunkSchema)

function checkBulletinFileChunkSchema(json) {
  try {
    if (vBulletinFileChunkSchema(json)) {
      ConsoleWarn(`BulletinFileChunk schema ok`)
      return true
    } else {
      ConsoleWarn(`BulletinFileChunk schema invalid`)
      return false
    }
  } catch (e) {
    return false
  }
}

let vChatFileChunkSchema = ajv.compile(ChatFileChunkSchema)

function checkChatFileChunkSchema(json) {
  try {
    if (vChatFileChunkSchema(json)) {
      ConsoleWarn(`ChatFileChunk schema ok`)
      return true
    } else {
      ConsoleWarn(`ChatFileChunk schema invalid`)
      return false
    }
  } catch (e) {
    return false
  }
}

let vGroupManageSchema = ajv.compile(GroupManageSchema)

function checkGroupManageSchema(json) {
  try {
    if (vGroupManageSchema(json)) {
      ConsoleWarn(`GroupManage schema ok`)
      return true
    } else {
      ConsoleWarn(`GroupManage schema invalid`)
      return false
    }
  } catch (e) {
    return false
  }
}

let vGroupMessageSchema = ajv.compile(GroupMessageSchema)

function checkGroupMessageSchema(json) {
  try {
    if (vGroupMessageSchema(json)) {
      ConsoleWarn(`GroupMessage schema ok`)
      return true
    } else {
      ConsoleWarn(`GroupMessage schema invalid`)
      return false
    }
  } catch (e) {
    return false
  }
}

function checkGroupRequestSchema(json) {
  try {
    if (vGroupRequestSchema(json)) {
      ConsoleWarn(`GroupRequest schema ok`)
      return true
    } else {
      ConsoleWarn(`GroupRequest schema invalid`)
      return false
    }
  } catch (e) {
    return false
  }
}

let vObjectBulletinSchema = ajv.compile(ObjectBulletinSchema)
let vObjectChatFileSchema = ajv.compile(ObjectChatFileSchema)

function checkObjectSchema(json) {
  try {
    if (vObjectBulletinSchema(json) || vObjectChatFileSchema(json)) {
      ConsoleWarn(`Object schema ok`)
      return true
    } else {
      ConsoleWarn(`Object schema invalid`)
      return false
    }
  } catch (e) {
    return false
  }
}

function deriveJson(str) {
  try {
    let json = JSON.parse(str)
    return json
  } catch (e) {
    ConsoleWarn(`not a json`)
    return false
  }
}

module.exports = {
  deriveJson,
  checkJsonSchema,
  checkBulletinSchema,
  checkBulletinFileChunkSchema,
  checkGroupManageSchema,
  checkGroupRequestSchema,
  checkGroupMessageSchema,
  checkObjectSchema,
  checkBulletinAddressListResponseSchema,
  checkBulletinReplyListResponseSchema,
  checkChatFileChunkSchema
}
