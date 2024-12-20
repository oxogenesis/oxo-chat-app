export const actionType = {
  master: {
    setMasterKey: 'SET_MASTER_KEY',
    setDark: 'SET_DARK',
    setMulti: 'SET_MULTI',
    setMainDB: 'SET_MAIN_DB',
    updateAvatarImage: 'UPDATE_AVATAR_IMAGE',
    setAvatarImage: 'SET_AVATAR_IMAGE',
    loadAvatarImage: 'LOAD_AVATAR_IMAGE'
  },
  avatar: {
    setReady: 'SET_READY',
    setAvatar: 'SET_AVATAR',
    setAvatarName: 'SET_AVATAR_NAME',
    setAvatarDB: 'SET_AVATAR_DB',

    enableAvatar: 'ENABLE_AVATAR',
    disableAvatar: 'DISABLE_AVATAR',
    resetAvatar: 'RESET_AVATAR',
    loadFromDB: 'LOAD_FROM_DB',

    setAddressBook: 'SET_ADDRESS_BOOK',
    setCurrentAddressMark: 'SET_CURRENT_ADDRESS_MARK',
    addAddressMark: 'ADD_ADDRESS_MARK',
    delAddressMark: 'DEL_ADDRESS_MARK',
    saveAddressName: 'SAVE_ADDRESS_NAME',
    setFriends: 'SET_FRIENDS',
    setFriendRequests: 'SET_FRIEND_REQUESTS',
    addFriend: 'ADD_FRIEND',
    delFriend: 'DEL_FRIEND',
    setFollows: 'SET_FOLLOWS',
    addFollow: 'ADD_FOLLOW',
    delFollow: 'DEL_FOLLOW',

    // Network
    Conn: 'CONN',
    setConnStatus: 'SET_CONN_STATUS',
    changeHostList: 'CHANGE_HOST_LIST',
    setHostList: 'SET_HOSTS_LIST',
    addHost: 'ADD_HOST',
    delHost: 'DEL_HOST',
    setCurrentHost: 'SET_CURRENT_HOST',
    changeCurrentHost: 'CHANGE_CURRENT_HOST',
    setWebSocket: 'SET_WEBSOCKET',
    setWebSocketChannel: 'SET_WEBSOCKET_CHANNEL',
    SendMessage: 'SEND_MESSAGE',

    setMessageGenerator: 'SET_MESSAGE_GENERATOR',

    addQuoteList: "ADD_QUOTE_LIST",
    delQuoteList: "DEL_QUOTE_LIST",
    setQuoteList: 'SET_QUOTE_LIST',
    setQuoteWhiteList: 'SET_QUOTE_WHITE_LIST',
    addFileList: 'ADD_FILE_LIST',
    delFileList: 'DEL_FILE_LIST',
    setReplyList: 'SET_REPLY_LIST',

    // Bulletin
    CacheLocalBulletinFile: 'CACHE_LOCAL_BULLETIN_FILE',
    LoadCurrentBulletinFile: 'LOAD_CURRENT_BULLETIN_FILE',
    setCurrentBulletinFile: 'SET_CURRENT_BULLETIN_FILE',
    HandleBulletinFileChunkRequest: 'HANDLE_BULLETIN_FILE_CHUNK_REQUEST',

    setTabBulletinList: 'SET_TAB_BULLETIN_LIST',
    setBulletinList: 'SET_BULLETIN_LIST',
    setBulletinCacheSize: 'SET_BULLETIN_CACHE_SIZE',
    ChangeBulletinCacheSize: 'CHANGE_BULLETIN_CACHE_SIZE',
    ClearBulletinCache: 'CLEAR_BULLETIN_CACHE',
    removeBulletinCache: 'REMOVE_BULLETIN_CACHE',
    LoadTabBulletinList: 'LOAD_TAB_BULLETIN_LIST',
    LoadBulletinList: 'LOAD_BULLETIN_LIST',
    LoadCurrentBulletin: 'LOAD_CURRENT_BULLETIN',
    MarkBulletin: "MARK_BULLETIN",
    UnmarkBulletin: "UNMARK_BULLETIN",
    UpdateFollowBulletin: "UPDATE_FOLLOW_BULLETIN",
    setCurrentBulletin: 'SET_CURRENT_BULLETIN',
    setNextBulletinSequence: 'SET_NEXT_BULLETIN_SEQUENCE',
    setRandomBulletin: 'SET_RANDOM_BULLETIN',
    setRandomBulletinFlag: 'SET_RANDOM_BULLETIN_FLAG',
    setBulletinAddressList: 'SET_BULLETIN_ADDRESS_LIST',
    setBulletinReplyList: 'SET_BULLETIN_REPLY_LIST',
    setCurrentBBSession: 'SET_CURRENT_BB_SESSION',

    HandleBulletinRequest: 'HANDLE_BULLETIN_REQUEST',
    SaveQuote: 'SAVE_QUOTE',
    SaveBulletin: 'SAVE_BULLETIN',
    SaveBulletinFile: 'SAVE_BULLETIN_FILE',
    // SaveContentBulletin: 'SAVE_CONTENT_BULLETIN',
    FetchBulletin: 'FETCH_BULLETIN',
    FetchBulletinFileChunk: 'FETCH_BULLETIN_FILE_CHUNK',
    SaveBulletinFileChunk: 'SAVE_BULLETIN_FILE_CHUNK',
    FetchRandomBulletin: 'FETCH_RANDOM_BULLETIN',
    FetchBulletinAddressList: 'FETCH_BULLETIN_ADDRESS_LIST',
    FetchBulletinReplyList: 'FETCH_BULLETIN_REPLY_LIST',
    PublishBulletin: 'PUBLISH_BULLETIN',
    SaveBulletinDraft: 'SAVE_BULLETIN_DRAFT',


    //Chat
    setSessionMap: 'SET_SESSION_MAP',
    setCurrentSession: 'SET_CURRENT_SESSION',
    setCurrentSessionAesKey: 'SET_CURRENT_SESSION_AES_KEY',
    setCurrentMessageList: 'SET_CURRENT_MESSAGE_LIST',
    LoadCurrentSession: 'LOAD_CURRENT_SESSION',
    LoadCurrentMessageList: 'LOAD_CURRENT_MESSAGE_LIST',

    LoadMsgInfo: 'LOAD_MSG_INFO',
    setMsgInfo: 'SET_MSG_INFO',

    HandleFriendECDH: 'HANDLE_FRIEND_ECDH',
    
    HandleFriendMessage: 'HANDLE_FRIEND_MESSAGE',
    SaveFriendMessage: 'SAVE_FRIEND_MESSAGE',
    HandleChatSyncFromFriend: 'HANDLE_CHAT_SYNC_FROM_FRIEND',
    HandleChatSyncFromServer: 'HANDLE_CHAT_SYNC_FROM_SERVER',
    SendFriendMessage: 'SEND_FRIEND_MESSAGE',
    setMessageWhiteList: 'SET_MESSAGE_WHITE_LIST',

    FetchChatFileChunk: 'FETCH_CHAT_FILE_CHUNK',
    SaveChatFileChunk: 'SAVE_CHAT_FILE_CHUNK'
  }
}