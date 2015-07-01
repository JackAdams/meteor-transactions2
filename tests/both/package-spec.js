'use strict';

describe('babrahams:transactions2', function () {
  it('is available to the app via a variable called tx', function () {
    expect(Package["babrahams:transactions2"].tx).toBeDefined();
    expect(tx).toBeDefined();
  })
});