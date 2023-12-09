trigger AccountTrigger on Account (before insert, before update) {

    if (Trigger.isBefore && Trigger.isInsert) {
        AccountTriggerHandler.CreateAccounts(Trigger.new);
    }
    
}