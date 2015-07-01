Package.describe({
  name: "babrahams:transactions2",
  summary: "Undo/Redo stack based on transactions",
  version: "0.7.0",
  git: "https://github.com/jackadams/meteor-transactions.git"
});

Package.onUse(function (api, where) {

  api.versionsFrom("1.0");

  // Meteor core
  api.use(['underscore','mongo','accounts-base','random']);
  api.imply('mongo');
  
  // Third party
  api.use('aldeed:collection2@2.3.3', ['client','server'], {weak:true});
  api.use('dburles:mongo-collection-instances@0.3.3');
  api.use('socialize:server-time@0.1.1');

  // Transactions2 package
  api.add_files('lib/transactions-common.js', ['client','server']);
  api.add_files('lib/transactions-server.js', 'server');
  
  if (api.export) {
    api.export('tx');
  }
  
});

Package.onTest(function(api) {

  api.use('sanjo:jasmine@0.14.0');
  api.use('babrahams:transactions2');
  api.addFiles('tests/both/package-spec.js');
  api.addFiles('tests/server/unit-tests.js','server');
  
  // run these with the velocity html reporter
  // from the package top level directory
  // using the following on the command line:
  // VELOCITY_TEST_PACKAGES=1 meteor test-packages --driver-package velocity:html-reporter babrahams:transactions2 -p 4050
  // then navigate to localhost:4050
  
});