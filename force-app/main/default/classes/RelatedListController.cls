public class RelatedListController {  
  
    @AuraEnabled( cacheable=true )  
    public static List < sObject > fetchRecords( String listValues )  {  
      
        system.debug( 'values are ' + listValues );  
        List < String > strList = listValues.split( ',' );  
        system.debug( 'values are ' + strList );  
          
        if ( strList.size() == 7 ) {  
          
            String recordId = strList.get( 0 );  
            String objectName = strList.get( 1 );  
            String parentFieldAPIName = strList.get( 2 );  
            String fieldName = strList.get( 3 );  
            String fieldValue = strList.get( 4 );  
            String filterType = strList.get( 5 );  
            String operator = strList.get( 6 );  
              
            String strSOQL = 'SELECT Id, Name, Property__c, Soft_Deleted__c, User__c, CreatedById FROM ' + objectName + ' WHERE ' + parentFieldAPIName + ' = \'' + recordId + '\' AND ';  
            if ( filterType == 'String' )      
                strSOQL += fieldName + ' = \'' + fieldValue + '\'';  
            else if ( filterType == 'Boolean' )      
                strSOQL += fieldName + ' = ' + fieldValue;  
            else  
                strSOQL += fieldName + ' ' + operator + ' ' + fieldValue; 
                 
            strSOQL += ' LIMIT 10';      
            
            return Database.query( strSOQL );  
              
        } else   
            return null;  
          
    }  

    @AuraEnabled( cacheable=true ) 
    public static List<Favorite__c> fetchRecordsStatic() {
        return [SELECT Id, Name, Property__c, Soft_Deleted__c, User__c, CreatedById FROM Favorite__c];
    }

/*

    private static SObject getSObject(String sObjName){

       // Call global describe to get the map of string to token.
        Map<String, Schema.SObjectType> gd = Schema.getGlobalDescribe();
 
        // Get the token for the sobject based on the type.
        Schema.SObjectType sObj = gd.get(sObjName);
 
        // Instantiate the sobject from the token.
        return sObj.newSobject();

    }
    
    private static Map<String, Schema.SObjectField> getFieldsMap(Schema.SObjectType obj){

        Schema.DescribeSObjectResult r = obj.getDescribe();
        return r.fields.getMap() ;

    }

    public List<SelectOption> getObjectFields(String selectedObject) {
            
            Map<String, Schema.SObjectType> schemaMap = Schema.getGlobalDescribe();

            Schema.SObjectType ObjectSchema = schemaMap.get(selectedObject);

            Map<String, Schema.SObjectField> fieldMap = ObjectSchema.getDescribe().fields.getMap();


            List<SelectOption> fieldNames = new List<SelectOption>();
            for (String fieldName: fieldMap.keySet()) 
            {  
            String fName = fieldMap.get(fieldName).getDescribe().getLabel();
            fieldNames.add(new SelectOption(fName, fName));

            }
            return fieldNames;
    } 

    public static void getObjectData(Map<String, Object> objMap) {
        
        update new zced__Training_Program__c(
            Id = (Id)objMap.get('Id')
        );
        
    }


    @AuraEnabled(cacheable=true)
    public static Map < String, String > fetchMapData(String objName) {

        Map < String, String > genericMap = new Map < String, String >();
        SObject sObj = this.getSObject(objName);

        for(SObject sObj : [SELECT ID, Account.Name, Name FROm objName LIMIT 5])
        	genericMap.put(sObj.get('Id'), sObj.Account.Name);

        return genericMap;
    }

*/

}