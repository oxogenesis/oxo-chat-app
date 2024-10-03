import AsyncStorage from '@react-native-async-storage/async-storage'

const ConsoleColors = {
  'bright': '\x1B[1m%s\x1B[0m', // 亮色
  'grey': '\x1B[2m%s\x1B[0m', // 灰色
  'italic': '\x1B[3m%s\x1B[0m', // 斜体
  'underline': '\x1B[4m%s\x1B[0m', // 下划线
  'reverse': '\x1B[7m%s\x1B[0m', // 反向
  'hidden': '\x1B[8m%s\x1B[0m', // 隐藏
  'black': '\x1B[30m%s\x1B[0m', // 黑色
  'red': '\x1B[31m%s\x1B[0m', // 红色
  'green': '\x1B[32m%s\x1B[0m', // 绿色
  'yellow': '\x1B[33m%s\x1B[0m', // 黄色
  'blue': '\x1B[34m%s\x1B[0m', // 蓝色
  'magenta': '\x1B[35m%s\x1B[0m', // 品红
  'cyan': '\x1B[36m%s\x1B[0m', // 青色
  'white': '\x1B[37m%s\x1B[0m', // 白色
  'blackBG': '\x1B[40m%s\x1B[0m', // 背景色为黑色
  'redBG': '\x1B[41m%s\x1B[0m', // 背景色为红色
  'greenBG': '\x1B[42m%s\x1B[0m', // 背景色为绿色
  'yellowBG': '\x1B[43m%s\x1B[0m', // 背景色为黄色
  'blueBG': '\x1B[44m%s\x1B[0m', // 背景色为蓝色
  'magentaBG': '\x1B[45m%s\x1B[0m', // 背景色为品红
  'cyanBG': '\x1B[46m%s\x1B[0m', // 背景色为青色
  'whiteBG': '\x1B[47m%s\x1B[0m' // 背景色为白色
}

function ConsoleInfo(str) {
  console.log(ConsoleColors.green, str)
}

function ConsoleWarn(str) {
  console.log(ConsoleColors.yellow, str)
}

function ConsoleError(str) {
  console.log(ConsoleColors.red, str)
}

function ConsoleDebug(str) {
  console.log(ConsoleColors.redBG, str)
}

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
function GBOB(array, name, size) {
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
  ConsoleInfo,
  ConsoleWarn,
  ConsoleError,
  ConsoleDebug,
  timestamp_format,
  filesize_format,
  AddressToName,
  GBOB,
  ReadDraft
}