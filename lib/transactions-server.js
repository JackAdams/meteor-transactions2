// *******************************
// Transactions manager for Meteor
// by Brent Abrahams
// brent_abrahams@yahoo.com
// MIT Licence 2015
// *******************************
  
// This script makes an attempt to restore db state after a break during a transaction

Meteor.startup(function() {

  Meteor.defer(function() {
      
    // Give time for everything else to be set up by the transactions-common.js script
    switch (tx.selfRepairMode) {
      case 'complete' :
      
        break;
      case 'rollback' :
      
        break;    
    }

  });

});
