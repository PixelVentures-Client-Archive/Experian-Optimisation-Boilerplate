/*
* @Author: Craig Bojko (c14486a)
* @Date:   2016-12-13 12:32:03
* @Last Modified by:   Craig Bojko (c14486a)
* @Last Modified time: 2016-12-13 14:43:46
*/

let count = 0

export default function poll (...args) {
  if (args.length > 2 && typeof args[0] === 'function') { // JQuery object supplied) {
    pollWithJquery(args[0], args[1], args[2])
  } else { // Get jquery from window scope
    pollWithoutJquery(args[0], args[1])
  }
}

export function pollWithJquery ($, domDependancies, cb, time) {
  time = time || 50
  let domCheck = 0
  for (var i of domDependancies) {
    if ($(i).length) {
      domCheck++
    }
  }
  console.log('POLLER: DC:: %s', domCheck)
  if ($ && domCheck === domDependancies.length) {
    cb()
  } else {
    setTimeout(function () {
      pollWithJquery($, domDependancies, cb, time * 1.5)
    }, time)
  }
}

export function pollWithoutJquery (domDependancies, cb, time) {
  time = time || 50
  let $ = window.jQuery
  let domCheck = 0

  if (count >= 5) {
    document.getElementsByTagName('body')[0].style.display = 'block'
    console.error('POLLER FAILED WITHIN 5 ATTEMPTS.')
  }

  for (var i of domDependancies) {
    if ($ && $(i).length) {
      domCheck++
    }
  }
  console.log('POLLER: DC:: %s', domCheck)

  if ($ && domCheck === domDependancies.length) {
    cb()
  } else {
    count++
    setTimeout(function () {
      pollWithoutJquery(domDependancies, cb, time * 1.5)
    }, time)
  }
}
