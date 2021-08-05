import { actionType } from './actionType'
import { call, put, select, take, cancelled, fork } from 'redux-saga/effects'
import { eventChannel, END } from 'redux-saga'

import { DefaultHost, Epoch, GenesisHash, ActionCode, DefaultDivision, GroupRequestActionCode, GroupManageActionCode, GroupMemberShip, ObjectType, SessionType, WholeBulletinSession } from '../../lib/Const'
import { deriveJson, checkJsonSchema, checkBulletinSchema, checkFileChunkSchema, checkGroupManageSchema, checkGroupRequestSchema, checkGroupMessageSchema, checkFileSchema } from '../../lib/MessageSchemaVerifier'

import { DeriveKeypair, DeriveAddress, VerifyJsonSignature, quarterSHA512 } from '../../lib/OXO'
import Database from '../../lib/Database'
import MessageGenerator from '../../lib/MessageGenerator'

function DelayExec(ms) {
  return new Promise(resolve => {
    setTimeout(resolve, ms);
  })
}

function createWebSocket(url) {
  console.log(`======================================================createWebSocket`)
  return new Promise((resolve, reject) => {
    let ws = new WebSocket(url)
    ws.onopen = () => {
      console.log(`======================================================createWebSocket-open`)
      resolve(ws)
    }
    ws.onerror = (error) => {
      //{"isTrusted": false, "message": "Connection reset"}
      //TODO: catch this error
      console.log(`======================================================createWebSocket-error`)
      console.log(error)
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
  const CurrentHost = state.avatar.get('CurrentHost')
  const MessageGenerator = state.avatar.get('MessageGenerator')
  const Address = state.avatar.get('Address')

  if (CurrentHost == null) {
    return
  }

  console.log(`======================================================${CurrentHost}`)
  console.log(`======================================================Conn`)
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
            //   break;
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
              break;
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
    console.log(`======================================================Conn-catch`)
    console.log(error)
    // let regx = /^failed to connect to/
    // let rs = regx.exec(error.message)
    // if (rs != null) {
    //   console.log(`====================================================yield put(Conn)`)
    //   yield put({ type: actionType.avatar.Conn })
    // }
    //{"isTrusted": false, "message": "failed to connect to /127.0.0.1 (port 3000) from /10.0.2.15 (port 36216) after 10000ms"}
  } finally {
    // Clean up the connection
    console.log(`======================================================Conn-finally`)
    if (typeof channel !== 'undefined') {
      channel.close()
    }
    if (typeof ws !== 'undefined') {
      ws.close()
    }
    yield call(DelayExec, 10 * 1000)
    yield put({ type: actionType.avatar.Conn })
    console.log(`======================================================reconnect`)
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
  let sql = `INSERT INTO BULLETINS (address, sequence, pre_hash, content, timestamp, json, created_at, hash, quote_size, is_file, file_saved, relay_address)
      VALUES ('${address}', ${next_sequence}, '${bulletin_json.PreHash}', '${bulletin_json.Content}', '${bulletin_json.Timestamp}', '${str_bulletin}', ${timestamp}, '${hash}', ${bulletin_json.Quote.length}, '${is_file}', '${file_saved}', '${address}')`
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

    //check is_file?
    let is_file = false
    let file_saved = false
    let fileJson = null
    let fileSHA1 = null

    //WTF:is_file = 'false', not is_file = false
    let sql = `INSERT INTO BULLETINS (address, sequence, pre_hash, content, timestamp, json, created_at, hash, quote_size, is_file, file_saved, relay_address)
      VALUES ('${object_address}', ${bulletin_json.Sequence}, '${bulletin_json.PreHash}', '${bulletin_json.Content}', '${bulletin_json.Timestamp}', '${strJson}', ${timestamp}, '${hash}', ${bulletin_json.Quote.length}, '${is_file}', '${file_saved}', '${relay_address}')`
    // fileJson = deriveJson(bulletin_json.Content)
    // console.log(`=================================================${fileJson}`)
    // //is a json
    // if (fileJson && checkFileSchema(fileJson)) {
    //   //is a file json
    //   is_file = true
    //   fileSHA1 = fileJson["SHA1"]
    //   let fileSQL = `SELECT * FROM FILES WHERE sha1 = "${fileJson.SHA1}" AND saved = true`
    //   state.DB.get(fileSQL, (err, item) => {
    //     if (err) {
    //       console.log(err)
    //     } else {
    //       if (item != null) {
    //         file_saved = true
    //       }
    //       //update sql
    //       sql = `INSERT INTO BULLETINS (address, sequence, pre_hash, content, timestamp, json, created_at, hash, quote_size, is_file, file_saved, file_sha1, relay_address)
    //           VALUES ('${object_address}', ${bulletin_json.Sequence}, '${bulletin_json.PreHash}', '${bulletin_json.Content}', '${bulletin_json.Timestamp}', '${strJson}', ${timestamp}, '${hash}', ${bulletin_json.Quote.length}, ${is_file}, ${file_saved}, '${fileSHA1}', '${relay_address}')`
    //       SaveFileBulletin(sql, object_address, bulletin_json, timestamp, hash, is_file, file_saved, fileJson, relay_address)
    //     }
    //   })
    // } else {
    //not a file json, bulletin is a plain-string bulletin
    yield put({ type: actionType.avatar.SaveContentBulletin, sql: sql, object_address: object_address, bulletin_json: bulletin_json, created_at: timestamp, hash: hash })
    // }
  }
}

export function* SaveContentBulletin(action) {
  let object_address = action.object_address
  let bulletin_json = action.bulletin_json
  let db = yield select(state => state.avatar.get('Database'))
  let follows = yield select(state => state.avatar.get('Follows'))
  let quote_white_list = yield select(state => state.avatar.get('QuoteWhiteList'))
  let bulletin_list = yield select(state => state.avatar.get('BulletinList'))

  console.log(`=====================================================================SaveContentBulletin`)
  console.log(quote_white_list)
  console.log(action)
  if (follows.includes(object_address)) {
    //bulletin from follow
    //save bulletin
    yield call([db, db.doInsert], action.sql)
    let current_BB_session = yield select(state => state.avatar.get('CurrentBBSession'))
    if (current_BB_session == WholeBulletinSession || current_BB_session == object_address) {
      bulletin_list.unshift({
        "Address": object_address,
        "Timestamp": bulletin_json.Timestamp,
        "CreatedAt": action.created_at,
        'Sequence': bulletin_json.Sequence,
        "Content": bulletin_json.Content,
        "Hash": action.hash,
        "QuoteSize": bulletin_json.Quote.length
      })
      yield put({ type: actionType.avatar.setBulletinList, bulletin_list: bulletin_list })
    }
    yield put({ type: actionType.avatar.FetchBulletin, address: object_address, sequence: bulletin_json.Sequence + 1, to: object_address })
  } else if (quote_white_list.includes(action.hash)) {
    //bulletin from quote
    //save bulletin
    yield call([db, db.doInsert], action.sql)
    let current_bulletin = yield select(state => state.avatar.get('CurrentBulletin'))
    if (current_bulletin == null) {
      yield put({ type: actionType.avatar.setCurrentBulletin, bulletin: bulletin_json })
    }
  }
}

export function* enableAvatar(action) {
  let keypair = DeriveKeypair(action.seed)
  let address = DeriveAddress(keypair.publicKey)
  yield put({ type: actionType.avatar.setAvatar, seed: action.seed, name: action.name, address: address, public_key: keypair.publicKey, private_key: keypair.privateKey })

  let db = new Database()

  yield call([db, db.initDB], address, '0.0.1', address, 0)
  yield put({ type: actionType.avatar.setDatabase, db: db })

  let [address_map, address_array] = yield call([db, db.loadAddressBook])
  yield put({ type: actionType.avatar.setAddressBook, address_map: address_map, address_array: address_array })

  let friends = yield call([db, db.loadFriends])
  yield put({ type: actionType.avatar.setFriends, friends: friends })

  let follows = yield call([db, db.loadFollows])
  yield put({ type: actionType.avatar.setFollows, follows: follows })

  let hosts = yield call([db, db.loadHosts])
  yield put({ type: actionType.avatar.setHosts, hosts: hosts })

  let current_host = hosts[0].Address || DefaultHost
  yield put({ type: actionType.avatar.setCurrentHost, current_host: current_host })

  let mg = new MessageGenerator(keypair.publicKey, keypair.privateKey)
  yield put({ type: actionType.avatar.setMessageGenerator, message_generator: mg })

  yield put({ type: actionType.avatar.Conn })
}

export function* disableAvatar() {
  let db = yield select(state => state.avatar.get('Database'))
  yield call([db, db.closeDB])
  yield put({ type: actionType.avatar.resetAvatar })
}

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

export function* addFriend(action) {
  let db = yield select(state => state.avatar.get('Database'))
  yield call([db, db.addFriend], action.address)
  let friends = yield select(state => state.avatar.get('Friends'))
  friends.push(action.address)
  yield put({ type: actionType.avatar.setFriends, friends: friends })
}

export function* delFriend(action) {
  let db = yield select(state => state.avatar.get('Database'))
  yield call([db, db.delFriend], action.address)
  let friends = yield select(state => state.avatar.get('Friends'))
  friends = friends.filter((item) => item != action.address)
  yield put({ type: actionType.avatar.setFriends, friends: friends })
}

export function* addFollow(action) {
  let db = yield select(state => state.avatar.get('Database'))
  yield call([db, db.addFollow], action.address)
  let follows = yield select(state => state.avatar.get('Follows'))
  follows.push(action.address)
  yield put({ type: actionType.avatar.setFollows, follows: follows })
}

export function* delFollow(action) {
  let db = yield select(state => state.avatar.get('Database'))
  yield call([db, db.delFollow], action.address)
  let follows = yield select(state => state.avatar.get('Follows'))
  follows = follows.filter((item) => item != action.address)
  yield put({ type: actionType.avatar.setFollows, follows: follows })
}

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
  // let wc = yield select(state => state.avatar.get('WebSocketChannel'))
  // console.log(`=====================================================================changeCurrentHost`)
  // console.log(wc)
  if (wc != null) {
    yield call([wc, wc.close])
  }
  yield put({ type: actionType.avatar.Conn })
}

export function* LoadBulletinList(action) {
  let self_address = yield select(state => state.avatar.get('Address'))
  let db = yield select(state => state.avatar.get('Database'))
  let address_list = []

  yield put({ type: actionType.avatar.setCurrentBBSession, bulletin_list: action.address })

  if (action.address == WholeBulletinSession) {
    address_list = yield select(state => state.avatar.get('Follows'))
    address_list.push(self_address)
  } else {
    address_list.push(action.address)
  }

  let bulletin_list = yield call([db, db.loadBulletinList], address_list)
  yield put({ type: actionType.avatar.setBulletinList, bulletin_list: bulletin_list })

  if (action.address == WholeBulletinSession) {
    bulletin_list = yield call([db, db.loadRecentBulletin], address_list)
    let address_next_sequence = {}
    //set next sequence to 1
    address_list.pop()
    for (let i = address_list.length - 1; i >= 0; i--) {
      address_next_sequence[address_list[i]] = 1
    }
    //update next sequenece by db
    for (let i = bulletin_list.length - 1; i >= 0; i--) {
      if (address_next_sequence[bulletin_list[i].Address]) {
        address_next_sequence[bulletin_list[i].Address] = bulletin_list[i].Sequence + 1
      }
    }
    //fetch next bulletin
    for (let i = address_list.length - 1; i >= 0; i--) {
      yield put({ type: actionType.avatar.FetchBulletin, address: address_list[i], sequence: address_next_sequence[address_list[i]], to: address_list[i] })
    }
  } else if (action.address != self_address) {
    let next_sequence = 1
    if (bulletin_list.length != 0) {
      next_sequence = bulletin_list[0].Sequence + 1
    }
    yield put({ type: actionType.avatar.FetchBulletin, address: action.address, sequence: next_sequence, to: action.address })
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

export function* SaveName(action) {
  let name = action.name
  let bulletin_json = action.bulletin_json
  let db = yield select(state => state.avatar.get('Database'))
  let follows = yield select(state => state.avatar.get('Follows'))
  let quote_white_list = yield select(state => state.avatar.get('QuoteWhiteList'))
  let bulletin_list = yield select(state => state.avatar.get('BulletinList'))

  console.log(`=====================================================================SaveContentBulletin`)
  console.log(quote_white_list)
  console.log(action)
  if (follows.includes(object_address)) {
    //bulletin from follow
    //save bulletin
    yield call([db, db.doInsert], action.sql)
    let current_BB_session = yield select(state => state.avatar.get('CurrentBBSession'))
    if (current_BB_session == WholeBulletinSession || current_BB_session == object_address) {
      bulletin_list.unshift({
        "Address": object_address,
        "Timestamp": bulletin_json.Timestamp,
        "CreatedAt": action.created_at,
        'Sequence': bulletin_json.Sequence,
        "Content": bulletin_json.Content,
        "Hash": action.hash,
        "QuoteSize": bulletin_json.Quote.length
      })
      yield put({ type: actionType.avatar.setBulletinList, bulletin_list: bulletin_list })
    }
    yield put({ type: actionType.avatar.FetchBulletin, address: object_address, sequence: bulletin_json.Sequence + 1, to: object_address })
  } else if (quote_white_list.includes(action.hash)) {
    //bulletin from quote
    //save bulletin
    yield call([db, db.doInsert], action.sql)
    let current_bulletin = yield select(state => state.avatar.get('CurrentBulletin'))
    if (current_bulletin == null) {
      yield put({ type: actionType.avatar.setCurrentBulletin, bulletin: bulletin_json })
    }
  }
}