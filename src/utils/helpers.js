
export const applyDrag = (arr, dragResult) => {
  const { removedIndex, addedIndex, payload } = dragResult
  if (removedIndex === null && addedIndex === null) return arr

  const result = [...arr]
  let itemToAdd = payload

  if (removedIndex !== null) {
    itemToAdd = result.splice(removedIndex, 1)[0]
  }
  if (addedIndex !== null) {
    result.splice(addedIndex, 0, itemToAdd)
  }

  return result
}
export const getMMDDYY = (dt) => {
  var res = ''
  res += formatDigits(dt.getMonth() + 1)
  res += '/'
  res += formatDigits(dt.getDate())
  res += '/'
  res += formatDigits(dt.getFullYear())
  return res
}

export const getHHMM = (dt) => {
  var res = ''
  res += formatDigits(dt.getHours() > 12 ? dt.getHours() - 12 : dt.getHours())
  res += ':'
  res += formatDigits(dt.getMinutes())
  res += ' ' + dt.getHours() > 11 ? ' PM' : ' AM'
  if (res.charAt(0) === '0') {
    res = res.slice(1, 8)
  }
  return res
}

export const getDayOfWeek = (dt) => {
  var res = ''

  var weekday = new Array(7)
  weekday[0] = 'Sunday'
  weekday[1] = 'Monday'
  weekday[2] = 'Tuesday'
  weekday[3] = 'Wednesday'
  weekday[4] = 'Thursday'
  weekday[5] = 'Friday'
  weekday[6] = 'Saturday'

  res = weekday[dt.getDay()]

  return res
}

export const formatDigits = (val) => {
  val = val.toString()
  return val.length === 1 ? '0' + val : val
}

export const formatDate = (messageDate, nextDate = '') => {
  messageDate += 'Z'
  nextDate += 'Z'
  const date1 = new Date(messageDate)
  const date2 = new Date(nextDate)
  var diffTime = Math.abs(date2.getTime() - date1.getTime())
  diffTime /= 1000
  // If meesage sent within 2.5 min of previous message, don't display time
  if (diffTime < 150) {
    return ''
  } else if (date1.toDateString() === new Date().toDateString()) {
    // If message was sent today, format for HH:MM AM/PM
    return getHHMM(date1)
  } else if (diffTime < 604800) {
  // If less than a week (604800) diff in seconds from today, display week day
    if (date1.toDateString() === date2.toDateString()) {
      return ''
    }
    return getDayOfWeek(date1)
  } else {
    // Else, format to MM/DD/YYYY
    if (date1.toDateString() === date2.toDateString()) {
      return ''
    }
    return getMMDDYY(date1)
  }
}
