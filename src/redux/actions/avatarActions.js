import { actionType } from './actionType'
import { call, put, select, take, cancelled, fork } from 'redux-saga/effects'
import { eventChannel, END } from 'redux-saga'

import { DefaultHost, Epoch, GenesisHash, ActionCode, DefaultDivision, GroupRequestActionCode, GroupManageActionCode, GroupMemberShip, ObjectType, SessionType, BulletinPageSize, BulletinTabSession, BulletinHistorySession, BulletinMarkSession, BulletinAddressSession } from '../../lib/Const'
import { deriveJson, checkJsonSchema, checkBulletinSchema, checkFileChunkSchema, checkGroupManageSchema, checkGroupRequestSchema, checkGroupMessageSchema, checkFileSchema } from '../../lib/MessageSchemaVerifier'

import { DeriveKeypair, DeriveAddress, VerifyJsonSignature, quarterSHA512 } from '../../lib/OXO'
import Database from '../../lib/Database'
import MessageGenerator from '../../lib/MessageGenerator'

function DelayExec(ms) {
  return new Promise(resolve => {
    setTimeout(resolve, ms)
  })
}

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
      console.log(`======================================================yield take(channel)`)
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
            // case ActionCode.ChatDH:
            //   console.log('HandleChatDH(json)')
            //   break
            // case ActionCode.ChatMessage:
            //   console.log('HandleChatMessage(json)')
            //   break
            // case ActionCode.ChatSync:
            //   console.log('HandleChatSync(json)')
            //   break
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

