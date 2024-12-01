const DefaultHost = 'wss://ru.oxo-chat-server.com'
const DefaultBulletinCacheSize = 0

//1000*60*60*24=86400000
//const Epoch = Date.parse('2011-11-11 11:11:11')
const Epoch = 1320981071000

//const GenesisHash = QuarterSHA512('obeTvR9XDbUwquA6JPQhmbgaCCaiFa2rvf')
const GenesisAddress = 'obeTvR9XDbUwquA6JPQhmbgaCCaiFa2rvf'
const GenesisHash = 'F4C2EB8A3EBFC7B6D81676D79F928D0E'

const MessageInterval = 1000

//constant
const ActionCode = {
  Declare: 100,
  ObjectResponse: 101,

  BulletinRequest: 200,
  // ObjectResponse
  BulletinRandomRequest: 201,
  // ObjectResponse
  BulletinFileChunkRequest: 202,
  // ObjectResponse

  BulletinAddressListRequest: 203,
  BulletinAddressListResponse: 204,

  BulletinReplyListRequest: 205,
  BulletinReplyListResponse: 206,

  ChatMessageSync: 301,
  ChatMessageSyncFromServer: 302,
  ChatFileRequest: 303,
  ChatFileChunkRequest: 304,
  // ObjectResponse

  // GroupRequest: 401,
  // GroupManageSync: 402,
  // GroupDH: 403,
  // GroupMessageSync: 404,
  // GroupFileRequest: 405
}

const ObjectType = {
  Nothing: 0,

  Bulletin: 101,
  BulletinFileChunk: 102,

  ChatDH: 201,
  ChatMessage: 202,
  ChatFile: 203,
  ChatFileChunk: 204,

  // GroupManage: 301,
  // GroupMessage: 302,
  // GroupFileChunk: 303
}

const MessageObjectType = {
  Bulletin: 1,
  ChatFile: 2
}

const DefaultPartition = 90 * 24 * 3600

const FileMaxSize = 16 * 1024 * 1024
const FileChunkSize = 64 * 1024
const BulletinFileExtRegex = /jpg|png|jpeg|txt|md/i
//group
const GroupRequestActionCode = {
  Join: 1,
  Leave: 0
}
const GroupManageActionCode = {
  Dismiss: 0,
  Create: 1,
  MemberApprove: 2, //need Request
  MemberRemove: 3,
  MemberRelease: 4 //need Request
}
const GroupMemberShip = {
  Applying: 0,
  Founder: 1,
  Member: 2,
  Exited: 3
}

const SessionType = {
  Private: 0,
  Group: 1
}

//Bulletin
const BulletinPageSize = 50
const BulletinPreviewSize = 256
const BulletinTabSession = '<BT>'
const BulletinMarkSession = '<BM>'
const BulletinHistorySession = '<BH>'
const BulletinAddressSession = '<BA>'

//Message
const MessagePageSize = 50

export {
  DefaultHost,
  DefaultBulletinCacheSize,
  Epoch,
  GenesisAddress,
  GenesisHash,
  MessageInterval,
  ActionCode,
  DefaultPartition,
  FileMaxSize,
  FileChunkSize,
  BulletinFileExtRegex,
  GroupRequestActionCode,
  GroupManageActionCode,
  GroupMemberShip,
  ObjectType,
  MessageObjectType,
  SessionType,
  BulletinPageSize,
  BulletinPreviewSize,
  BulletinTabSession,
  BulletinMarkSession,
  BulletinHistorySession,
  BulletinAddressSession,
  MessagePageSize
}