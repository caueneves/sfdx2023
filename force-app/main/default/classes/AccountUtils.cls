public class AccountUtils {

    public static List<Account> accountsByState(String States){
        
        List<Account> myAccounts = [SELECT Id, Name FROM Account WHERE BillingState = :States];
        
        return myAccounts;
    }
    
}