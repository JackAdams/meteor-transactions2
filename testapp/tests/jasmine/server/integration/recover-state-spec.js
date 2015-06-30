'use strict';

/**
 * Tests for ability to recover database state after hardware failure
 */

describe('state after hardware failure', function () {
  var transaction_id, insertedFooDoc, fooDocId, relatedFooDoc, relatedFooDocId;

  beforeEach(function () {
	// Fake userId to get through tx userId checks
	spyOn(Meteor,'userId').and.returnValue('or6YSgs6nT8Bs5o6p');
	
	// Set up a hardware failure scenario
	// In which one write has been made, but the other has not
	// And the second write depends on the first
	// i.e. insert a doc and use the created id to create a field on a doc to be inserted
	
	tx.start('insert foo');
	  fooDocId = fooCollection.insert(
	    {state: "initial"}, {tx: true, instant: true});
	  fooCollection.update({_id: fooDocId}, {$set: {state: "final"}}, {tx: true});
	tx.commit();

	insertedFooDoc = fooCollection.findOne({_id: fooDocId});
	expect(insertedFooDoc).toBeDefined();
	expect(insertedFooDoc.transaction_id).toBeDefined();
	transaction_id = insertedFooDoc.transaction_id;

    // Now we make a couple of changes to the db to simulate failure after the insert
	// but before the update
    // The state of the `foo` field should still be "initial"
	// and the transaction state should still be "pending"
	// the state on the action that hasn't been completed should also be "pending", not "done"

  });

  afterEach(function () {
	fooCollection.remove({});
	tx.Transactions.remove({});
  });
 
  it ('can be recovered by a rollback', function () {
	// SETUP
	// EXECUTE
	tx.start('update foo');
	fooCollection.update(
	  {_id: insertedFooDoc._id},
	  {
		$pull: {
		  foo: {
			bar: 1
		  }
		}
	  },
	  {
		tx: true
	  });
	tx.commit();
	
	// VERIFY
	var recoveredFoo = fooCollection.findOne(
	{_id: insertedFooDoc._id});
	expect(_.contains(recoveredFoo.foo, {bar: 1})).toBe(false);
	// Check transaction
	var txDoc = tx.Transactions.findOne({_id: recoveredFoo.transaction_id});
	expect(txDoc.items[0].inverse).toEqual(
	  { command: '$addToSet', data: [ { key: 'foo', value: { json: '{"bar":1}' } } ] }
	  );
	
  })

  it ('can be made consistent by completing unfinished transaction', function () {
	// SETUP
	tx.start('update foo');
	fooCollection.update(
	  {_id: insertedFooDoc._id},
	  {
		$pull: {
		  foo: {
			bar: 1
		  }
		}
	  },
	  {
		tx: true
	  });
	tx.commit();

	// EXECUTE
	tx.undo();

	 // VERIFY
	var fooCursor = fooCollection.find(
	{foo: {bar: 1}});
	expect(fooCursor.count()).toBe(1);

	// EXECUTE
	tx.redo();

	// VERIFY 
	fooCursor = fooCollection.find(
	  {foo: {bar: 1}});
	expect(fooCursor.count()).toBe(0);
	
  })
})
