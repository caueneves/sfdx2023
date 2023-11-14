public class NewCaseListController {
    
    private String filter = 'New';

    public List<Case> getNewCases(){
        
        List<Case> results = Database.query(
            'SELECT Id, CaseNumber FROM Case WHERE Status = \''+filter+'\' LIMIT 10'
        );
        return results;        
        
    }
}