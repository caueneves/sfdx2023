public class AccountTriggerHandler {

    public static void CreateAccounts(List<Account> accts){
        
        for (Account a : accts) {
            a.ShippingState = a.BillingState;
            
        
        }
        
    }
}