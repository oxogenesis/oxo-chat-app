import crypto from 'crypto'
import { actionType } from './actionType'
import { call, put, select, take, cancelled, fork } from 'redux-saga/effects'
import { eventChannel, END } from 'redux-saga'

import { DefaultHost, Epoch, GenesisHash, ActionCode, DefaultDivision, GroupRequestActionCode, GroupManageActionCode, GroupMemberShip, ObjectType, SessionType, BulletinPageSize, BulletinHistorySession, BulletinMarkSession, BulletinAddressSession } from '../../lib/Const'
import { deriveJson, checkJsonSchema, checkBulletinSchema, checkFileSchema, checkFileChunkSchema } from '../../lib/MessageSchemaVerifier'
import { DHSequence, AesEncrypt, AesDecrypt } from '../../lib/OXO'

import { DeriveKeypair, DeriveAddress, VerifyJsonSignature, quarterSHA512 } from '../../lib/OXO'
import Database from '../../lib/Database'
import MessageGenerator from '../../lib/MessageGenerator'

const SettingJson = { "BulletinCacheSize": 0 }

function DelayExec(ms) {
  return new Promise(resolve => {
    setTimeout(resolve, ms)
  })
}

function Array2Str(array) {
  let tmpArray = []
  for (let i = array.length - 1; i >= 0; i--) {
    tmpArray.push(`'${array[i]}'`)
  }
  return tmpArray.join(',')
}

// WebSocket
function createWebSocket(url) {
  // console.log(`======================================================createWebSocket`)
  return new Promise((resolve, reject) => {
    let ws = new WebSocket(url)
    ws.onopen = () => {
      // console.log(`======================================================createWebSocket-open`)
      resolve(ws)
    }
    ws.onerror = (error) => {
      //{"isTrusted": false, "message": "Connection reset"}
      //TODO: catch this error
      // console.log(`======================================================createWebSocket-error`)
      // console.log(error)
      reject(error)
    }
  })
}

function createWebSocketChannel(ws) {
  return eventChannel(emit => {
    // Pass websocket messages straight though
    ws.onmessage = (event) => {
      console.log(`======================================================onmessage`)
      emit(event.data)
    }

    // Close the channel as appropriate
    ws.onclose = () => {
      emit(END)
    }

    const unsubscribe = () => {
      ws.onmessage = null
    }
    return unsubscribe
  })
}

export function* Conn(action) {

  // Get some basics together
  const state = yield select()
  const MessageGenerator = state.avatar.get('MessageGenerator')
  const CurrentHost = state.avatar.get('CurrentHost')
  const Address = state.avatar.get('Address')

  if (CurrentHost == null) {
    return
  }

  // console.log(`======================================================${CurrentHost}`)
  // console.log(`======================================================Conn`)
  try {

    // Make our connection
    let ws = yield call(createWebSocket, CurrentHost)
    let channel = yield call(createWebSocketChannel, ws)

    yield put({ type: actionType.avatar.setWebSocketChannel, channel: channel })

    if (ws.readyState == WebSocket.OPEN) {
      let msg = MessageGenerator.genDeclare()
      ws.send(msg)
      yield put({ type: actionType.avatar.setWebSocket, websocket: ws })
    }

    // Handle messages as they come in
    while (true) {
      // console.log(`======================================================yield take(channel)`)
      let payload = yield take(channel)
      let json = JSON.parse(payload)
      console.log(json)
      //save bulletin from server cache
      if (json.ObjectType == ObjectType.Bulletin && checkBulletinSchema(json)) {
        let address = DeriveAddress(json.PublicKey)
        yield put({ type: actionType.avatar.SaveBulletin, relay_address: address, bulletin_json: json })
      }

      //handle message send To me
      else if (checkJsonSchema(json)) {
        //check receiver is me
        if (json.To != Address) {
          console.log('receiver is not me...')
        }

        //verify signature
        else if (VerifyJsonSignature(json) == true) {
          switch (json.Action) {
            case ActionCode.ChatDH:
              yield put({ type: actionType.avatar.HandleFriendECDH, json: json })
              break
            case ActionCode.ChatMessage:
              yield put({ type: actionType.avatar.HandleFriendMessage, json: json })
              break
            case ActionCode.ChatSync:
              yield put({ type: actionType.avatar.HandleFriendSync, json: json })
              break
            case ActionCode.BulletinRequest:
              yield put({ type: actionType.avatar.HandleBulletinRequest, json: json })
              break
            // case ActionCode.BulletinFileRequest:
            //   console.log('HandleBulletinFileRequest(json)')
            //   break
            // case ActionCode.PrivateFileRequest:
            //   console.log('HandlePrivateFileRequest(json)')
            //   break
            // case ActionCode.GroupFileRequest:
            //   console.log('HandleGroupFileRequest(json)')
            //   break
            case ActionCode.ObjectResponse:
              let address = DeriveAddress(json.PublicKey)
              let objectJson = json.Object
              if (objectJson.ObjectType == ObjectType.Bulletin && checkBulletinSchema(objectJson)) {
                yield put({ type: actionType.avatar.SaveBulletin, relay_address: address, bulletin_json: objectJson })
              }
              // else if (objectJson.ObjectType == ObjectType.BulletinFile && checkFileChunkSchema(objectJson)) {
              //   console.log('SaveBulletinFile(address, objectJson)')
              // } else if (objectJson.ObjectType == ObjectType.PrivateFile && checkFileChunkSchema(objectJson)) {
              //   console.log('SavePrivateFile(address, objectJson)')
              // } else if (objectJson.ObjectType == ObjectType.GroupFile && checkFileChunkSchema(objectJson)) {
              //   console.log('SaveGroupFile(address, objectJson)')
              // } else if (objectJson.ObjectType == ObjectType.GroupManage && checkGroupManageSchema(objectJson)) {
              //   console.log('SaveGroupManage(address, objectJson)')
              // } else if (objectJson.ObjectType == ObjectType.GroupMessage) {
              //   console.log('SaveGroupMessage(address, objectJson)')
              // }
              break
            // case ActionCode.GroupRequest:
            //   console.log('HandleGroupRequest(json)')
            //   break
            // case ActionCode.GroupManageSync:
            //   console.log('HandleGroupManageSync(json)')
            //   break
            // case ActionCode.GroupDH:
            //   console.log('HandleGroupDH(json)')
            //   break
            // case ActionCode.GroupMessageSync:
            //   console.log('HandleGroupMessageSync(json)')
            //   break
            default:
              break
          }
        }
      } else {
        console.log("======================================================json schema invalid...")
        console.log(payload)
        console.log(json)
      }
      //yield put(nowPlayingUpdate(stationName, artist, title, artUrl))
    }
  } catch (error) {
    // console.log(`======================================================Conn-catch`)
    // console.log(error)
    // let regx = /^failed to connect to/
    // let rs = regx.exec(error.message)
    // if (rs != null) {
    //   console.log(`====================================================yield put(Conn)`)
    //   yield put({ type: actionType.avatar.Conn })
    // }
    //{"isTrusted": false, "message": "failed to connect to /127.0.0.1 (port 3000) from /10.0.2.15 (port 36216) after 10000ms"}
  } finally {
    // Clean up the connection
    // console.log(`======================================================Conn-finally`)
    if (typeof channel !== 'undefined') {
      channel.close()
    }
    if (typeof ws !== 'undefined') {
      ws.close()
    }
    yield call(DelayExec, 10 * 1000)
    yield put({ type: actionType.avatar.Conn })
    // console.log(`======================================================reconnect`)
    // if (yield cancelled()) {
    //   console.log(`================================================Conn-cancelled`)
    //   if (typeof channel !== 'undefined') {
    //     channel.close()
    //   }
    //   if (typeof ws !== 'undefined') {
    //     ws.close()
    //   }
    // } else {
    // }
  }
}

