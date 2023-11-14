@isTest
private class TaskUtilTest {
// there are times when a test method needs access to pre-existing data. 
// To access org data, annotate the test method with @isTest(SeeAllData=true)
// https://trailhead.salesforce.com/content/learn/modules/apex_testing/apex_testing_intro?trail_id=force_com_dev_beginner

    @isTest static void testTaskPriority() {
        String pri = TaskUtil.getTaskPriority('NY');
        System.assertEquals('Normal', pri);
    }
    
    @isTest static void testTaskHighPriority() {
        String pri = TaskUtil.getTaskPriority('CA');
        System.assertEquals('High', pri);
    }
    
    @isTest static void testTaskPriorityInvalid() {
        String pri = TaskUtil.getTaskPriority('Montana');
        System.assertEquals(null, pri);
    }
}