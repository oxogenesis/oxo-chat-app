import { all, takeEvery, fork } from 'redux-saga/effects'

import { actionType } from './actionType'
import * as masterActions from './masterActions'
import * as avatarActions from './avatarActions'

export default function* rootSaga() {
  //avatar
  yield takeEvery(actionType.avatar.enableAvatar, avatarActions.enableAvatar)
  yield takeEvery(actionType.avatar.disableAvatar, avatarActions.disableAvatar)

  yield takeEvery(actionType.avatar.addAddressMark, avatarActions.addAddressMark)

  yield takeEvery(actionType.avatar.addFriend, avatarActions.addFriend)
  yield takeEvery(actionType.avatar.delFriend, avatarActions.delFriend)

  yield takeEvery(actionType.avatar.addFollow, avatarActions.addFollow)
  yield takeEvery(actionType.avatar.delFollow, avatarActions.delFollow)

  yield takeEvery(actionType.avatar.addHost, avatarActions.addHost)
  yield takeEvery(actionType.avatar.delHost, avatarActions.delHost)
  yield takeEvery(actionType.avatar.changeCurrentHost, avatarActions.changeCurrentHost)

  yield takeEvery(actionType.avatar.Conn, avatarActions.Conn)

  yield takeEvery(actionType.avatar.LoadBulletinList, avatarActions.LoadBulletinList)
  yield takeEvery(actionType.avatar.HandleBulletinRequest, avatarActions.HandleBulletinRequest)
  yield takeEvery(actionType.avatar.SaveBulletin, avatarActions.SaveBulletin)
  yield takeEvery(actionType.avatar.SaveContentBulletin, avatarActions.SaveContentBulletin)
  yield takeEvery(actionType.avatar.FetchBulletin, avatarActions.FetchBulletin)
  yield takeEvery(actionType.avatar.PublishBulletin, avatarActions.PublishBulletin)
  yield takeEvery(actionType.avatar.LoadCurrentBulletin, avatarActions.LoadCurrentBulletin)
}