export function* SendMessage(action) {
  console.log(action)
  let ws = yield select(state => state.avatar.get('WebSocket'))
  if (ws != null && ws.readyState == WebSocket.OPEN) {
    ws.send(action.message)
  }
}

// Avatar
export function* enableAvatar(action) {
  let keypair = DeriveKeypair(action.seed)
  let address = DeriveAddress(keypair.publicKey)
  yield put({ type: actionType.avatar.setAvatar, seed: action.seed, name: action.name, address: address, public_key: keypair.publicKey, private_key: keypair.privateKey })


  let db = new Database()

  yield call([db, db.initDB], address, '0.0.1', address, 0)
  yield put({ type: actionType.avatar.setDatabase, db: db })

  let sql = 'SELECT * FROM SETTINGS LIMIT 1'
  let setting = yield call([db, db.getOne], sql)
  if (setting != null) {
    setting = JSON.parse(setting)
  } else {
    setting = SettingJson
  }
  yield put({ type: actionType.avatar.setSetting, setting: setting })

  sql = 'SELECT * FROM ADDRESS_MARKS ORDER BY updated_at DESC'
  let items = yield call([db, db.getAll], sql)
  let address_map = {}
  items.forEach(item => {
    address_map[item.address] = item.name
  })
  address_map[address] = action.name
  yield put({ type: actionType.avatar.setAddressBook, address_map: address_map })

  sql = 'SELECT * FROM FRIENDS ORDER BY updated_at DESC'
  items = yield call([db, db.getAll], sql)
  let friend_list = []
  items.forEach(item => {
    friend_list.push(item.address)
  })
  yield put({ type: actionType.avatar.setFriends, friend_list: friend_list })

  sql = 'SELECT * FROM FOLLOWS ORDER BY updated_at DESC'
  items = yield call([db, db.getAll], sql)
  let follow_list = []
  items.forEach(item => {
    follow_list.push(item.address)
  })
  yield put({ type: actionType.avatar.setFollows, follow_list: follow_list })

  sql = 'SELECT * FROM HOSTS ORDER BY updated_at DESC'
  items = yield call([db, db.getAll], sql)
  let hosts = []
  items.forEach(item => {
    hosts.push({ Address: item.address, UpdatedAt: item.updated_at })
  })
  if (hosts.length == 0) {
    hosts.push({ Address: DefaultHost, UpdatedAt: Date.now() })
  }
  yield put({ type: actionType.avatar.setHosts, hosts: hosts })

  let current_host = hosts[0].Address || DefaultHost
  yield put({ type: actionType.avatar.setCurrentHost, current_host: current_host })

  let mg = new MessageGenerator(keypair.publicKey, keypair.privateKey)
  yield put({ type: actionType.avatar.setMessageGenerator, message_generator: mg })

  yield put({ type: actionType.avatar.Conn })

  yield put({ type: actionType.avatar.UpdateFollowBulletin })

  // LoadSessionList
  sql = `SELECT * FROM MESSAGES GROUP BY sour_address`
  let recent_message_receive = []
  items = yield call([db, db.getAll], sql)
  items.forEach(message => {
    recent_message_receive.push({
      Address: message.sour_address,
      Timestamp: message.timestamp,
      Content: message.content
    })
  })

  sql = `SELECT * FROM MESSAGES GROUP BY dest_address`
  let recent_message_send = []
  items = yield call([db, db.getAll], sql)
  items.forEach(message => {
    recent_message_send.push({
      Address: message.dest_address,
      Timestamp: message.timestamp,
      Content: message.content
    })
  })

  let session_map = {}
  friend_list.forEach(follow => {
    session_map[follow] = { Address: follow, Timestamp: Epoch, Content: '', CountUnread: 0 }
  })
  recent_message_receive.forEach(message => {
    if (message && session_map[message.Address]) {
      session_map[message.Address].Timestamp = message.Timestamp
      session_map[message.Address].Content = message.Content
    }
  })
  recent_message_send.forEach(message => {
    if (message && session_map[message.Address] && message.Timestamp > session_map[message.Address].Timestamp) {
      session_map[message.Address].Timestamp = message.Timestamp
      session_map[message.Address].Content = message.Content
    }
  })
  yield put({ type: actionType.avatar.setSessionMap, session_map: session_map })
}

export function* disableAvatar() {
  let db = yield select(state => state.avatar.get('Database'))
  let setting = yield select(state => state.avatar.get('Setting'))
  let follow_list = yield select(state => state.avatar.get('Follows'))
  // 清理多余缓存公告
  if (setting.BulletinCacheSize != 0) {
    //TODO
    // yield call([db, db.limitBulletinCache], setting.BulletinCacheSize, Array2Str(follow_list))
  }
  yield call([db, db.closeDB])
  yield put({ type: actionType.avatar.resetAvatar })
}

export function* setBulletinCacheSize(action) {
  let db = yield select(state => state.avatar.get('Database'))
  let setting = yield select(state => state.avatar.get('Setting'))
  setting.BulletinCacheSize = action.cache_size
  console.log(setting)
  let sql = `UPDATE SETTINGS SET settings = ${JSON.stringify(setting)} WHERE updated_at = "${Date.now()}"`
  yield call([db, db.runSQL], sql)
  yield put({ type: actionType.avatar.setSetting, setting: setting })
}

// AddressBook
export function* addAddressMark(action) {
  let timestamp = Date.now()
  let db = yield select(state => state.avatar.get('Database'))
  let sql = `INSERT INTO ADDRESS_MARKS (address, name, created_at, updated_at)
VALUES ('${action.address}', '${action.name}', ${timestamp}, ${timestamp})`
  yield call([db, db.runSQL], sql)
  let address_map = yield select(state => state.avatar.get('AddressMap'))
  address_map[action.address] = action.name
  yield put({ type: actionType.avatar.setAddressBook, address_map: address_map })
}

