import SQLite from "react-native-sqlite-storage"

SQLite.enablePromise(true)

export default class Database {
  constructor() {
    this.db = null
  }

  async initDB(version, size) {
    try {
      // console.log(`=====================Database opening`)
      this.db = await SQLite.openDatabase('main', version, 'main', size)
      // console.log(`=====================Database opened`)
      await this.createTable('AVATAR_IMAGES', `CREATE TABLE IF NOT EXISTS AVATAR_IMAGES(
        address VARCHAR(40) PRIMARY KEY,
        image TEXT NOT NULL DEFAULT ''
        )`)

      console.log(`************db init done********************`)
    } catch (e) {
      console.log(e)
    }
  }

  dropTable(table_name, sql) {
    return new Promise((resolve) => {
      this.db.transaction((tx) => {
        tx.executeSql(sql)
      }).then((result) => {
        console.log(`${table_name} drop successfully`)
        resolve(result)
      }).catch(error => {
        console.log(error)
      })
    })
  }

  createTable(table_name, sql) {
    return new Promise((resolve) => {
      this.db.transaction((tx) => {
        tx.executeSql(sql)
      }).then((result) => {
        console.log(`${table_name} created successfully`)
        resolve(result)
      }).catch(error => {
        console.log(error)
      })
    })
  }

  closeDB(flag_clear_db) {
    console.log("DB Checking")
    if (this.db) {
      console.log("DB Closing")
      this.db.close()
        .then(() => {
          console.log("DB closed")
          if (flag_clear_db) {
            SQLite.deleteDatabase({ name: 'main', location: 'default' }, () => {
              console.log(`Database ${main} deleted successfully.`)
            }, error => {
              console.log(`Error while deleting database ${main}: `, error)
            })
          }
        })
        .catch(error => {
          console.log(error)
          // this.errorCB(error)
        })
    } else {
      console.log("Database was not OPENED")
    }
  }

  runSQL(sql) {
    if (sql.indexOf('INSERT') != -1) {
      // console.log(`DEBUG======================================================INSERT SQL OK`)
    } else {
      // console.log(`DEBUG======================================================INSERT SQL fail`)
      // console.log(sql)
    }
    return new Promise((resolve, reject) => {
      this.db.transaction((tx) => {
        tx.executeSql(sql)
          .then(([tx, results]) => {
            resolve(results)
          })
      }).catch((err) => {
        console.log(err)
      })
    })
  }

  getOne(sql) {
    // console.log(`DEBUG======================================================getOne SQL`)
    console.log(sql)
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
      }).catch((err) => {
        console.log(err)
      })
    })
  }

  getAll(sql) {
    // console.log(`DEBUG======================================================getOne SQL`)
    console.log(sql)
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
            console.log(`#####################getAll#${items.length}`)
            resolve(items)
          })
      }).catch((err) => {
        console.log(err)
      })
    })
  }
}