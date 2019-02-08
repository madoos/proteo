const mockChain = ({ value, when, fieldStoreName = 'calls' }) => {
    const _getters = [];
    const _executions = {};

    const _calls = {
        _getters,
        _calls : _executions,
        clear  : () => {
            _calls._getters = [];
            _calls._calls = {};
        }
    };

    const storeCalls = (args, key) => {
        _executions[key] = _executions[key] || [];
        _executions[key].push(args);
    };

    const proxy = new Proxy(
        (...args) => {
            const key = _getters[_getters.length - 1];
            storeCalls(args, key);
            return proxy;
        },
        {
            get(_, prop) {
                if (when(prop)) {
                    _getters.push(prop);
                    const result = value(prop);

                    if (typeof result === 'function') {
                        return (...args) => {
                            storeCalls(args, prop);
                            return result(...args);
                        };
                    }
                    return result;
                } else if (prop === fieldStoreName) {
                    return _calls;
                }
                _getters.push(prop);
                return proxy;
            }
        }
    );

    return proxy;
};

module.exports = mockChain;
