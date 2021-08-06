export const actionType = {
  master: {
    setMasterKey: 'SET_MASTER_KEY'
  },
  avatar: {
    setAvatar: 'SET_AVATAR',
    setAvatarName: 'SET_AVATAR_NAME',
    setDatabase: 'SET_DATABASE',

    setHosts: 'SET_HOSTS',

    setAddressBook: 'SET_ADDRESS_BOOK',
    setFriends: 'SET_FRIENDS',
    setFollows: 'SET_FOLLOWS',

    setBulletinList: 'SET_BULLETIN_LIST',

    enableAvatar: 'ENABLE_AVATAR',
    disableAvatar: 'DISABLE_AVATAR',
    resetAvatar: 'RESET_AVATAR',

    setCurrentAddressMark: 'SET_CURRENT_ADDRESS_MARK',
    addAddressMark: 'ADD_ADDRESS_MARK',
    saveAddressName: 'SAVE_ADDRESS_NAME',
    addFriend: 'ADD_FRIEND',
    delFriend: 'DEL_FRIEND',
    addFollow: 'ADD_FOLLOW',
    delFollow: 'DEL_FOLLOW',

    addHost: 'ADD_HOST',
    setCurrentHost: 'SET_CURRENT_HOST',
    changeCurrentHost: 'CHANGE_CURRENT_HOST',
    delHost: 'DEL_HOST',
    setWebSocket: 'SET_WEBSOCKET',
    setWebSocketChannel: 'SET_WEBSOCKET_CHANNEL',
    setMessageGenerator: 'SET_MESSAGE_GENERATOR',
    setCurrentBBSession: 'SET_CURRENT_BB_SESSION',
    setCurrentBulletin: 'SET_CURRENT_BULLETIN',
    addQuote: "ADD_QUOTE",
    delQuote: "DEL_QUOTE",
    setQuoteList: 'SET_QUOTE_LIST',
    setQuoteWhiteList: 'SET_QUOTE_WHITE_LIST',
    Conn: 'CONN',

    LoadBulletinList: 'LOAD_BULLETIN_LIST',
    LoadCurrentBulletin: 'LOAD_CURRENT_BULLETIN',
    MarkBulletin: "MARK_BULLETIN",
    UnmarkBulletin: "UNMARK_BULLETIN",

    HandleBulletinRequest: 'HANDLE_BULLETIN_REQUEST',
    SaveBulletin: 'SAVE_BULLETIN',
    SaveContentBulletin: 'SAVE_CONTENT_BULLETIN',
    FetchBulletin: 'FETCH_BULLETIN',
    PublishBulletin: 'PUBLISH_BULLETIN'
  }
}