export function* delAddressMark(action) {
  let db = yield select(state => state.avatar.get('Database'))
  let sql = `DELETE FROM ADDRESS_MARKS WHERE address = "${action.address}"`
  yield call([db, db.runSQL], sql)
  let address_map = yield select(state => state.avatar.get('AddressMap'))
  address_map[action.address] = null
  yield put({ type: actionType.avatar.setAddressBook, address_map: address_map })
}

export function* saveAddressName(action) {
  let timestamp = Date.now()
  let db = yield select(state => state.avatar.get('Database'))
  let sql = `UPDATE ADDRESS_MARKS SET name = '${action.name}', updated_at = ${timestamp} WHERE address = "${action.address}"`
  yield call([db, db.runSQL], sql)
  let address_map = yield select(state => state.avatar.get('AddressMap'))
  address_map[action.address] = action.name
  yield put({ type: actionType.avatar.setAddressBook, address_map: address_map })
}

// Friend
export function* addFriend(action) {
  let db = yield select(state => state.avatar.get('Database'))
  let timestamp = Date.now()
  let sql = `INSERT INTO FRIENDS (address, created_at, updated_at)
VALUES ('${action.address}', ${timestamp}, ${timestamp})`
  yield call([db, db.runSQL], sql)
  let friend_list = yield select(state => state.avatar.get('Friends'))
  friend_list.push(action.address)
  yield put({ type: actionType.avatar.setFriends, friend_list: friend_list })

  //刷新当前AddressMark
  let current_address_mark = yield select(state => state.avatar.get('CurrentAddressMark'))
  if (current_address_mark || action.address == current_address_mark.Address) {
    yield put({ type: actionType.avatar.setCurrentAddressMark, address: action.address })
  }

  //刷新会话列表
  let session_map = yield select(state => state.avatar.get('SessionMap'))
  session_map[action.address] = { Address: action.address, Timestamp: timestamp, Content: '', CountUnread: 0 }
  yield put({ type: actionType.avatar.setSessionMap, session_map: session_map })
}

export function* delFriend(action) {
  let db = yield select(state => state.avatar.get('Database'))
  let sql = `DELETE FROM FRIENDS WHERE address = "${action.address}"`
  yield call([db, db.runSQL], sql)
  let friend_list = yield select(state => state.avatar.get('Friends'))
  friend_list = friend_list.filter((item) => item != action.address)
  yield put({ type: actionType.avatar.setFriends, friend_list: friend_list })

  //刷新当前AddressMark
  let current_address_mark = yield select(state => state.avatar.get('CurrentAddressMark'))
  if (current_address_mark || action.address == current_address_mark.Address) {
    yield put({ type: actionType.avatar.setCurrentAddressMark, address: action.address })
  }

  //清除聊天痕迹
  sql = `DELETE FROM MESSAGES WHERE sour_address = "${action.address}" OR dest_address = "${action.address}"`
  yield call([db, db.runSQL], sql)
  sql = `DELETE FROM ECDHS WHERE address = "${action.address}"`
  yield call([db, db.runSQL], sql)

  //刷新会话列表
  let session_map = yield select(state => state.avatar.get('SessionMap'))
  delete session_map[action.address]
  yield put({ type: actionType.avatar.setSessionMap, session_map: session_map })
}

// Follow
export function* addFollow(action) {
  let db = yield select(state => state.avatar.get('Database'))
  let timestamp = Date.now()
  let sql = `INSERT INTO FOLLOWS (address, created_at, updated_at)VALUES ('${action.address}', ${timestamp}, ${timestamp})`
  yield call([db, db.runSQL], sql)
  let follow_list = yield select(state => state.avatar.get('Follows'))
  follow_list.push(action.address)
  yield put({ type: actionType.avatar.setFollows, follow_list: follow_list })

  //刷新当前AddressMark
  let current_address_mark = yield select(state => state.avatar.get('CurrentAddressMark'))
  if (current_address_mark || action.address == current_address_mark.Address) {
    yield put({ type: actionType.avatar.setCurrentAddressMark, address: action.address })
  }

  //更新Bulletin的is_cache
  sql = `UPDATE BULLETINS SET is_cache = "FALSE" WHERE address = "${action.address}"`
  yield call([db, db.runSQL], sql)
}

export function* delFollow(action) {
  let db = yield select(state => state.avatar.get('Database'))
  let sql = `DELETE FROM FOLLOWS WHERE address = "${action.address}"`
  yield call([db, db.runSQL], sql)
  let follow_list = yield select(state => state.avatar.get('Follows'))
  follow_list = follow_list.filter((item) => item != action.address)
  yield put({ type: actionType.avatar.setFollows, follow_list: follow_list })

  //刷新当前AddressMark
  let current_address_mark = yield select(state => state.avatar.get('CurrentAddressMark'))
  if (current_address_mark || action.address == current_address_mark.Address) {
    yield put({ type: actionType.avatar.setCurrentAddressMark, address: action.address })
  }

  //更新Bulletin的is_cache
  sql = `UPDATE BULLETINS SET is_cache = "TRUE" WHERE address = "${action.address}"`
  yield call([db, db.runSQL], sql)
}

// Host
export function* addHost(action) {
  let db = yield select(state => state.avatar.get('Database'))
  let timestamp = Date.now()
  let sql = `INSERT INTO HOSTS (address, updated_at)
VALUES ('${action.host}', ${timestamp})`
  yield call([db, db.runSQL], sql)

  sql = 'SELECT * FROM HOSTS ORDER BY updated_at DESC'
  let items = yield call([db, db.getAll], sql)
  let hosts = []
  items.forEach(item => {
    hosts.push({ Address: item.address, UpdatedAt: item.updated_at })
  })
  if (hosts.length == 0) {
    hosts.push({ Address: DefaultHost, UpdatedAt: Date.now() })
  }
  yield put({ type: actionType.avatar.setHosts, hosts: hosts })

  yield put({ type: actionType.avatar.setCurrentHost, current_host: action.host })
}

export function* delHost(action) {
  let db = yield select(state => state.avatar.get('Database'))
  let sql = `DELETE FROM HOSTS WHERE address = "${action.host}"`
  yield call([db, db.runSQL], sql)
  let hosts = yield select(state => state.avatar.get('Hosts'))
  hosts = hosts.filter((item) => item.Address != action.host)
  yield put({ type: actionType.avatar.setHosts, hosts: hosts })
}

