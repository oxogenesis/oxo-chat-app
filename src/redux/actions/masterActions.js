import { actionType } from './actionType'
import { call, put, select, take, cancelled, fork } from 'redux-saga/effects'
import Database from '../../lib/MainDB'

export function* loadAvatarImage(action) {
  let db = new Database()

  yield call([db, db.initDB], '0.0.1', 0)
  yield put({ type: actionType.master.setMainDB, db: db })

  db = yield select(state => state.master.get('MainDB'))
  let sql = `SELECT * FROM AVATAR_IMAGES`
  let items = yield call([db, db.getAll], sql)
  let avatar_image = {}
  items.forEach(item => {
    if (item.image != '') {
      avatar_image[item.address] = item.image
    }
  })
  yield put({ type: actionType.master.setAvatarImage, avatar_image: avatar_image })
}

export function* updateAvatarImage(action) {
  let db = yield select(state => state.master.get('MainDB'))

  let sql = `SELECT * FROM AVATAR_IMAGES WHERE address = '${action.address}'`
  let item = yield call([db, db.getOne], sql)
  if (item != null) {
    sql = `UPDATE AVATAR_IMAGES SET image = '${action.image}' WHERE address = "${action.address}"`
  } else {
    sql = `INSERT INTO AVATAR_IMAGES (address, image)
      VALUES ('${action.address}', '${action.image}')`
  }
  yield call([db, db.runSQL], sql)

  sql = `SELECT * FROM AVATAR_IMAGES`
  let items = yield call([db, db.getAll], sql)
  let avatar_image = {}
  items.forEach(item => {
    if (item.image != '') {
      avatar_image[item.address] = item.image
    }
  })
  console.log(avatar_image)
  yield put({ type: actionType.master.setAvatarImage, avatar_image: avatar_image })
}