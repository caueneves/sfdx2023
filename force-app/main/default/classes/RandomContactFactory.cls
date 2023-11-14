public class RandomContactFactory {

    public static List<Contact> generateRandomContacts(Integer pNumOfContacts, String pContactLastName){
        
        List<Contact> listContact = new List<Contact>();
        
        for(Integer i=0; i<pNumOfContacts; i++) {
            Contact con = new Contact(FirstName = 'TestContact' + i, LastName = pContactLastName);
            listContact.add(con);
        }
       
        return listContact;
        
    }
    
}