export function* changeCurrentHost(action) {
  let db = yield select(state => state.avatar.get('Database'))
  let sql = `UPDATE HOSTS SET updated_at = ${Date.now()} WHERE address = "${action.host}"`
  yield call([db, db.runSQL], sql)

  let channel = yield select(state => state.avatar.get('WebSocketChannel'))
  let ws = yield select(state => state.avatar.get('WebSocket'))

  // let wm = yield select(state => state.avatar.get('WebSocketManager'))
  // wm.initConn(action.host)
  yield put({ type: actionType.avatar.setCurrentHost, current_host: action.host })
  // let ws = yield select(state => state.avatar.get('WebSocketChannel'))
  // console.log(`=====================================================================changeCurrentHost`)
  // console.log(ws)
  if (ws != null) {
    yield call([ws, ws.close])
  }
  yield put({ type: actionType.avatar.Conn })
}

// Bulletin
export function* HandleBulletinRequest(action) {
  console.log(`===================================================================HandleBulletinRequest`)
  console.log(action.json)
  let MessageGenerator = yield select(state => state.avatar.get('MessageGenerator'))
  let json = action.json
  let address = DeriveAddress(json.PublicKey)
  let db = yield select(state => state.avatar.get('Database'))
  let sql = `SELECT * FROM BULLETINS WHERE address = "${json.Address}" AND sequence = ${json.Sequence} LIMIT 1`
  let item = yield call([db, db.getOne], sql)
  if (item != null) {
    let bulletin = JSON.parse(item.json)
    let msg = MessageGenerator.genObjectResponse(bulletin, address)
    yield put({ type: actionType.avatar.SendMessage, message: msg })
  }
}

export function* LoadCurrentBulletin(action) {
  let db = yield select(state => state.avatar.get('Database'))
  let sql = `SELECT * FROM BULLETINS WHERE hash = "${action.hash}" LIMIT 1`
  let item = yield call([db, db.getOne], sql)
  if (item != null) {
    let bulletin = {
      "Address": item.address,
      "Timestamp": item.timestamp,
      "CreateAt": item.created_at,
      "Sequence": item.sequence,
      "Content": item.content,
      "Hash": item.hash,
      "QuoteSize": item.quote_size,
      "ViewAt": item.view_at,
      "IsCache": item.is_cache,
      "IsMark": item.is_mark,

      "PreHash": item.pre_hash,
      "QuoteList": []
    }
    if (item.QuoteSize != 0) {
      let json = JSON.parse(item.json)
      bulletin.QuoteList = json.Quote
    }

    yield put({ type: actionType.avatar.setCurrentBulletin, bulletin: bulletin })
    sql = `UPDATE BULLETINS SET view_at = ${Date.now()} WHERE hash = "${action.hash}"`
    yield call([db, db.runSQL], sql)

    let quote_white_list = yield select(state => state.avatar.get('QuoteWhiteList'))
    for (const quote of bulletin.QuoteList) {
      if (!quote_white_list.includes(quote.Hash)) {
        quote_white_list.push(quote.Hash)
      }
    }
    quote_white_list = quote_white_list.filter((item) => item != bulletin.Hash)
    yield put({ type: actionType.avatar.setQuoteWhiteList, quote_white_list: quote_white_list })
  } else {
    //fetch from network
    //action[address, sequence, to]
    console.log(action)
    yield put({ type: actionType.avatar.FetchBulletin, address: action.address, sequence: action.sequence, to: action.to })
  }
}

export function* clearBulletinCache() {
  let db = yield select(state => state.avatar.get('Database'))
  let follow_list = yield select(state => state.avatar.get('Follows'))
  let address_list = Array2Str(follow_list)
  let sql = `DELETE FROM BULLETINS WHERE is_mark = "FALSE"`
  if (address_list != "") {
    sql = `DELETE FROM BULLETINS WHERE is_mark = "FALSE" AND address NOT IN (${address_list})`
  }
  yield call([db, db.runSQL], sql)
}

export function* PublishBulletin(action) {
  //console.log(`=================================================PublishBulletin`)
  let address = yield select(state => state.avatar.get('Address'))
  let db = yield select(state => state.avatar.get('Database'))
  let sql = `SELECT * FROM BULLETINS WHERE address = "${address}" ORDER BY sequence DESC LIMIT 1`
  let last_bulletin = yield call([db, db.getOne], sql)
  let pre_hash = GenesisHash
  let next_sequence = 1
  if (last_bulletin != null) {
    pre_hash = last_bulletin.hash
    next_sequence = last_bulletin.sequence + 1
  }
  let quote_list = yield select(state => state.avatar.get('QuoteList'))
  let MessageGenerator = yield select(state => state.avatar.get('MessageGenerator'))
  let timestamp = Date.now()
  let bulletin_json = MessageGenerator.genBulletinJson(next_sequence, pre_hash, quote_list, action.content, timestamp)
  let str_bulletin = JSON.stringify(bulletin_json)
  let hash = quarterSHA512(str_bulletin)
  let is_file = false
  let file_saved = false
  sql = `INSERT INTO BULLETINS (address, sequence, pre_hash, content, timestamp, json, created_at, hash, quote_size, is_file, file_saved, relay_address, is_cache)
VALUES ('${address}', ${next_sequence}, '${bulletin_json.PreHash}', '${bulletin_json.Content}', '${bulletin_json.Timestamp}', '${str_bulletin}', ${timestamp}, '${hash}', ${bulletin_json.Quote.length}, '${is_file}', '${file_saved}', '${address}', 'FALSE')`
  yield call([db, db.runSQL], sql)

  yield put({ type: actionType.avatar.setQuoteList, quote_list: [] })

  let msg = MessageGenerator.genObjectResponse(bulletin_json, address)
  yield put({ type: actionType.avatar.SendMessage, message: msg })
}

