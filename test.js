var test = require('tape')
var acc = require('./')

test('basic', function (t) {
  t.plan(2)

  var fn = acc(2, function () {
    t.pass('should invoke callback after 2 calls')
    t.deepEqual(Array.prototype.slice.call(arguments), [
      [1, 2],
      [2, 3],
      [3, 4]
    ], 'should invoke callback with accumulated result')
  })
  fn(1, 2, 3)
  fn(2, 3, 4)
})

test('inconsistent arguments', function (t) {
  t.plan(5)

  var fn = acc(2, function () {
    var args = Array.prototype.slice.call(arguments)
    t.deepEqual(args[0], [1, 2])

    // tape's deep-equal dependency doesn't handle sparse arrays correctly.
    // See https://github.com/substack/node-deep-equal/issues/2
    t.deepEqual(args[1][0], undefined)
    t.deepEqual(args[1][1], 3)
    t.deepEqual(args[2][0], undefined)
    t.deepEqual(args[2][1], 4)
  })
  fn(1)
  fn(2, 3, 4)
})

test('chainable', function (t) {
  t.plan(3)

  var fn = acc(2, function () {
    t.pass('should invoke callback after 2 calls')
  })
  t.equal(fn(), fn, 'should be chainable')
  t.equal(fn(), fn, 'should be chainable')
})

test('called too ofen', function (t) {
  t.plan(2)

  var fn = acc(2, function () {
    t.pass('should invoke callback after 2 calls')
  })
  fn()
  fn()
  t.throws(function () {
    fn()
  }, 'should throw an error after more than 2 calls')
})

test('invalid args', function (t) {
  var invalidArgs = [
    [null, null],
    [null, function () {}],
    [1.5, function () {}],
    [-1, function () {}],
    [-1.5, function () {}],
    [3, '']
  ]
  invalidArgs.forEach(function (args) {
    t.throws(function () {
      acc(args[0], args[1])
    }, 'should throw for acc(' + args[0] + ', ' + args[1] + ')')
  })

  t.end()
})

test('progress', function (t) {
  var args = []
  var fn = acc(2, function () {
    args.push(['cb', arguments])
  }, function () {
    args.push(['progress', arguments])
  })

  fn(1, 2)
  fn(1.5, 2.5)

  // deepEqual hack, again
  t.equal(JSON.stringify(args), JSON.stringify([
    [ 'progress', { 0: 1, 1: 2, 2: [ 1, 2 ] } ],
    [ 'progress', { 0: 2, 1: 2, 2: [ 1.5, 2.5 ] } ],
    [ 'cb', { 0: [ 1, 1.5 ], 1: [ 2, 2.5 ] } ]
  ]))

  t.end()
})
