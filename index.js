/*
* @Author: Craig Bojko (c14486a)
* @Date:   2016-12-13 12:32:03
* @Last Modified by:   Craig Bojko (c14486a)
* @Last Modified time: 2016-12-13 14:38:24
*/

/* globals mboxTrack */

import './styles/main.less'
import $ from 'jquery'
import poll from './js/util/poller'
import html from './templates/main.html'

let ns = process.env.RFC_NAMESPACE
let env = process.env.NODE_ENV

let domDependancies = [
  '#main'
]

// Script entry
console.group()
console.info('RFC: %s', ns)
console.info('ENV: %s', env)
window.debug = {
  $: $
}

poll($, domDependancies, init)
console.groupEnd()

/**
 * Primary function to begin module execution - runs after Polling complete
 * @return {void} - return not necessary
 */
function init () {
  $(html({ns: ns})).appendTo('#main')

  $('body').show()
}
