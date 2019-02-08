const { equals, always, identity } = require('ramda');
const mock = require('./');

test('Should create mock chain', () => {
    const res = mock({
        when  : equals('send'),
        value : always(identity)
    });

    const response = res
        .status(200)
        .json()
        .utf8.send({ data : true });

    expect(response).toEqual({ data : true });
    expect(res.calls._getters).toEqual(['status', 'json', 'utf8', 'send']);
    expect(res.calls._calls).toEqual({
        status : [[200]],
        json   : [[]],
        send   : [[{ data : true }]]
    });
});

test('Should create mock for functions', () => {
    const array = mock({
        when  : equals('reduce'),
        value : always(always(12))
    });

    const result = array([1, 2, 3])
        .map(n => n * 2)
        .reduce((a, b) => a + b);

    expect(result).toEqual(12);
});

test('Should create mock for objects', () => {
    const api = mock({
        when  : equals('finish'),
        value : always('finish')
    });
    const result = api.a.b().c.d().finish;
    expect(result).toEqual('finish');
});

test('Should change field storage name', () => {
    const rx = mock({
        when           : equals('subscribe'),
        value          : always(a => a(5)),
        fieldStoreName : '__secret__'
    });

    rx.Observable.from([1, 2, 3])
        .map(n => n * 2)
        .scan((a, b) => a.concat(b))
        .subscribe(x => {
            expect(x).toEqual(5);
        });

    expect(rx.secret).toEqual(rx);
    expect(rx.__secret__._getters).toBeInstanceOf(Array);
});

test('Should clear storage', () => {
    const _ = mock({
        when  : equals('value'),
        value : always(always({ a : 6 }))
    });

    const result = _.chain({ a : 2 })
        .map(n => n * 3)
        .value();

    expect(result).toEqual({ a : 6 });
    expect(_.calls._getters).toHaveLength(3);
    _.calls.clear();
    expect(_.calls._getters).toHaveLength(0);
});
