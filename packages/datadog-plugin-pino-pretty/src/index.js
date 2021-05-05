'use strict'

const { LOG } = require('../../../ext/formats')

function createWrapPrettifyObject (tracer, config) {
  return function wrapPrettifyObject (prettifyObject) {
    return function prettifyObjectWithTrace (input) {
      const span = tracer.scope().active()

      tracer.inject(span, LOG, input.input)

      return prettifyObject.apply(this, arguments)
    }
  }
}

module.exports = [
  {
    name: 'pino-pretty',
    versions: ['>=3'],
    file: 'lib/utils.js',
    patch (utils, tracer, config) {
      this.wrap(utils, 'prettifyObject', createWrapPrettifyObject(tracer, config))
    },
    unpatch (utils) {
      this.unwrap(utils, 'prettifyObject')
    }
  }
]
