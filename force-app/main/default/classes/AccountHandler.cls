public class AccountHandler {

    public static Account insertNewAccount(String pAccnName){
        
        try {
            
            Account newAccn = new Account(Name=pAccnName);
            insert newAccn; // Comment added in 09-12-2023
            
            return newAccn;
            
        } catch(DmlException e){
            System.debug(e.getMessage());
            return null; 
        }
        
    }
    
}