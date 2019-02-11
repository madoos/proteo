const { assign } = Object;

const getOptions = opt => {
    const defaultOpt = {
        value : x => x,
        when  : () => false,
        store : 'calls'
    };
    return assign(defaultOpt, opt);
};

const proteo = opt => {
    const { when, value, store } = getOptions(opt);

    let _getters = [];
    let _executions = {};

    const _calls = {
        clear : () => {
            _getters = [];
            _executions = {};
        },
        get : () => _executions
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
                } else if (prop === store) {
                    return _calls;
                }
                _getters.push(prop);
                return proxy;
            }
        }
    );

    return proxy;
};

module.exports = proteo;
