'use strict'

function acc (count, callback) {
  if (typeof count !== 'number' || (count | 0) !== count || count < 0) {
    throw new Error('count needs to be > 0')
  }
  if (typeof callback !== 'function') {
    throw new Error('callback needs to be a function')
  }

  var results = []

  var invoked = 0

  return function () {
    if (invoked === count) {
      throw new Error('acc called too many times')
    }
    for (var i = 0; i < arguments.length; i++) {
      results[i] = results[i] || []
      results[i][invoked] = arguments[i]
    }
    if (++invoked === count) callback.apply(null, results)
  }
}

module.exports = acc
