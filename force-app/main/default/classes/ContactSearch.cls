public class ContactSearch {

    public static List<Contact> searchForContacts(String pLastName, String pMailing){
        
        List<Contact> conList = [SELECT ID, Name FROM Contact 
                                 WHERE LastName = :pLastName AND MailingPostalCode = :pMailing];
        
        return conList;
        
        // One more example to reduce the code, return directly the resultSet of query
        //return [SELECT ID, Name FROM Contact WHERE LastName = :pLastName AND MailingPostalCode = :pMailing];
        
    }
}