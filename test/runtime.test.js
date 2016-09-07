const batch = require('../build/runtime')

test('Initializing batch runtime', () => {
    batch.Runtime.init()
    expect(1+2).toBe(3);
});
