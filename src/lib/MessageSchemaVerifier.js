//client schema
//>>>declare<<<
let DeclareSchema = {
  "type": "object",
  "required": ["Action", "Timestamp", "PublicKey", "Signature"],
  "maxProperties": 4,
  "properties": {
    "Action": {
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

let ObjectResponseSchema = {
  "type": "object",
  "required": ["Action", "Object", "To", "Timestamp", "PublicKey", "Signature"],
  "maxProperties": 6,
  "properties": {
    "Action": {
      "type": "number"
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

//>>>bulletin<<<
let BulletinSchema = {
  "type": "object",
  "required": ["ObjectType", "Sequence", "PreHash", "Content", "Timestamp", "PublicKey", "Signature"],
  "maxProperties": 9,
  "properties": {
    "ObjectType": {
      "type": "number"
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
      "minItems": 0,
      "maxItems": 8,
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
      "minItems": 0,
      "maxItems": 8,
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

let BulletinRequestSchema = {
  "type": "object",
  "required": ["Action", "Address", "Sequence", "To", "Timestamp", "PublicKey", "Signature"],
  "maxProperties": 7,
  "properties": {
    "Action": {
      "type": "number"
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

let FileChunkSchema = {
  "type": "object",
  "required": ["ObjectType", "Hash", "Cursor", "Content"],
  "maxProperties": 4,
  "properties": {
    "ObjectType": {
      "type": "number"
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
      "type": "number"
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

let BulletinAddressListResponseSchema = {
  "type": "object",
  "required": ["Action", "Page", "List", "Timestamp", "PublicKey", "Signature"],
  "maxProperties": 6,
  "properties": {
    "Action": {
      "type": "number"
    },
    "Page": {
      "type": "number"
    },
    "List": {
      "type": "array",
      "minItems": 0,
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

let BulletinReplyListResponseSchema = {
  "type": "object",
  "required": ["Action", "Hash", "Page", "List"],
  "maxProperties": 4,
  "properties": {
    "Action": {
      "type": "number"
    },
    "Hash": {
      "type": "string"
    },
    "Page": {
      "type": "number"
    },
    "List": {
      "type": "array",
      "minItems": 0,
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

//>>>chat<<<
let ChatMessageSchema = {
  "type": "object",
  "required": ["Action", "Sequence", "PreHash", "PairHash", "Content", "To", "Timestamp", "PublicKey", "Signature"],
  "maxProperties": 9,
  "properties": {
    "Action": {
      "type": "number"
    },
    "Sequence": {
      "type": "number"
    },
    "PreHash": {
      "type": "string"
    },
    "PairHash": {
      "type": "array",
      "minItems": 0,
      "maxItems": 8,
      "items": {
        "type": "string",
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

let ChatSyncSchema = {
  "type": "object",
  "required": ["Action", "CurrentSequence", "To", "Timestamp", "PublicKey", "Signature"],
  "maxProperties": 6,
  "properties": {
    "Action": {
      "type": "number"
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

let ChatSyncFromServerSchema = {
  "type": "object",
  "required": ["Action", "PairAddress", "CurrentSequence", "Timestamp", "PublicKey", "Signature"],
  "maxProperties": 6,
  "properties": {
    "Action": {
      "type": "number"
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

//ChatDH
let ChatDHSchema = {
  "type": "object",
  "required": ["Action", "Partition", "Sequence", "DHPublicKey", "Pair", "To", "Timestamp", "PublicKey", "Signature"],
  "maxProperties": 9,
  "properties": {
    "Action": {
      "type": "number"
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

//>>>group<<<
//group request
let GroupRequestSchema = {
  "type": "object",
  "required": ["Action", "GroupHash", "GroupManageAction", "To", "Timestamp", "PublicKey", "Signature"],
  "maxProperties": 7,
  "properties": {
    "Action": {
      "type": "number"
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

let GroupManageSyncSchema = {
  "type": "object",
  "required": ["Action", "GroupHash", "CurrentSequence", "To", "Timestamp", "PublicKey", "Signature"],
  "maxProperties": 7,
  "properties": {
    "Action": {
      "type": "number"
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

let GroupDHSchema = {
  "type": "object",
  "required": ["Action", "GroupHash", "DHPublicKey", "Pair", "To", "Timestamp", "PublicKey", "Signature"],
  "maxProperties": 8,
  "properties": {
    "Action": {
      "type": "number"
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

let GroupMessageSyncSchema = {
  "type": "object",
  "required": ["Action", "GroupHash", "Address", "CurrentSequence", "To", "Timestamp", "PublicKey", "Signature"],
  "maxProperties": 8,
  "properties": {
    "Action": {
      "type": "number"
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
let ObjectSchema = {
  "type": "object",
  "required": ["ObjectType", "Address", "Sequence", "Hash"],
  "maxProperties": 4,
  "properties": {
    "ObjectType": {
      "type": "string"
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
//end local schema

let Ajv = require('ajv')
let ajv = new Ajv({ allErrors: true })

//client
let vDeclare = ajv.compile(DeclareSchema)
let vObjectResponseSchema = ajv.compile(ObjectResponseSchema)

let vBulletinRequestSchema = ajv.compile(BulletinRequestSchema)

let vBulletinFileChunkRequest = ajv.compile(BulletinFileChunkRequest)

let vChatMessageSchema = ajv.compile(ChatMessageSchema)
let vChatSyncSchema = ajv.compile(ChatSyncSchema)
let vChatSyncFromServerSchema = ajv.compile(ChatSyncFromServerSchema)
let vChatDHSchema = ajv.compile(ChatDHSchema)

let vGroupManageSyncSchema = ajv.compile(GroupManageSyncSchema)
let vGroupDHSchema = ajv.compile(GroupDHSchema)
let vGroupMessageSyncSchema = ajv.compile(GroupMessageSyncSchema)
let vGroupRequestSchema = ajv.compile(GroupRequestSchema)

function checkJsonSchema(json) {
  if (vObjectResponseSchema(json) || vBulletinRequestSchema(json) || vBulletinFileChunkRequest(json) || vChatMessageSchema(json) || vChatSyncSchema(json) || vChatSyncFromServerSchema(json) || vChatDHSchema(json) || vDeclare(json) || vGroupManageSyncSchema(json) || vGroupDHSchema(json) || vGroupMessageSyncSchema(json) || vGroupRequestSchema(json)) {
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
      console.log(`BulletinAddressListResponse Schema invalid`)
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
      console.log(`BulletinReplyListResponse Schema invalid`)
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
      console.log(`Bulletin schema ok`)
      return true
    } else {
      console.log(`Bulletin schema invalid`)
      return false
    }
  } catch (e) {
    return false
  }
}

let vFileChunkSchema = ajv.compile(FileChunkSchema)

function checkFileChunkSchema(json) {
  try {
    if (vFileChunkSchema(json)) {
      console.log(`File schema ok`)
      return true
    } else {
      console.log(`File schema invalid`)
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
      console.log(`GroupManage schema ok`)
      return true
    } else {
      console.log(`GroupManage schema invalid`)
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
      console.log(`GroupMessage schema ok`)
      return true
    } else {
      console.log(`GroupMessage schema invalid`)
      return false
    }
  } catch (e) {
    return false
  }
}

function checkGroupRequestSchema(json) {
  try {
    if (vGroupRequestSchema(json)) {
      console.log(`GroupRequest schema ok`)
      return true
    } else {
      console.log(`GroupRequest schema invalid`)
      return false
    }
  } catch (e) {
    return false
  }
}

var vFileSchema = ajv.compile(FileSchema)

function deriveJson(str) {
  try {
    let json = JSON.parse(str)
    return json
  } catch (e) {
    console.log(`not a json`)
    return false
  }
}

function checkFileSchema(json) {
  try {
    if (vFileSchema(json)) {
      console.log(`File schema ok`)
      return true
    } else {
      console.log(`File schema invalid`)
      return false
    }
  } catch (e) {
    return false
  }
}

let vObjectSchema = ajv.compile(ObjectSchema)

function checkObjectSchema(json) {
  try {
    if (vObjectSchema(json)) {
      console.log(`Object schema ok`)
      return true
    } else {
      console.log(`Object schema invalid`)
      return false
    }
  } catch (e) {
    return false
  }
}

module.exports = {
  deriveJson,
  checkJsonSchema,
  checkBulletinSchema,
  checkFileChunkSchema,
  checkGroupManageSchema,
  checkGroupRequestSchema,
  checkGroupMessageSchema,
  checkFileSchema,
  checkObjectSchema,
  checkBulletinAddressListResponseSchema,
  checkBulletinReplyListResponseSchema
}
