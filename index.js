/**
 * Create a mock Proxy than can be chained and register different actions
 * @param {Object} data An object with this cofiguration fields:
 * - {prop: string => boolean} when: condition that, given the get property
 *                                   path, returns a boolean. When the
 *                                   condition is true, the value functons is
 *                                   called
 * - {pro: string => any} value: functond called when the condition is true.
 *                               Returns a vaue depending on the prop parameter
 * - {String} fieldStoreName: field of the mock that contains the registry of
 *                            all the calls and paths explored
 * @returns Proxy that could be chained
 */
const mockChain = ({
  value,
  when,
  fieldStoreName = 'calls',
}) => {
  const _getters = [];
  const _executions = {};
  const _calls = {
    _getters,
    _calls: _executions,
  };

  const storeCalls = (args, key) => {
    _executions[key] = _executions[key] || [];
    _executions[key].push(args);
  }

  const proxy = new Proxy(
    (...args) => {
      const key = _getters[_getters.length - 1];
      storeCalls(args, key)
      return proxy;
    }, {
      get(_, prop) {
        if (when(prop)) {
          _getters.push(prop)
          const result = value(prop);

          if (typeof result === 'function') {
            return (...args) => {
              storeCalls(args, prop)
              return result(...args)
            }
          }
          return result
        } else if (prop === fieldStoreName) {
          return _calls;
        }
        _getters.push(prop);
        return proxy;
      },
    },
  );

  return proxy;
}

module.exports = mockChain;
