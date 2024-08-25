import AsyncStorage from '@react-native-async-storage/async-storage'

const kb = 1024
const mb = 1024 * 1024
const gb = 1024 * 1024 * 1024

function add0(m) { return m < 10 ? '0' + m : m }

function timestamp_format(timestamp) {
  let time = new Date(timestamp)
  let y = time.getFullYear()
  let m = time.getMonth() + 1
  let d = time.getDate()
  let h = time.getHours()
  let mm = time.getMinutes()
  let s = time.getSeconds()

  timestamp = new Date()
  let tmp = '@'
  if (y != timestamp.getFullYear()) {
    tmp += y + '-' + add0(m) + '-' + add0(d) + ' '
  } else {
    tmp += add0(m) + '-' + add0(d) + ' '
  }
  return tmp + add0(h) + ':' + add0(mm) + ':' + add0(s)
}

function filesize_format(filesize) {
  if (filesize >= gb) {
    return `${Number((filesize / gb).toFixed(2))}GB`
  } else if (filesize >= mb) {
    return `${Number((filesize / mb).toFixed(2))}MB`
  } else if (filesize >= kb) {
    return `${Number((filesize / kb).toFixed(2))}KB`
  } else {
    return `${filesize}B`
  }
}

function AddressToName(address_map, address) {
  if (address_map[address] != null) {
    return address_map[address]
  } else {
    return `${address.substr(0, 9)}...`
  }
}

async function ReadDraft(address) {
  try {
    const draft = await AsyncStorage.getItem(`${address}#draft`)
    return draft
  } catch (e) {
    console.log(e)
    return false
  }
}

// group by order by
function GBOB(array, name, size){
  let tmp_array = []
  for (let m = 0; m < array.length; m++) {
    const i = array[m]
    let flag_new_name = true
    for (let n = 0; n < tmp_array.length; n++) {
      const ti = tmp_array[n];
      if (i[name] == ti[name]) {
        flag_new_name = false
        if (i[size] >= ti[size]) {
          tmp_array[n][size] = i[size]
        }
        break
      }
    }
    if (flag_new_name) {
      tmp_array.push(i)
    }
  }
  return tmp_array
}

export {
  timestamp_format,
  filesize_format,
  AddressToName,
  GBOB,
  ReadDraft
}