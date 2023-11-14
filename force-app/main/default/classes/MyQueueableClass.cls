public class MyQueueableClass implements Queueable {
    
/*
Queueable Apex provides the following benefits to future methods.

Non-primitive types - Classes can accept parameter variables of non-primitive data types, 
such as sObjects or custom Apex types.

Monitoring - When you submit your job, a jobId is returned that you can use to identify the job and 
monitor its progress.

Chaining jobs - You can chain one job to another job by starting a second job from a running job. 
Chaining jobs is useful for sequential processing.

List<Contact> contacts = [SELECT Id, LastName, FirstName, Email
    FROM Contact WHERE Is_Active__c = true];
Id jobId = System.enqueueJob(new MyQueueableClass(contacts));

*/    
    
    private List<Contact> contacts;
    // Constructor for the class, where we pass
    // in the list of contacts that we want to process
    public MyQueueableClass(List<Contact> myContacts) {
        contacts = myContacts;
    }
    public void execute(QueueableContext context) {
        // Loop through the contacts passed in through
        // the constructor and call a method
        // which contains the code to do the actual callout
        for (Contact con: contacts) {
            /*
            String response = anotherClass.calloutMethod(con.Id,
                    con.FirstName,
                    con.LastName,
                    con.Email);
            */
            // May still want to add some code here to log
            // the response to a custom object
        }
    }
}