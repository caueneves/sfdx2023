public class ContactAndLeadSearch {

    public static List<List<sObject>> searchContactsAndLeads(String pSearch){
        
        List<List<sObject>> searchList = [FIND :pSearch IN ALL FIELDS 
                           RETURNING Contact(FirstName,LastName),Lead(FirstName,LastName)];
        //Contact[] searchContact = (Contact[])searchList[0];
        //Lead[] searchLeads = (Lead[])searchList[1];
        
        return searchList;
    }
    
}