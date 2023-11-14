public with sharing class ConvergeInstructionHandler {

/*
Component : dispatchInstructionsLWC
Description: Method used for retrieving filtered data for the Instructions component
Change Log:
===============================================================================================
Date                Author                  UserStory#               Change Description
===============================================================================================
05-jan-2020         Caue Neves            Defect 7521045                   Initial Version
*/
    @AuraEnabled( cacheable=true )  
    public static List <DispatchInstruction__c> fetchWOInstructions( String parRecordId )  {  

        return [SELECT Id, Name, CreatedById, Audience__c, Instruction__c, Work_Order__c, Visibility__c, 
                       Type_of_Instruction__c, CreatedByUserName__c, LastModifiedById
                FROM DispatchInstruction__c
                WHERE Work_Order__c = :parRecordId 
                AND Soft_Deleted__c = false
                ORDER BY Name ASC];
                                                             
    }  

}