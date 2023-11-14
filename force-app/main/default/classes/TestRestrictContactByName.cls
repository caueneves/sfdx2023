@isTest
public class TestRestrictContactByName {

        @isTest static void restrictContactByName() {

        try {

            // Test data setup
            // Create a Contact with LastName as INVALIDNAME
            List<Contact> acctList = new List<Contact>{new Contact(LastName='INVALIDNAME'), 
                                                       new Contact(LastName='Smith')};
            insert acctList;
                
            //Account acct = new Account(LastName='INVALIDNAME');
            //insert acct;
            
            // Perform test
            //Test.startTest();
            //Database.DeleteResult result = Database.delete(acctList[0], false);
            //Database.DeleteResult result = Database.delete(acctList[1], false);
            //Test.stopTest();
            // Verify 
            // In this case the deletion should have been stopped by the trigger,
            // so verify that we got back an error.
            //System.assert(!result.isSuccess());
            //System.assert(result.getErrors().size() > 0);
            //System.debug(result.getErrors()[0].getMessage());
            
            
        } catch(System.DmlException e){
            System.debug('DmlException: ' + e.getMessage());
        } 
            
    }
        
}