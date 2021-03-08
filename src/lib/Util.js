function add0(m) { return m < 10 ? '0' + m : m }

function timestamp_format(timestamp) {
  var time = new Date(timestamp)
  var y = time.getFullYear()
  var m = time.getMonth() + 1
  var d = time.getDate()
  var h = time.getHours()
  var mm = time.getMinutes()
  var s = time.getSeconds()
  return y + '-' + add0(m) + '-' + add0(d) + ' ' + add0(h) + ':' + add0(mm) + ':' + add0(s)
}

function AddressToName(address_map, address) {
  if (address_map[address] != null) {
    return address_map[address]
  } else {
    return address
  }
}
export {
  timestamp_format,
  AddressToName
}