export function* SaveBulletin(action) {
  let bulletin_json = action.bulletin_json
  let relay_address = action.relay_address

  let object_address = DeriveAddress(bulletin_json.PublicKey)
  let strJson = JSON.stringify(bulletin_json)
  let hash = quarterSHA512(strJson)

  if (VerifyJsonSignature(bulletin_json) == true) {
    let timestamp = Date.now()
    let db = yield select(state => state.avatar.get('Database'))
    let follow_list = yield select(state => state.avatar.get('Follows'))
    let quote_white_list = yield select(state => state.avatar.get('QuoteWhiteList'))

    console.log(quote_white_list)

    //check is_file?
    let is_file = false
    let file_saved = false
    let fileJson = null
    let fileSHA1 = null

    //WTF:is_file = 'false', not is_file = false

    if (follow_list.includes(object_address)) {
      //bulletin from follow
      let sql = `INSERT INTO BULLETINS (address, sequence, pre_hash, content, timestamp, json, created_at, hash, quote_size, is_file, file_saved, relay_address, is_cache)
VALUES ('${object_address}', ${bulletin_json.Sequence}, '${bulletin_json.PreHash}', '${bulletin_json.Content}', '${bulletin_json.Timestamp}', '${strJson}', ${timestamp}, '${hash}', ${bulletin_json.Quote.length}, '${is_file}', '${file_saved}', '${relay_address}', 'FALSE')`

      //save bulletin
      yield call([db, db.runSQL], sql)
      let bulletin = {
        "Address": object_address,
        "Timestamp": bulletin_json.Timestamp,
        "CreatedAt": timestamp,
        'Sequence': bulletin_json.Sequence,
        "Content": bulletin_json.Content,
        "Hash": hash,
        "QuoteSize": bulletin_json.Quote.length,
        "IsMark": false
      }
      //刷新TabBulletin页
      let tab_bulletin_list = yield select(state => state.avatar.get('TabBulletinList'))
      tab_bulletin_list.unshift(bulletin)
      yield put({ type: actionType.avatar.setTabBulletinList, tab_bulletin_list: tab_bulletin_list })

      let current_BB_session = yield select(state => state.avatar.get('CurrentBBSession'))
      if (current_BB_session == object_address) {
        let bulletin_list = yield select(state => state.avatar.get('BulletinList'))
        // 刷新FollowBulletinList页
        bulletin_list.unshift(bulletin)
        yield put({ type: actionType.avatar.setBulletinList, bulletin_list: bulletin_list })
      }
      yield put({ type: actionType.avatar.FetchBulletin, address: object_address, sequence: bulletin_json.Sequence + 1, to: object_address })
    } else if (quote_white_list.includes(hash)) {
      //bulletin from quote
      let sql = `INSERT INTO BULLETINS (address, sequence, pre_hash, content, timestamp, json, created_at, hash, quote_size, is_file, file_saved, relay_address, is_cache)
VALUES ('${object_address}', ${bulletin_json.Sequence}, '${bulletin_json.PreHash}', '${bulletin_json.Content}', '${bulletin_json.Timestamp}', '${strJson}', ${timestamp}, '${hash}', ${bulletin_json.Quote.length}, '${is_file}', '${file_saved}', '${relay_address}', 'TRUE')`

      //save bulletin
      yield call([db, db.runSQL], sql)
      let current_bulletin = yield select(state => state.avatar.get('CurrentBulletin'))
      if (current_bulletin == null) {
        yield put({ type: actionType.avatar.setCurrentBulletin, bulletin: bulletin_json })
      }
    }
  }
}

export function* LoadTabBulletinList(action) {
  let self_address = yield select(state => state.avatar.get('Address'))
  let db = yield select(state => state.avatar.get('Database'))
  let sql = ''
  let bulletin_list = []

  // session_flag?新的列表：延长列表
  if (action.session_flag == true) {
    yield put({ type: actionType.avatar.setTabBulletinList, tab_bulletin_list: [] })
  } else {
    bulletin_list = yield select(state => state.avatar.get('TabBulletinList'))
  }
  let bulletin_list_size = bulletin_list.length

  let follow_list = yield select(state => state.avatar.get('Follows'))
  let address_list = []
  follow_list.forEach(follow => {
    address_list.push(follow)
  })
  address_list.push(self_address)
  sql = `SELECT * FROM BULLETINS WHERE address IN (${Array2Str(address_list)}) ORDER BY timestamp DESC LIMIT ${BulletinPageSize} OFFSET ${bulletin_list_size}`
  let tmp = []
  let items = yield call([db, db.getAll], sql)
  items.forEach(bulletin => {
    tmp.push({
      "Address": bulletin.address,
      "Timestamp": bulletin.timestamp,
      "CreateAt": bulletin.created_at,
      "Sequence": bulletin.sequence,
      "Content": bulletin.content,
      "Hash": bulletin.hash,
      "QuoteSize": bulletin.quote_size,
      "IsMark": bulletin.is_mark
    })
  })
  if (tmp.length != 0) {
    bulletin_list = bulletin_list.concat(tmp)
    yield put({ type: actionType.avatar.setTabBulletinList, tab_bulletin_list: bulletin_list })
  }

  // 获取更新
  yield put({ type: actionType.avatar.UpdateFollowBulletin })
}

export function* LoadBulletinList(action) {
  let self_address = yield select(state => state.avatar.get('Address'))
  let db = yield select(state => state.avatar.get('Database'))
  let sql = ''
  let bulletin_list = []

  // session_flag?新的列表：延长列表
  if (action.session_flag == true) {
    yield put({ type: actionType.avatar.setBulletinList, bulletin_list: [] })
  } else {
    bulletin_list = yield select(state => state.avatar.get('BulletinList'))
  }
  let bulletin_list_size = bulletin_list.length

  if (action.session == BulletinAddressSession) {
    yield put({ type: actionType.avatar.setCurrentBBSession, current_BB_session: action.address })
    sql = `SELECT * FROM BULLETINS WHERE address = '${action.address}' ORDER BY sequence DESC LIMIT ${BulletinPageSize} OFFSET ${bulletin_list_size}`
  } else if (action.session == BulletinHistorySession) {
    sql = `SELECT * FROM BULLETINS ORDER BY view_at DESC LIMIT ${BulletinPageSize} OFFSET ${bulletin_list_size}`
  } else if (action.session == BulletinMarkSession) {
    sql = `SELECT * FROM BULLETINS WHERE is_mark = 'TRUE' ORDER BY mark_at DESC LIMIT ${BulletinPageSize} OFFSET ${bulletin_list_size}`
  }

  let tmp = []
  let items = yield call([db, db.getAll], sql)
  items.forEach(bulletin => {
    tmp.push({
      "Address": bulletin.address,
      "Timestamp": bulletin.timestamp,
      "CreateAt": bulletin.created_at,
      "Sequence": bulletin.sequence,
      "Content": bulletin.content,
      "Hash": bulletin.hash,
      "QuoteSize": bulletin.quote_size,
      "IsMark": bulletin.is_mark
    })
  })
  if (tmp.length != 0) {
    bulletin_list = bulletin_list.concat(tmp)
    yield put({ type: actionType.avatar.setBulletinList, bulletin_list: bulletin_list })
  }

  // 获取更新
  if (action.session == BulletinAddressSession && action.address != self_address) {
    let next_sequence = 1
    if (bulletin_list.length != 0) {
      next_sequence = bulletin_list[0].Sequence + 1
    }
    yield put({ type: actionType.avatar.FetchBulletin, address: action.address, sequence: next_sequence, to: action.address })
  }
}

export function* UpdateFollowBulletin() {
  let db = yield select(state => state.avatar.get('Database'))
  let follow_list = yield select(state => state.avatar.get('Follows'))
  let sql = `SELECT * FROM BULLETINS GROUP BY address`
  let bulletin_list = []
  let items = yield call([db, db.getAll], sql)
  items.forEach(bulletin => {
    if (follow_list.includes(bulletin.address)) {
      bulletin_list.push({
        "Address": bulletin.address,
        'Sequence': bulletin.sequence
      })
    }
  })

  let address_next_sequence = {}
  //set next sequence to 1
  for (let i = follow_list.length - 1; i >= 0; i--) {
    address_next_sequence[follow_list[i]] = 1
  }
  //update next sequenece by db
  for (let i = bulletin_list.length - 1; i >= 0; i--) {
    if (address_next_sequence[bulletin_list[i].Address] <= bulletin_list[i].Sequence) {
      address_next_sequence[bulletin_list[i].Address] = bulletin_list[i].Sequence + 1
    }
  }
  //fetch next bulletin
  for (let i = follow_list.length - 1; i >= 0; i--) {
    yield put({ type: actionType.avatar.FetchBulletin, address: follow_list[i], sequence: address_next_sequence[follow_list[i]], to: follow_list[i] })
  }
}

