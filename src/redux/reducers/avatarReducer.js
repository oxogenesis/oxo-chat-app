import { actionType } from '../actions/actionType'
import { fromJS, set } from 'immutable'

function initialState() {
  return fromJS(
    {
      Seed: null,
      Address: null,
      PublicKey: null,
      PrivateKey: null,

      Database: null,

      Hosts: [],
      CurrentHost: null,
      WebSocket: null,
      MessageGenerator: null,

      AddressMap: {},
      AddressArray: [],

      Friends: [],
      Follows: [],

      BulletinList: [],
      CurrentBBSession: null,
      CurrentBulletin: null,
      QuoteList: [],
      QuoteWhiteList: []
    }
  )
}

export default function reducer(state = initialState(), action) {
  if (typeof reducer.prototype[action.type] === "function") {
    return reducer.prototype[action.type](state, action)
  } else {
    return state
  }
}

reducer.prototype[actionType.avatar.setAvatar] = (state, action) => {
  return state.set('Seed', action.seed)
    .set('Name', action.name)
    .set('Address', action.address)
    .set('PublicKey', action.public_key)
    .set('PrivateKey', action.private_key)
    .set('Database', null)
    .set('Hosts', [])
    .set('CurrentHost', null)
    .set('CurrentBBSession', null)
    .set('CurrentBulletin', null)
    .set('AddressMap', {})
    .set('AddressArray', [])
    .set('Friends', [])
    .set('Follows', [])
    .set('BulletinList', [])
    .set('QuoteList', [])
    .set('QuoteWhiteList', [])
}

reducer.prototype[actionType.avatar.setDatabase] = (state, action) => {
  return state.set('Database', action.db)
}

reducer.prototype[actionType.avatar.resetAvatar] = (state) => {
  console.log(`================================resetAvatar`)
  return state.set('Seed', null)
    .set('Address', null)
    .set('PublicKey', null)
    .set('PrivateKey', null)
    .set('Database', null)
    .set('Hosts', [])
    .set('CurrentHost', null)
    .set('CurrentBBSession', null)
    .set('CurrentBulletin', null)
    .set('AddressMap', {})
    .set('AddressArray', [])
    .set('Friends', [])
    .set('Follows', [])
    .set('BulletinList', [])
    .set('QuoteList', [])
    .set('QuoteWhiteList', [])
}

reducer.prototype[actionType.avatar.setAddressBook] = (state, action) => {
  return state.set('AddressMap', action.address_map)
    .set('AddressArray', action.address_array)
}

reducer.prototype[actionType.avatar.setFriends] = (state, action) => {
  return state.set('Friends', action.friends)
}

reducer.prototype[actionType.avatar.setFollows] = (state, action) => {
  return state.set('Follows', action.follows)
}

reducer.prototype[actionType.avatar.setHosts] = (state, action) => {
  return state.set('Hosts', action.hosts)
}

reducer.prototype[actionType.avatar.setCurrentHost] = (state, action) => {
  return state.set('CurrentHost', action.current_host)
}

reducer.prototype[actionType.avatar.setWebSocket] = (state, action) => {
  return state.set('WebSocket', action.websocket)
}

reducer.prototype[actionType.avatar.setWebSocketChannel] = (state, action) => {
  return state.set('WebSocketChannel', action.channel)
}

reducer.prototype[actionType.avatar.setMessageGenerator] = (state, action) => {
  return state.set('MessageGenerator', action.message_generator)
}

//Bulletin
reducer.prototype[actionType.avatar.setBulletinList] = (state, action) => {
  return state.set('BulletinList', action.bulletin_list)
}

reducer.prototype[actionType.avatar.setCurrentBBSession] = (state, action) => {
  return state.set('CurrentBBSession', action.current_BB_session)
}

reducer.prototype[actionType.avatar.setCurrentBulletin] = (state, action) => {
  return state.set('CurrentBulletin', action.bulletin)
}

reducer.prototype[actionType.avatar.setQuoteList] = (state, action) => {
  return state.set('QuoteList', action.quote_list)
}

reducer.prototype[actionType.avatar.setQuoteWhiteList] = (state, action) => {
  return state.set('QuoteWhiteList', action.quote_white_list)
}

reducer.prototype[actionType.avatar.addQuote] = (state, action) => {
  let quote_list = state.get('QuoteList')

  if (quote_list.length >= 8) {
    return
  }
  for (const quote of quote_list) {
    if (quote.Hash == action.hash) {
      return
    }
  }

  quote_list.push({
    Address: action.address,
    Sequence: action.sequence,
    Hash: action.hash
  })
  console.log(quote_list)
  return state.set('QuoteList', quote_list)
}

reducer.prototype[actionType.avatar.delQuote] = (state, action) => {
  let quote_list = state.get('QuoteList')
  let tmp_quote_list = []
  for (const quote of quote_list) {
    if (quote.Hash != action.Hash) {
      tmp_quote_list.push(quote)
    }
  }
  console.log(tmp_quote_list)
  return state.set('QuoteList', tmp_quote_list)
}