trigger AccountAddressTrigger on Account (before insert ,before update) {
    for(Account accnt : trigger.new){
        if(accnt.BillingPostalCode != NULL && accnt.Match_Billing_Address__c == true)
            accnt.ShippingPostalCode = accnt.BillingPostalCode ;
    }
    
}