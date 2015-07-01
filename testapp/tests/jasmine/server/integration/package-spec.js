'use strict';

describe('Meteor-transactions', function () {
  it('is available via Package["babrahams:transactions2"].tx', function () {
    expect(Package['babrahams:transactions2'].tx).toBeDefined();
  });
});