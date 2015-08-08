'use strict'

function acc (count, callback) {
  if (typeof count !== 'number' || (count | 0) !== count || count <= 0) {
    throw new Error('count needs to be > 0')
  }
  if (typeof callback !== 'function') {
    throw new Error('callback needs to be a function')
  }

  var results = []

  return function () {
    if (count === 0) {
      throw new Error('acc called too many times')
    }
    for (var i = 0; i < arguments.length; i++) {
      results[i] = results[i] || []
      results[i].push(arguments[i])
    }
    if (--count === 0) callback.apply(null, results)
  }
}

module.exports = acc
