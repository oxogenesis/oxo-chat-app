import { all, takeEvery, fork } from 'redux-saga/effects'

import { actionType } from './actionType'
import * as masterActions from './masterActions'
import * as avatarActions from './avatarActions'

export default function* rootSaga() {

  //-------------------------------------------->master
  yield takeEvery(actionType.master.loadAvatarImage, masterActions.loadAvatarImage)
  yield takeEvery(actionType.master.updateAvatarImage, masterActions.updateAvatarImage)

  //-------------------------------------------->avatar
  yield takeEvery(actionType.avatar.enableAvatar, avatarActions.enableAvatar)
  yield takeEvery(actionType.avatar.disableAvatar, avatarActions.disableAvatar)
  yield takeEvery(actionType.avatar.loadFromDB, avatarActions.loadFromDB)

  yield takeEvery(actionType.avatar.addAddressMark, avatarActions.addAddressMark)
  yield takeEvery(actionType.avatar.delAddressMark, avatarActions.delAddressMark)
  yield takeEvery(actionType.avatar.saveAddressName, avatarActions.saveAddressName)

  yield takeEvery(actionType.avatar.addFriend, avatarActions.addFriend)
  yield takeEvery(actionType.avatar.delFriend, avatarActions.delFriend)

  yield takeEvery(actionType.avatar.addFollow, avatarActions.addFollow)
  yield takeEvery(actionType.avatar.delFollow, avatarActions.delFollow)

  yield takeEvery(actionType.avatar.changeHostList, avatarActions.changeHostList)
  yield takeEvery(actionType.avatar.addHost, avatarActions.addHost)
  yield takeEvery(actionType.avatar.delHost, avatarActions.delHost)
  yield takeEvery(actionType.avatar.changeCurrentHost, avatarActions.changeCurrentHost)

  yield takeEvery(actionType.avatar.Conn, avatarActions.Conn)
  yield takeEvery(actionType.avatar.SendMessage, avatarActions.SendMessage)

  // Bulletin
  yield takeEvery(actionType.avatar.ChangeBulletinCacheSize, avatarActions.ChangeBulletinCacheSize)
  yield takeEvery(actionType.avatar.ClearBulletinCache, avatarActions.ClearBulletinCache)

  yield takeEvery(actionType.avatar.LoadTabBulletinList, avatarActions.LoadTabBulletinList)
  yield takeEvery(actionType.avatar.UpdateFollowBulletin, avatarActions.UpdateFollowBulletin)
  yield takeEvery(actionType.avatar.LoadBulletinList, avatarActions.LoadBulletinList)
  yield takeEvery(actionType.avatar.HandleBulletinRequest, avatarActions.HandleBulletinRequest)
  yield takeEvery(actionType.avatar.SaveQuote, avatarActions.SaveQuote)
  yield takeEvery(actionType.avatar.SaveBulletinFile, avatarActions.SaveBulletinFile)
  yield takeEvery(actionType.avatar.SaveBulletin, avatarActions.SaveBulletin)
  // yield takeEvery(actionType.avatar.SaveContentBulletin, avatarActions.SaveContentBulletin)
  yield takeEvery(actionType.avatar.FetchRandomBulletin, avatarActions.FetchRandomBulletin)
  yield takeEvery(actionType.avatar.FetchBulletin, avatarActions.FetchBulletin)
  yield takeEvery(actionType.avatar.PublishBulletin, avatarActions.PublishBulletin)

  // BulletinFile
  yield takeEvery(actionType.avatar.CacheLocalBulletinFile, avatarActions.CacheLocalBulletinFile)
  yield takeEvery(actionType.avatar.LoadCurrentBulletinFile, avatarActions.LoadCurrentBulletinFile)
  yield takeEvery(actionType.avatar.HandleBulletinFileChunkRequest, avatarActions.HandleBulletinFileChunkRequest)
  yield takeEvery(actionType.avatar.FetchBulletinFileChunk, avatarActions.FetchBulletinFileChunk)
  yield takeEvery(actionType.avatar.SaveBulletinFileChunk, avatarActions.SaveBulletinFileChunk)

  yield takeEvery(actionType.avatar.SaveBulletinDraft, avatarActions.SaveBulletinDraft)
  yield takeEvery(actionType.avatar.LoadCurrentBulletin, avatarActions.LoadCurrentBulletin)
  yield takeEvery(actionType.avatar.MarkBulletin, avatarActions.MarkBulletin)
  yield takeEvery(actionType.avatar.UnmarkBulletin, avatarActions.UnmarkBulletin)
  yield takeEvery(actionType.avatar.FetchBulletinAddressList, avatarActions.FetchBulletinAddressList)
  yield takeEvery(actionType.avatar.FetchBulletinReplyList, avatarActions.FetchBulletinReplyList)

  // Chat
  yield takeEvery(actionType.avatar.LoadCurrentSession, avatarActions.LoadCurrentSession)
  yield takeEvery(actionType.avatar.LoadCurrentMessageList, avatarActions.LoadCurrentMessageList)
  yield takeEvery(actionType.avatar.LoadMsgInfo, avatarActions.LoadMsgInfo)
  yield takeEvery(actionType.avatar.HandleFriendECDH, avatarActions.HandleFriendECDH)
  yield takeEvery(actionType.avatar.HandleFriendMessage, avatarActions.HandleFriendMessage)
  yield takeEvery(actionType.avatar.SaveFriendMessage, avatarActions.SaveFriendMessage)
  yield takeEvery(actionType.avatar.HandleChatSyncFromFriend, avatarActions.HandleChatSyncFromFriend)
  yield takeEvery(actionType.avatar.HandleChatSyncFromServer, avatarActions.HandleChatSyncFromServer)
  yield takeEvery(actionType.avatar.SendFriendMessage, avatarActions.SendFriendMessage)

  // Chat File
  yield takeEvery(actionType.avatar.FetchChatFileChunk, avatarActions.FetchChatFileChunk)
  yield takeEvery(actionType.avatar.SaveChatFileChunk, avatarActions.SaveChatFileChunk)
}