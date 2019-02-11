const { equals, always, identity } = require('ramda');
const proteo = require('./');

test('Should chain objects', () => {
    const api = proteo();
    expect(api()).toEqual(api);
    expect(api.a.b()).toEqual(api);
    expect(api.a().b).toEqual(api);
    expect(api.a().b().c).toEqual(api);
});

test('Should get calls', () => {
    const api = proteo({
        when  : equals('send'),
        value : always(identity)
    });

    const response = api.status(200).send({ data : true });

    expect(response).toEqual({ data : true });
    expect(api.calls.get()).toEqual({
        status : [[200]],
        send   : [[{ data : true }]]
    });
});

test('Should clear calls', () => {
    const api = proteo({
        when  : equals('finish'),
        value : always(true)
    });

    expect(api.a(1).calls.get()).toEqual({ a : [[1]] });
    api.calls.clear();
    expect(api.calls.get()).toEqual({});
    expect(api.a(true).calls.get()).toEqual({ a : [[true]] });
});

test('Should change store name', () => {
    const api = proteo({
        when  : equals('finish'),
        value : always(true),
        store : 'store'
    });

    expect(api.a(1).store.get()).toEqual({ a : [[1]] });
});
