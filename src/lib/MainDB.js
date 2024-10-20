import SQLite from "react-native-sqlite-storage"
import { ConsoleInfo, ConsoleError } from "./Util"

SQLite.enablePromise(true)

export default class Database {
  constructor() {
    this.db = null
  }

  async initDB(version, size) {
    try {
      // ConsoleInfo(`=====================Database opening`)
      this.db = await SQLite.openDatabase('main', version, 'main', size)
      // ConsoleInfo(`=====================Database opened`)
      await this.createTable('AVATAR_IMAGES', `CREATE TABLE IF NOT EXISTS AVATAR_IMAGES(
        address VARCHAR(40) PRIMARY KEY,
        image TEXT NOT NULL DEFAULT ''
        )`)

      ConsoleInfo(`************db init done********************`)
    } catch (e) {
      ConsoleError(e)
    }
  }

  dropTable(table_name, sql) {
    return new Promise((resolve) => {
      this.db.transaction((tx) => {
        tx.executeSql(sql)
      }).then((result) => {
        ConsoleInfo(`${table_name} drop successfully`)
        resolve(result)
      }).catch(e => {
        ConsoleError(e)
      })
    })
  }

  createTable(table_name, sql) {
    return new Promise((resolve) => {
      this.db.transaction((tx) => {
        tx.executeSql(sql)
      }).then((result) => {
        ConsoleInfo(`${table_name} created successfully`)
        resolve(result)
      }).catch(e => {
        ConsoleError(e)
      })
    })
  }

  closeDB(flag_clear_db) {
    ConsoleInfo("DB Checking")
    if (this.db) {
      ConsoleInfo("DB Closing")
      this.db.close()
        .then(() => {
          ConsoleInfo("DB closed")
          if (flag_clear_db) {
            SQLite.deleteDatabase({ name: 'main', location: 'default' }, () => {
              ConsoleInfo(`Database ${main} deleted successfully.`)
            }, e => {
              ConsoleError(e)
            })
          }
        })
        .catch(e => {
          ConsoleError(e)
          // this.errorCB(e)
        })
    } else {
      ConsoleInfo("Database was not OPENED")
    }
  }

  runSQL(sql) {
    if (sql.indexOf('INSERT') != -1) {
      // ConsoleInfo(`DEBUG======================================================INSERT SQL OK`)
    } else {
      // ConsoleInfo(`DEBUG======================================================INSERT SQL fail`)
      // ConsoleInfo(sql)
    }
    return new Promise((resolve, reject) => {
      this.db.transaction((tx) => {
        tx.executeSql(sql)
          .then(([tx, results]) => {
            resolve(results)
          })
      }).catch((e) => {
        ConsoleError(e)
      })
    })
  }

  getOne(sql) {
    // ConsoleInfo(`DEBUG======================================================getOne SQL`)
    ConsoleInfo(sql)
    return new Promise((resolve, reject) => {
      this.db.transaction((tx) => {
        tx.executeSql(sql)
          .then(([tx, results]) => {
            if (results.rows.length != 0) {
              resolve(results.rows.item(0))
            } else {
              resolve(null)
            }
          })
      }).catch((e) => {
        ConsoleError(e)
      })
    })
  }

  getAll(sql) {
    // ConsoleInfo(`DEBUG======================================================getOne SQL`)
    ConsoleInfo(sql)
    return new Promise((resolve, reject) => {
      this.db.transaction((tx) => {
        tx.executeSql(sql)
          .then(([tx, results]) => {
            let items = []
            let len = results.rows.length
            for (let i = 0; i < len; i++) {
              let item = results.rows.item(i)
              items.push(item)
            }
            ConsoleInfo(`#####################getAll#${items.length}`)
            resolve(items)
          })
      }).catch((e) => {
        ConsoleError(e)
      })
    })
  }
}