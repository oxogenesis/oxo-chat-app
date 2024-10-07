import SQLite from "react-native-sqlite-storage"
// import { resolve } from "url"

SQLite.enablePromise(true)

export default class Database {
  constructor() {
    this.db = null
  }

  async initDB(name, version, displayName, size) {
    try {
      // console.log(`=====================Database opening`)
      this.db = await SQLite.openDatabase(name, version, displayName, size)
      // console.log(`=====================Database opened`)
      await this.createTable('ADDRESS_MARKS', `CREATE TABLE IF NOT EXISTS ADDRESS_MARKS(
        address VARCHAR(35) PRIMARY KEY,
        name VARCHAR(20) NOT NULL,
        created_at INTEGER NOT NULL,
        updated_at INTEGER NOT NULL
        )`)
      await this.createTable('FRIENDS', `CREATE TABLE IF NOT EXISTS FRIENDS(
        address VARCHAR(35) PRIMARY KEY,
        created_at INTEGER NOT NULL,
        updated_at INTEGER NOT NULL
        )`)
      await this.createTable('FRIEND_REQUESTS', `CREATE TABLE IF NOT EXISTS FRIEND_REQUESTS(
          address VARCHAR(35) PRIMARY KEY,
          updated_at INTEGER NOT NULL
          )`)
      await this.createTable('FOLLOWS', `CREATE TABLE IF NOT EXISTS FOLLOWS(
        address VARCHAR(35) PRIMARY KEY,
        created_at INTEGER NOT NULL,
        updated_at INTEGER NOT NULL
        )`)

      // await this.dropTable('ECDHS', `DROP TABLE IF EXISTS ECDHS`)
      await this.createTable('ECDHS', `CREATE TABLE IF NOT EXISTS ECDHS(
        address VARCHAR(35) NOT NULL,
        partition INTEGER NOT NULL,
        sequence INTEGER NOT NULL,
        aes_key TEXT,
        private_key TEXT,
        public_key TEXT,
        self_json TEXT,
        pair_json TEXT,
        PRIMARY KEY (address, partition, sequence)
        )`)

      //timestamp: time that json is sign
      //created_at: time that insert into db
      //confirmed: pair has comfirmed "this message is received and readed"
      //readed: self has read "this message from pair"
      await this.createTable('MESSAGES', `CREATE TABLE IF NOT EXISTS MESSAGES(
        hash VARCHAR(32) PRIMARY KEY,
        sour_address VARCHAR(35),
        dest_address VARCHAR(35),
        sequence INTEGER,
        pre_hash VARCHAR(32) NOT NULL,
        content TEXT,
        timestamp INTEGER,
        created_at INTEGER,
        json TEXT,
        confirmed BOOLEAN DEFAULT FALSE,
        readed BOOLEAN DEFAULT FALSE,
        is_object BOOLEAN DEFAULT FALSE,
        object_type TEXT,
        is_file BOOLEAN DEFAULT FALSE,
        file_saved BOOLEAN DEFAULT FALSE,
        file_hash VARCHAR(40)
        )`)

      // bulletin
      await this.createTable('BULLETINS', `CREATE TABLE IF NOT EXISTS BULLETINS(
        hash VARCHAR(32) PRIMARY KEY,
        address VARCHAR(35) NOT NULL,
        sequence INTEGER,
        pre_hash VARCHAR(32) NOT NULL,
        quote_count INTEGER,
        file_count INTEGER,
        content TEXT,
        timestamp INTEGER,
        created_at INTEGER,
        json TEXT,
        relay_address VARCHAR(35),
        view_at INTEGER,
        mark_at INTEGER,
        is_mark BOOLEAN DEFAULT FALSE,
        is_cache BOOLEAN DEFAULT TRUE
        )`)

      // quote
      await this.createTable('QUOTES', `CREATE TABLE IF NOT EXISTS QUOTES(
        main_hash VARCHAR(32) NOT NULL PRIMARY KEY,
        address VARCHAR(35) NOT NULL,
        sequence INTEGER NOT NULL,
        quote_hash VARCHAR(32) NOT NULL,
        content text NOT NULL,
        signed_at INTEGER NOT NULL
        )`)

      // bulletin file
      await this.createTable('BULLETIN_FILES', `CREATE TABLE IF NOT EXISTS BULLETIN_FILES(
        hash VARCHAR(32) NOT NULL PRIMARY KEY,
        name text NOT NULL,
        ext VARCHAR(5) NOT NULL,
        size INTEGER NOT NULL,
        chunk_length INTEGER NOT NULL,
        chunk_cursor INTEGER NOT NULL
        )`)

      //group
      await this.createTable('GROUPS', `CREATE TABLE IF NOT EXISTS GROUPS(
        group_hash VARCHAR(32) NOT NULL PRIMARY KEY,
        group_address VARCHAR(35) NOT NULL,
        group_name text NOT NULL,
        membership INTEGER,
        updated_at INTEGER
        )`)

      //add, remove
      await this.createTable('GROUP_REQUESTS', `CREATE TABLE IF NOT EXISTS GROUP_REQUESTS(
        address VARCHAR(32) NOT NULL,
        group_hash VARCHAR(32) NOT NULL,
        json TEXT,
        created_at INTEGER,
        PRIMARY KEY (group_hash, address)
        )`)

      //add only
      await this.createTable('GROUP_MANAGES', `CREATE TABLE IF NOT EXISTS GROUP_MANAGES(
        group_hash VARCHAR(32) NOT NULL,
        sequence INTEGER,
        json TEXT,
        hash VARCHAR(32) NOT NULL,
        created_at INTEGER,
        PRIMARY KEY (group_hash, sequence)
        )`)

      //add, remove
      await this.createTable('GROUP_MEMBERS', `CREATE TABLE IF NOT EXISTS GROUP_MEMBERS(
        group_hash VARCHAR(32) NOT NULL,
        address VARCHAR(35) NOT NULL,
        joined_at INTEGER,
  
        aes_key TEXT,
        private_key TEXT,
        public_key TEXT,
        self_json TEXT,
        pair_json TEXT,
  
        PRIMARY KEY (group_hash, address)
        )`)

      //add only, update(readed) only
      await this.createTable('GROUP_MESSAGES', `CREATE TABLE IF NOT EXISTS GROUP_MESSAGES(
        hash VARCHAR(32) PRIMARY KEY,
        group_hash VARCHAR(32) NOT NULL,
        sour_address VARCHAR(35),
        sequence INTEGER,
        pre_hash VARCHAR(32) NOT NULL,
        content TEXT,
        timestamp INTEGER,
        created_at INTEGER,
        json TEXT,
        readed BOOLEAN DEFAULT FALSE,
        is_file BOOLEAN DEFAULT FALSE,
        file_saved BOOLEAN DEFAULT FALSE,
        file_hash VARCHAR(40)
        )`)

      await this.createTable('FILES', `CREATE TABLE IF NOT EXISTS FILES(
        hash VARCHAR(40) PRIMARY KEY,
        name TEXT NOT NULL,
        ext TEXT NOT NULL,
        size INTEGER NOT NULL,
        chunk INTEGER NOT NULL,
        current_chunk INTEGER DEFAULT -1,
        saved BOOLEAN DEFAULT false,
        created_at INTEGER
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
        // console.log(`${table_name} drop successfully`)
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
        // console.log(`${table_name} created successfully`)
        resolve(result)
      }).catch(error => {
        console.log(error)
      })
    })
  }

  closeDB(flag_clear_db, address) {
    console.log("DB Checking")
    if (this.db) {
      console.log("DB Closing")
      this.db.close()
        .then(() => {
          console.log("DB closed")
          if (flag_clear_db) {
            SQLite.deleteDatabase({ name: address, location: 'default' }, () => {
              console.log(`Database ${address} deleted successfully.`)
            }, error => {
              console.log(`Error while deleting database ${address}: `, error)
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