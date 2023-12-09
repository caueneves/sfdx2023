trigger ClosedOpportunityTrigger on Opportunity (after insert, after update) {

    // Create a new sObject List of Task
    List<Task> tasksToCreate = new List<Task>();
    
    // Get the all opportunities that Stage were changed to 'Closed Won'
    List<Opportunity> oppList = new List<Opportunity>([SELECT Id FROM Opportunity 
                                                       WHERE StageName = 'Closed Won' and Id IN :Trigger.New]);
    
    // For each opportunity, create a task associate with it.
    for(Opportunity eachOpp : oppList){
        
        tasksToCreate.add(new Task(Subject='Follow Up Test Task',
                                   WhatId=eachOpp.Id));        
        
    }       
    
    // If there is any task to be create
    if (tasksToCreate.size() > 0) {
        insert tasksToCreate;
    }
}