// Avatar
export function* enableAvatar(action) {
  let keypair = DeriveKeypair(action.seed)
  let address = DeriveAddress(keypair.publicKey)
  yield put({ type: actionType.avatar.setAvatar, seed: action.seed, name: action.name, address: address, public_key: keypair.publicKey, private_key: keypair.privateKey })


  let db = new Database()

  yield call([db, db.initDB], address, '0.0.1', address, 0)
  yield put({ type: actionType.avatar.setDatabase, db: db })

  let setting = yield call([db, db.loadSetting])
  yield put({ type: actionType.avatar.setSetting, setting: setting })

  let [address_map, address_array] = yield call([db, db.loadAddressBook])
  address_map[address] = action.name
  yield put({ type: actionType.avatar.setAddressBook, address_map: address_map, address_array: address_array })

  let friends = yield call([db, db.loadFriends])
  yield put({ type: actionType.avatar.setFriends, friends: friends })

  let follow_list = yield call([db, db.loadFollows])
  yield put({ type: actionType.avatar.setFollows, follow_list: follow_list })

  let hosts = yield call([db, db.loadHosts])
  yield put({ type: actionType.avatar.setHosts, hosts: hosts })

  let current_host = hosts[0].Address || DefaultHost
  yield put({ type: actionType.avatar.setCurrentHost, current_host: current_host })

  let mg = new MessageGenerator(keypair.publicKey, keypair.privateKey)
  yield put({ type: actionType.avatar.setMessageGenerator, message_generator: mg })

  yield put({ type: actionType.avatar.Conn })

  yield put({ type: actionType.avatar.UpdateFollowBulletin })

  // LoadSessionList
  let recent_message_receive = yield call([db, db.loadRecentMessageReceive])
  let recent_message_send = yield call([db, db.loadRecentMessageSend])
  let session_map = {}
  follow_list.forEach(follow => {
    session_map[follow] = { Address: follow, Timestamp: Epoch, Content: '' }
  })
  recent_message_receive.forEach(message => {
    session_map[message.Address].Timestamp = message.Timestamp
    session_map[message.Address].Content = message.Content
  })
  recent_message_send.forEach(message => {
    if (message.Timestamp > session_map[message.Address].Timestamp) {
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
    yield call([db, db.limitBulletinCache], setting.BulletinCacheSize, Array2Str(follow_list))
  }
  yield call([db, db.closeDB])
  yield put({ type: actionType.avatar.resetAvatar })
}

export function* setBulletinCacheSize(action) {
  let db = yield select(state => state.avatar.get('Database'))
  let setting = yield select(state => state.avatar.get('Setting'))
  setting.BulletinCacheSize = action.cache_size
  console.log(setting)
  yield call([db, db.saveSetting], setting)
  yield put({ type: actionType.avatar.setSetting, setting: setting })
}

// AddressBook
export function* addAddressMark(action) {
  let timestamp = Date.now()
  let db = yield select(state => state.avatar.get('Database'))
  yield call([db, db.addAddressMark], action.address, action.name, timestamp)
  let address_array = yield select(state => state.avatar.get('AddressArray'))
  let address_map = yield select(state => state.avatar.get('AddressMap'))
  let addressMark = { Address: action.address, Name: action.name, UpdatedAt: timestamp }

  address_map[action.address] = action.name
  address_array.push(addressMark)

  yield put({ type: actionType.avatar.setAddressBook, address_map: address_map, address_array: address_array })
}


export function* delAddressMark(action) {
  let db = yield select(state => state.avatar.get('Database'))
  yield call([db, db.delAddressMark], action.address)
  let address_array = yield select(state => state.avatar.get('AddressArray'))
  let address_map = yield select(state => state.avatar.get('AddressMap'))

  address_map[action.address] = null
  let tmp = []
  address_array.forEach(am => {
    if (am.Address != action.address) {
      tmp.push(am)
    }
  })
  address_array = tmp

  yield put({ type: actionType.avatar.setAddressBook, address_map: address_map, address_array: address_array })
}

export function* saveAddressName(action) {
  let timestamp = Date.now()
  let db = yield select(state => state.avatar.get('Database'))
  yield call([db, db.saveAddressName], action.address, action.name, timestamp)
  let address_array = yield select(state => state.avatar.get('AddressArray'))
  let address_map = yield select(state => state.avatar.get('AddressMap'))
  let addressMark = { Address: action.address, Name: action.name, UpdatedAt: timestamp }

  address_map[action.address] = action.name
  let tmp = []
  address_array.forEach(am => {
    if (am.Address != action.address) {
      tmp.push(am)
    }
  })
  tmp.push(addressMark)
  address_array = tmp

  yield put({ type: actionType.avatar.setAddressBook, address_map: address_map, address_array: address_array })
}

// Friend
export function* addFriend(action) {
  let db = yield select(state => state.avatar.get('Database'))
  yield call([db, db.addFriend], action.address)
  let friends = yield select(state => state.avatar.get('Friends'))
  friends.push(action.address)
  yield put({ type: actionType.avatar.setFriends, friends: friends })

  //刷新当前AddressMark
  let current_address_mark = yield select(state => state.avatar.get('CurrentAddressMark'))
  if (current_address_mark || action.address == current_address_mark.Address) {
    yield put({ type: actionType.avatar.setCurrentAddressMark, address: action.address })
  }
}

export function* delFriend(action) {
  let db = yield select(state => state.avatar.get('Database'))
  yield call([db, db.delFriend], action.address)
  let friends = yield select(state => state.avatar.get('Friends'))
  friends = friends.filter((item) => item != action.address)
  yield put({ type: actionType.avatar.setFriends, friends: friends })

  //刷新当前AddressMark
  let current_address_mark = yield select(state => state.avatar.get('CurrentAddressMark'))
  if (current_address_mark || action.address == current_address_mark.Address) {
    yield put({ type: actionType.avatar.setCurrentAddressMark, address: action.address })
  }

  //清楚聊天痕迹
  yield call([db, db.clearFriendMessage], action.address)
  yield call([db, db.clearFriendECDH], action.address)
}

// Follow
export function* addFollow(action) {
  let db = yield select(state => state.avatar.get('Database'))
  yield call([db, db.addFollow], action.address)
  let follow_list = yield select(state => state.avatar.get('Follows'))
  follow_list.push(action.address)
  yield put({ type: actionType.avatar.setFollows, follow_list: follow_list })

  //刷新当前AddressMark
  let current_address_mark = yield select(state => state.avatar.get('CurrentAddressMark'))
  if (current_address_mark || action.address == current_address_mark.Address) {
    yield put({ type: actionType.avatar.setCurrentAddressMark, address: action.address })
  }

  //更新Bulletin的is_cache
  yield call([db, db.updateIsCache], action.address, "FALSE")
}

export function* delFollow(action) {
  let db = yield select(state => state.avatar.get('Database'))
  yield call([db, db.delFollow], action.address)
  let follow_list = yield select(state => state.avatar.get('Follows'))
  follow_list = follow_list.filter((item) => item != action.address)
  yield put({ type: actionType.avatar.setFollows, follow_list: follow_list })

  //刷新当前AddressMark
  let current_address_mark = yield select(state => state.avatar.get('CurrentAddressMark'))
  if (current_address_mark || action.address == current_address_mark.Address) {
    yield put({ type: actionType.avatar.setCurrentAddressMark, address: action.address })
  }

  //更新Bulletin的is_cache
  yield call([db, db.updateIsCache], action.address, "TRUE")
}

// Host
export function* addHost(action) {
  let db = yield select(state => state.avatar.get('Database'))
  yield call([db, db.addHost], action.host)

  let hosts = yield call([db, db.loadHosts])
  yield put({ type: actionType.avatar.setHosts, hosts: hosts })

  yield put({ type: actionType.avatar.setCurrentHost, current_host: action.host })
}

export function* delHost(action) {
  let db = yield select(state => state.avatar.get('Database'))
  yield call([db, db.delHost], action.host)
  let hosts = yield select(state => state.avatar.get('Hosts'))
  hosts = hosts.filter((item) => item != action.host)
  yield put({ type: actionType.avatar.setHosts, hosts: hosts })
}

export function* changeCurrentHost(action) {
  let db = yield select(state => state.avatar.get('Database'))
  yield call([db, db.updateHost], action.host)

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
  let ws = yield select(state => state.avatar.get('WebSocket'))
  let MessageGenerator = yield select(state => state.avatar.get('MessageGenerator'))
  let json = action.json
  let address = DeriveAddress(json.PublicKey)
  let db = yield select(state => state.avatar.get('Database'))
  let item = yield call([db, db.loadBulletinResponse], json.Address, json.Sequence)
  if (item != null) {
    let bulletin = JSON.parse(item.json)
    if (ws != null && ws.readyState == WebSocket.OPEN) {
      let msg = MessageGenerator.genObjectResponse(bulletin, address)
      ws.send(msg)
    }
  }
}

export function* LoadCurrentBulletin(action) {
  let db = yield select(state => state.avatar.get('Database'))
  let bulletin = yield call([db, db.loadBulletinFromHash], action.hash)
  console.log(`=================================================LoadCurrentBulletin`)
  yield put({ type: actionType.avatar.setCurrentBulletin, bulletin: bulletin })
  yield call([db, db.updateBulletinViewAt], action.hash)

  if (bulletin != null) {
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
  yield call([db, db.clearBulletinCache], Array2Str(follow_list))
}

export function* PublishBulletin(action) {
  //console.log(`=================================================PublishBulletin`)
  let address = yield select(state => state.avatar.get('Address'))
  let db = yield select(state => state.avatar.get('Database'))
  let last_bulletin = yield call([db, db.loadLastBulletin], address)
  let pre_hash = GenesisHash
  let next_sequence = 1
  if (last_bulletin != null) {
    pre_hash = last_bulletin.hash
    next_sequence = last_bulletin.sequence + 1
  }
  let quote_list = yield select(state => state.avatar.get('QuoteList'))
  let MessageGenerator = yield select(state => state.avatar.get('MessageGenerator'))
  let timestamp = Date.now()
  let bulletin_json = MessageGenerator.genBulletin(next_sequence, pre_hash, quote_list, action.content, timestamp)
  let str_bulletin = JSON.stringify(bulletin_json)
  let hash = quarterSHA512(str_bulletin)
  let is_file = false
  let file_saved = false
  let sql = `INSERT INTO BULLETINS (address, sequence, pre_hash, content, timestamp, json, created_at, hash, quote_size, is_file, file_saved, relay_address, is_cache)
VALUES ('${address}', ${next_sequence}, '${bulletin_json.PreHash}', '${bulletin_json.Content}', '${bulletin_json.Timestamp}', '${str_bulletin}', ${timestamp}, '${hash}', ${bulletin_json.Quote.length}, '${is_file}', '${file_saved}', '${address}', 'FALSE')`
  //console.log(sql)
  yield call([db, db.doInsert], sql)

  yield put({ type: actionType.avatar.setQuoteList, quote_list: [] })

  let ws = yield select(state => state.avatar.get('WebSocket'))
  if (ws != null && ws.readyState == WebSocket.OPEN) {
    let MessageGenerator = yield select(state => state.avatar.get('MessageGenerator'))
    let msg = MessageGenerator.genObjectResponse(bulletin_json, address)
    ws.send(msg)
  }
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
    let bulletin_list = yield select(state => state.avatar.get('BulletinList'))

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
      yield call([db, db.doInsert], sql)
      let current_BB_session = yield select(state => state.avatar.get('CurrentBBSession'))
      if (current_BB_session == BulletinTabSession || current_BB_session == object_address) {
        // Tab页、FollowBulletinList页
        bulletin_list.unshift({
          "Address": object_address,
          "Timestamp": bulletin_json.Timestamp,
          "CreatedAt": timestamp,
          'Sequence': bulletin_json.Sequence,
          "Content": bulletin_json.Content,
          "Hash": hash,
          "QuoteSize": bulletin_json.Quote.length,
          "IsMark": false
        })
        yield put({ type: actionType.avatar.setBulletinList, bulletin_list: bulletin_list })
      }
      yield put({ type: actionType.avatar.FetchBulletin, address: object_address, sequence: bulletin_json.Sequence + 1, to: object_address })
    } else if (quote_white_list.includes(hash)) {
      //bulletin from quote
      let sql = `INSERT INTO BULLETINS (address, sequence, pre_hash, content, timestamp, json, created_at, hash, quote_size, is_file, file_saved, relay_address, is_cache)
VALUES ('${object_address}', ${bulletin_json.Sequence}, '${bulletin_json.PreHash}', '${bulletin_json.Content}', '${bulletin_json.Timestamp}', '${strJson}', ${timestamp}, '${hash}', ${bulletin_json.Quote.length}, '${is_file}', '${file_saved}', '${relay_address}', 'TRUE')`

      //save bulletin
      yield call([db, db.doInsert], sql)
      let current_bulletin = yield select(state => state.avatar.get('CurrentBulletin'))
      if (current_bulletin == null) {
        yield put({ type: actionType.avatar.setCurrentBulletin, bulletin: bulletin_json })
      }
    }
  }
}

function Array2Str(array) {
  let tmpArray = []
  for (let i = array.length - 1; i >= 0; i--) {
    tmpArray.push(`'${array[i]}'`)
  }
  return tmpArray.join(',')
}

export function* LoadBulletinList(action) {
  let self_address = yield select(state => state.avatar.get('Address'))
  let db = yield select(state => state.avatar.get('Database'))
  let address_list = []
  let sql = ''
  let bulletin_list = []

  // session_flag?新的列表：延长列表
  if (action.session_flag == true) {
    yield put({ type: actionType.avatar.setBulletinList, bulletin_list: [] })
  } else {
    bulletin_list = yield select(state => state.avatar.get('BulletinList'))
  }
  let bulletin_list_size = bulletin_list.length

  if (action.session == BulletinTabSession) {
    address_list = yield select(state => state.avatar.get('Follows'))
    address_list.push(self_address)
    sql = `SELECT * FROM BULLETINS WHERE address IN (${Array2Str(address_list)}) ORDER BY timestamp DESC LIMIT ${BulletinPageSize} OFFSET ${bulletin_list_size}`
  } else if (action.session == BulletinAddressSession) {
    yield put({ type: actionType.avatar.setCurrentBBSession, current_BB_session: action.address })
    sql = `SELECT * FROM BULLETINS WHERE address = '${action.address}' ORDER BY sequence DESC LIMIT ${BulletinPageSize} OFFSET ${bulletin_list_size}`
  } else if (action.session == BulletinHistorySession) {
    sql = `SELECT * FROM BULLETINS ORDER BY view_at DESC LIMIT ${BulletinPageSize} OFFSET ${bulletin_list_size}`
  } else if (action.session == BulletinMarkSession) {
    sql = `SELECT * FROM BULLETINS WHERE is_mark = 'TRUE' ORDER BY mark_at DESC LIMIT ${BulletinPageSize} OFFSET ${bulletin_list_size}`
  }

  let tmp = yield call([db, db.loadBulletinBySql], sql)
  if (tmp.length != 0) {
    bulletin_list = bulletin_list.concat(tmp)
    yield put({ type: actionType.avatar.setBulletinList, bulletin_list: bulletin_list })
  }

  // 获取更新
  if (action.session == BulletinTabSession) {
    yield put({ type: actionType.avatar.UpdateFollowBulletin })
  } else if (action.session == BulletinAddressSession && action.address != self_address) {
    let next_sequence = 1
    if (bulletin_list.length != 0) {
      next_sequence = bulletin_list[0].Sequence + 1
    }
    yield put({ type: actionType.avatar.FetchBulletin, address: action.address, sequence: next_sequence, to: action.address })
  }
}

export function* UpdateFollowBulletin(action) {
  let follow_list = yield select(state => state.avatar.get('Follows'))
  let bulletin_list = yield call([db, db.loadRecentBulletin], follow_list)
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
  let ws = yield select(state => state.avatar.get('WebSocket'))
  console.log(`======================================================FetchBulletin`)
  if (ws != null && ws.readyState == WebSocket.OPEN) {
    let MessageGenerator = yield select(state => state.avatar.get('MessageGenerator'))
    let msg = MessageGenerator.genBulletinRequest(action.address, action.sequence, action.to)
    console.log(msg)
    ws.send(msg)
  }
}

export function* MarkBulletin(action) {
  let db = yield select(state => state.avatar.get('Database'))
  yield call([db, db.markBulletin], action.hash)
  yield put({ type: actionType.avatar.LoadCurrentBulletin, hash: action.hash })
}

export function* UnmarkBulletin(action) {
  let db = yield select(state => state.avatar.get('Database'))
  yield call([db, db.unmarkBulletin], action.hash)
  yield put({ type: actionType.avatar.LoadCurrentBulletin, hash: action.hash })
}

//Chat
export function* LoadSessionList(action) {
  console.log(`=================================================LoadSessionList`)
  let session_list = yield select(state => state.avatar.get('SessionList'))
}