export function* FetchBulletin(action) {
  let MessageGenerator = yield select(state => state.avatar.get('MessageGenerator'))
  let msg = MessageGenerator.genBulletinRequest(action.address, action.sequence, action.to)
  yield put({ type: actionType.avatar.SendMessage, message: msg })
}

export function* MarkBulletin(action) {
  let db = yield select(state => state.avatar.get('Database'))
  let sql = `UPDATE BULLETINS SET is_mark = "TRUE", mark_at = ${Date.now()} WHERE hash = "${action.hash}"`
  yield call([db, db.runSQL], sql)
  yield put({ type: actionType.avatar.LoadCurrentBulletin, hash: action.hash })
}

export function* UnmarkBulletin(action) {
  let db = yield select(state => state.avatar.get('Database'))
  let sql = `UPDATE BULLETINS SET is_mark = "FALSE" WHERE hash = "${action.hash}"`
  yield call([db, db.runSQL], sql)
  yield put({ type: actionType.avatar.LoadCurrentBulletin, hash: action.hash })
}

//Chat
export function* LoadCurrentSession(action) {
  let db = yield select(state => state.avatar.get('Database'))
  let address = action.address
  let timestamp = Date.now()
  let self_address = yield select(state => state.avatar.get('Address'))
  let ecdh_sequence = DHSequence(DefaultDivision, timestamp, self_address, address)

  //fetch aes-Key according to (address+division+sequence)
  let sql = `SELECT * FROM ECDHS WHERE address = "${address}" AND division = "${DefaultDivision}" AND sequence = ${ecdh_sequence}`
  let ecdh = yield call([db, db.getOne], sql)
  if (ecdh != null) {
    if (ecdh.aes_key != null) {
      //aes ready
      yield put({ type: actionType.avatar.setCurrentSession, address: address, ecdh_sequence: ecdh_sequence, aes_key: ecdh.aes_key })
      //handsake already done, ready to chat
    } else {
      //my-sk-pk exist, aes not ready
      //send self-not-ready-json
      // console.log(ecdh.self_json)
      yield put({ type: actionType.avatar.SendMessage, message: ecdh.self_json })
    }
  } else {
    //my-sk-pk not exist
    //gen my-sk-pk
    let ecdh = crypto.createECDH('secp256k1')
    let ecdh_pk = ecdh.generateKeys('hex')
    let ecdh_sk = ecdh.getPrivateKey('hex')
    let MessageGenerator = yield select(state => state.avatar.get('MessageGenerator'))
    let msg = MessageGenerator.genFriendECDHRequest(DefaultDivision, ecdh_sequence, ecdh_pk, "", address, timestamp)
    // console.log(msg)

    //save my-sk-pk, self-not-ready-json
    let sql = `INSERT INTO ECDHS (address, division, sequence, private_key, self_json)
VALUES ('${address}', '${DefaultDivision}', ${ecdh_sequence}, '${ecdh_sk}', '${msg}')`
    let reuslt = yield call([db, db.runSQL], sql)
    // {"insertId": 1, "rows": {"item": [Function item], "length": 0, "raw": [Function raw]}, "rowsAffected": 1}
    // {"code": 0, "message": "UNIQUE constraint failed: ECDHS.address, ECDHS.division, ECDHS.sequence (code 1555 sqlITE_CONSTRAINT_PRIMARYKEY)"}
    if (reuslt.code != 0) {
      yield put({ type: actionType.avatar.SendMessage, message: msg })
    }
  }

  //fetch pre message
  sql = `SELECT * FROM MESSAGES WHERE dest_address = "${address}" ORDER BY sequence DESC`
  let pre_message = yield call([db, db.getOne], sql)
  if (pre_message == null) {
    yield put({ type: actionType.avatar.setCurrentSession, address: address, hash: GenesisHash, sequence: 0 })
  } else {
    yield put({ type: actionType.avatar.setCurrentSession, address: address, hash: pre_message.hash, sequence: pre_message.sequence })
  }
}

export function* LoadCurrentMessageList(action) {
  let session_map = yield select(state => state.avatar.get('SessionMap'))
  session_map[action.address].CountUnread = 0
  yield put({ type: actionType.avatar.setSessionMap, session_map: session_map })

  let db = yield select(state => state.avatar.get('Database'))
  let sql = `SELECT * FROM MESSAGES WHERE sour_address = '${action.address}' OR dest_address = '${action.address}' ORDER BY timestamp DESC`
  // let sql =`SELECT * FROM MESSAGES WHERE address = '${action.address}' ORDER BY timestamp DESC LIMIT ${BulletinPageSize} OFFSET ${bulletin_list_size}` 
  let items = yield call([db, db.getAll], sql)
  let message_list = []
  let current_sequence = 0
  items.forEach(item => {
    let confirmed = (item.confirmed == "TRUE")
    message_list.push({
      "SourAddress": item.sour_address,
      "Timestamp": item.timestamp,
      "Sequence": item.sequence,
      "created_at": item.created_at,
      "Content": item.content,
      "Confirmed": confirmed,
      "Hash": item.hash
    })
    if (item.sour_address == action.address && item.sequence > current_sequence) {
      current_sequence = item.sequence
    }
  })
  yield put({ type: actionType.avatar.setCurrentMessageList, message_list: message_list })

  let MessageGenerator = yield select(state => state.avatar.get('MessageGenerator'))
  let msg = MessageGenerator.genFriendSync(current_sequence, action.address)
  yield put({ type: actionType.avatar.SendMessage, message: msg })
}

