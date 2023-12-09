trigger Example_SoqlTriggerBulk on Account (before insert) {
 // 1 - Example   
    // Perform SOQL query once.    
    // Get the accounts and their related opportunities.
    List<Account> acctsWithOpps = 
        [SELECT Id,(SELECT Id,Name,CloseDate FROM Opportunities) 
         FROM Account WHERE Id IN :Trigger.New];
  
    // Iterate over the returned accounts    
    for(Account a : acctsWithOpps) { 
        Opportunity[] relatedOpps = a.Opportunities;  
        // Do some other processing
    }
    
 // 2 - Example
     // Perform SOQL query once.    
    // Get the related opportunities for the accounts in this trigger.
    List<Opportunity> relatedOpps = [SELECT Id,Name,CloseDate FROM Opportunity
        WHERE AccountId IN :Trigger.New];
  
    // Iterate over the related opportunities    
    for(Opportunity opp : relatedOpps) { 
        // Do some other processing
    }
    
 // 3 - Example   
     // Perform SOQL query once.    
    // Get the related opportunities for the accounts in this trigger,
    // and iterate over those records.
    for(Opportunity opp : [SELECT Id,Name,CloseDate FROM Opportunity
        WHERE AccountId IN :Trigger.New]) {
  
        // Do some other processing
    }   
}