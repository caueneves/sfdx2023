trigger Example_DmlTriggerNotBulk on Account (before insert) {

// 1 - EXAMPLE
    // Get the related opportunities for the accounts in this trigger.        
    List<Opportunity> relatedOpps = [SELECT Id,Name,Probability FROM Opportunity
        WHERE AccountId IN :Trigger.New];          
    // Iterate over the related opportunities
    for(Opportunity opp : relatedOpps) {      
        // Update the description when probability is greater 
        // than 50% but less than 100% 
        if ((opp.Probability >= 50) && (opp.Probability < 100)) {
            opp.Description = 'New description for opportunity.';
            // Update once for each opportunity -- not efficient!
            update opp; // DON'T DO IT, DON'T PERFORM DML INSIDE THE FOR
        }
    }     
    
 // 2- EXAMPLE   
     // Get the related opportunities for the accounts in this trigger.        
    List<Opportunity> relatedOpps2 = [SELECT Id,Name,Probability FROM Opportunity
        WHERE AccountId IN :Trigger.New];
          
    List<Opportunity> oppsToUpdate = new List<Opportunity>();
    // Iterate over the related opportunities
    for(Opportunity opp : relatedOpps2) {      
        // Update the description when probability is greater 
        // than 50% but less than 100% 
        if ((opp.Probability >= 50) && (opp.Probability < 100)) {
            opp.Description = 'New description for opportunity.';
            oppsToUpdate.add(opp);
        }
    }
    
    // Perform DML on a collection
    update oppsToUpdate;
    
 
}