export function* HandleFriendECDH(action) {
  let json = action.json
  //check message from my friend
  let address = DeriveAddress(json.PublicKey)
  let timestamp = Date.now()
  let db = yield select(state => state.avatar.get('Database'))
  let MessageGenerator = yield select(state => state.avatar.get('MessageGenerator'))
  let friend_list = yield select(state => state.avatar.get('Friends'))
  if (!friend_list.includes(address)) {
    console.log('message is not from my friend...')
    //Strangers
    // while (state.Strangers.size >= 10) {
    //   state.Strangers.shift()
    // }
    // state.Strangers.push({ "address": address, "created_at": timestamp })
    // return
  }

  //check dh(my-sk-pk pair-pk aes-key)

  let sql = `SELECT * FROM ECDHS WHERE address = "${address}" AND division = "${json.Division}" AND sequence = ${json.Sequence}`
  let item = yield call([db, db.getOne], sql)

  if (item == null) {
    //self not ready, so pair could not be ready
    //gen my-sk-pk and aes-key
    let ecdh = crypto.createECDH('secp256k1')
    let ecdh_pk = ecdh.generateKeys('hex')
    let ecdh_sk = ecdh.getPrivateKey('hex')
    let aes_key = ecdh.computeSecret(json.DHPublicKey, 'hex', 'hex')

    //gen message with my-pk, indicate self ready
    let msg = MessageGenerator.genFriendECDHRequest(json.Division, json.Sequence, ecdh_pk, json.DHPublicKey, address, timestamp)

    //save my-sk-pk, pair-pk, aes-key, self-not-ready-json
    sql = `INSERT INTO ECDHS (address, division, sequence, private_key, public_key, aes_key, self_json)
VALUES ('${address}', '${json.Division}', '${json.Sequence}', '${ecdh_sk}', '${json.DHPublicKey}', '${aes_key}', '${msg}')`
    let reuslt = yield call([db, db.runSQL], sql)
    if (reuslt.code != 0) {
      yield put({ type: actionType.avatar.SendMessage, message: msg })
    }
  } else if (item.pair_json == null) {
    //item not null => my-sk-pk, self-not-ready-json is exist
    //gen aes
    let ecdh = crypto.createECDH('secp256k1')
    ecdh.setPrivateKey(item.private_key, 'hex')
    let ecdh_pk = ecdh.getPublicKey('hex')
    let aes_key = ecdh.computeSecret(json.DHPublicKey, 'hex', 'hex')

    //gen self-ready-json
    let msg = MessageGenerator.genFriendECDHRequest(json.Division, json.Sequence, ecdh_pk, json.DHPublicKey, address, timestamp)

    if (json.Pair == "") {
      //pair not ready
      //save pair-pk, aes-key, self-ready-json
      sql = `UPDATE ECDHS SET public_key = '${json.DHPublicKey}', aes_key = '${aes_key}', self_json = '${msg}' WHERE address = "${address}" AND division = "${json.Division}" AND sequence = "${json.Sequence}"`
      let reuslt = yield call([db, db.runSQL], sql)
      if (reuslt.code != 0) {
        yield put({ type: actionType.avatar.SendMessage, message: msg })
      }
    } else {
      //pair ready
      //save pair-pk, aes-key, self-ready-json, pair-ready-json
      sql = `UPDATE ECDHS SET public_key = '${json.DHPublicKey}', aes_key = '${aes_key}', self_json = '${msg}', pair_json = '${JSON.stringify(json)}' WHERE address = "${address}" AND division = "${json.Division}" AND sequence = "${json.Sequence}"`
      let reuslt = yield call([db, db.runSQL], sql)
      if (reuslt.code != 0) {
        yield put({ type: actionType.avatar.SendMessage, message: msg })
        let current_session = yield select(state => state.avatar.get('CurrentSession'))
        if (address == current_session.Address) {
          yield put({ type: actionType.avatar.setCurrentSession, address: address, ecdh_sequence: json.Sequence, aes_key: aes_key })
        }
      }
    }
  }
  //else: self and pair are ready, do nothing
  //both ready to talk
}

export function* HandleFriendMessage(action) {
  let json = action.json
  let sour_address = DeriveAddress(json.PublicKey)
  let db = yield select(state => state.avatar.get('Database'))
  let MessageGenerator = yield select(state => state.avatar.get('MessageGenerator'))
  //check message from my friend
  let friend_list = yield select(state => state.avatar.get('Friends'))
  if (!friend_list.includes(sour_address)) {
    console.log('message is not from my friend...')
    return
  }

  //check pre-message
  let sql = `SELECT * FROM MESSAGES WHERE sour_address = "${sour_address}" AND hash = "${json.PreHash}" AND sequence = ${json.Sequence - 1}`
  let item = yield call([db, db.getOne], sql)
  if (item == null) {
    if (json.Sequence == 1) {
      yield put({ type: actionType.avatar.SaveFriendMessage, sour_address: sour_address, json: json })
    } else {
      //some message is missing
      //get last message(biggest sequence)
      sql = `SELECT * FROM MESSAGES WHERE sour_address = "${sour_address}" ORDER BY sequence DESC`
      item = yield call([db, db.getOne], sql)
      //send ChatSync
      let current_sequence = 0
      if (item != null) {
        current_sequence = item.sequence
      }
      let msg = MessageGenerator.genFriendSync(current_sequence, sour_address)
      yield put({ type: actionType.avatar.SendMessage, message: msg })
    }
  } else {
    //pre-message exist
    yield put({ type: actionType.avatar.SaveFriendMessage, sour_address: sour_address, json: json })
  }

}

export function* SaveFriendMessage(action) {
  let db = yield select(state => state.avatar.get('Database'))
  let session_map = yield select(state => state.avatar.get('SessionMap'))
  let sour_address = action.sour_address
  let json = action.json

  let self_address = yield select(state => state.avatar.get('Address'))
  let sequence = DHSequence(DefaultDivision, json.Timestamp, self_address, sour_address)
  //fetch chatkey(aes_key) to decrypt content
  let sql = `SELECT * FROM ECDHS WHERE address = "${sour_address}" AND division = "${DefaultDivision}" AND sequence = ${sequence}`
  let item = yield call([db, db.getOne], sql)
  if (item == null && item.aes_key == null) {
    console.log('chatkey not exist...')
  } else {
    //decrypt content
    let content = AesDecrypt(json.Content, item.aes_key)

    let strJson = JSON.stringify(json)
    let hash = quarterSHA512(strJson)
    let created_at = Date.now()

    let readed = 'FALSE'
    let current_session = yield select(state => state.avatar.get('CurrentSession'))
    if (current_session && sour_address == current_session.Address) {
      readed = 'TRUE'
    }

    //check is_file?
    let is_file = 'FALSE'
    let file_saved = 'FALSE'
    let fileJson = null
    let fileSHA1 = null

    //save message
    let sql = `INSERT INTO MESSAGES (sour_address, sequence, pre_hash, content, timestamp, json, hash, created_at, readed, is_file, file_saved, file_sha1)
      VALUES ('${sour_address}', ${json.Sequence}, '${json.PreHash}', '${content}', '${json.Timestamp}', '${strJson}', '${hash}', '${created_at}', '${readed}', '${is_file}', '${file_saved}', '${fileSHA1}')`

    let reuslt = yield call([db, db.runSQL], sql)
    if (reuslt.code != 0) {
      if (current_session && sour_address == current_session.Address) {
        //CurrentSession: show message
        let message_list = yield select(state => state.avatar.get('CurrentMessageList'))
        message_list.unshift({
          "SourAddress": sour_address,
          "Timestamp": json.Timestamp,
          "Sequence": json.Sequence,
          "created_at": created_at,
          "Content": content,
          "Confirmed": false,
          "Hash": hash,
          "is_file": is_file,
          "file_saved": file_saved,
          "file": fileJson
        })
        yield put({ type: actionType.avatar.setCurrentMessageList, message_list: message_list })
      } else {
        //not CurrentSession: update unread_count
        session_map[sour_address].CountUnread += 1
      }

      session_map[sour_address].Timestamp = json.Timestamp
      session_map[sour_address].Content = content
      yield put({ type: actionType.avatar.setSessionMap, session_map: session_map })

      //tray blink
      // ipcRenderer.send('synchronous-message', 'new-private-message')

      //update db-message(confirmed)
      sql = `UPDATE MESSAGES SET confirmed = 'TRUE' WHERE dest_address = '${sour_address}' AND hash IN (${Array2Str(json.PairHash)})`
      reuslt = yield call([db, db.runSQL], sql)
      if (reuslt.code != 0) {
        //update view-message(confirmed)
        if (current_session && sour_address == current_session.Address) {
          let message_list = yield select(state => state.avatar.get('CurrentMessageList'))
          for (let i = message_list.length - 1; i >= 0; i--) {
            if (json.PairHash.includes(message_list[i].Hash)) {
              message_list[i].Confirmed = true
            }
          }
          yield put({ type: actionType.avatar.setCurrentMessageList, message_list: message_list })
        }
      }
    }


    // try {
    //   fileJson = JSON.parse(content)
    //   //is a json
    //   if (checkFileSchema(fileJson)) {
    //     //is a file json
    //     is_file = true
    //     fileSHA1 = fileJson["SHA1"]
    //     let filesql = `SELECT * FROM FILES WHERE sha1 = "${fileJson.SHA1}" AND saved = true`
    //     state.DB.get(filesql, (err, item) => {
    //       if (err) {
    //         console.log(err)
    //       } else {
    //         if (item != null) {
    //           file_saved = true
    //         }
    //         //update sql
    //         sql = `INSERT INTO MESSAGES (sour_address, sequence, pre_hash, content, timestamp, json, hash, created_at, readed, is_file, file_saved, file_sha1)
    //           VALUES ('${sour_address}', ${json.Sequence}, '${json.PreHash}', '${content}', '${json.Timestamp}', '${strJson}', '${hash}', '${created_at}', ${readed}, ${is_file}, ${file_saved}, '${fileSHA1}')`
    //       }
    //     })
    //   }
    // } catch (e) {
    //   console.log(e)
    // }
  }
}

export function* HandleFriendSync(action) {
  let json = action.json

  let sour_address = DeriveAddress(json.PublicKey)
  //check message from my friend
  let friend_list = yield select(state => state.avatar.get('Friends'))
  if (!friend_list.includes(sour_address)) {
    console.log('message is not from my friend...')
    return
  }

  // let SQL = `SELECT * FROM MESSAGES WHERE dest_address = "${sour_address}" AND confirmed = false AND sequence > ${json.CurrentSequence} ORDER BY sequence ASC`
  // state.DB.all(SQL, (err, items) => {
  //   if (err) {
  //     console.log(err)
  //   } else {
  //     let s = 0;
  //     for (const item of items) {
  //       DelayExec(s * MessageInterval).then(() => {
  //         state.WS.send(item.json)
  //       })
  //       s = s + 1
  //     }
  //   }
  // })
}

export function* SendFriendMessage(action) {
  let dest_address = action.address
  let timestamp = action.timestamp
  let db = yield select(state => state.avatar.get('Database'))
  let current_session = yield select(state => state.avatar.get('CurrentSession'))

  //encrypt content
  let content = AesEncrypt(action.message, current_session.AesKey)

  let sequence = current_session.Sequence + 1

  let pair_hash = []
  let sql = `SELECT * FROM MESSAGES WHERE sour_address = '${dest_address}' AND confirmed = 'FALSE' ORDER BY sequence ASC LIMIT 8`
  let items = yield call([db, db.getAll], sql)
  if (items.length != 0) {
    items.forEach(item => {
      pair_hash.push(item.hash)
    })
  }

  let MessageGenerator = yield select(state => state.avatar.get('MessageGenerator'))
  let msg = MessageGenerator.genFriendMessage(sequence, current_session.Hash, pair_hash, content, dest_address, timestamp)
  let hash = quarterSHA512(msg)
  let is_file = 'FALSE'
  let file_saved = 'FALSE'
  let fileSHA1 = null

  sql = `INSERT INTO MESSAGES (dest_address, sequence, pre_hash, content, timestamp, json, hash, created_at, readed, is_file, file_saved, file_sha1)
VALUES ('${dest_address}', ${sequence}, '${current_session.Hash}', '${action.message}', '${timestamp}', '${msg}', '${hash}', '${timestamp}', 'TRUE', '${is_file}', '${file_saved}', '${fileSHA1}')`
  reuslt = yield call([db, db.runSQL], sql)
  if (reuslt.code != 0) {
    yield put({ type: actionType.avatar.SendMessage, message: msg })

    if (dest_address == current_session.Address) {
      //CurrentSession: show message
      let message_list = yield select(state => state.avatar.get('CurrentMessageList'))
      message_list.unshift({
        "SourAddress": "",
        "Timestamp": timestamp,
        "Sequence": sequence,
        "created_at": timestamp,
        "Content": action.message,
        "Confirmed": false,
        "Hash": hash,
        "is_file": is_file,
        "file_saved": file_saved
      })
      yield put({ type: actionType.avatar.setCurrentMessageList, message_list: message_list })
    }

    yield put({ type: actionType.avatar.setCurrentSession, address: dest_address, sequence: sequence, hash: hash })

    //update session map
    let session_map = yield select(state => state.avatar.get('SessionMap'))
    session_map[dest_address].Timestamp = timestamp
    session_map[dest_address].Content = action.message
    yield put({ type: actionType.avatar.setSessionMap, session_map: session_map })

    //update db-message(confirmed)
    sql = `UPDATE MESSAGES SET confirmed = 'TRUE' WHERE sour_address = '${dest_address}' AND hash IN (${Array2Str(pair_hash)})`
    reuslt = yield call([db, db.runSQL], sql)
    if (reuslt.code != 0) {
      //update view-message(confirmed)
      if (current_session && dest_address == current_session.Address) {
        let message_list = yield select(state => state.avatar.get('CurrentMessageList'))
        for (let i = message_list.length - 1; i >= 0; i--) {
          if (pair_hash.includes(message_list[i].Hash)) {
            message_list[i].Confirmed = true
          }
        }
        yield put({ type: actionType.avatar.setCurrentMessageList, message_list: message_list })
      }
    }
  }
}