public class CalloutClass {   
/*The example uses a hypothetical endpoint URL for illustration purposes only. 
  You can’t run this example unless you change the endpoint to a valid URL and 
  add a remote site in Salesforce for your endpoint.

  CalloutClass.makeCallout();
*/

    @future(callout=true)
    public static void makeCallout() {
        HttpRequest request = new HttpRequest();
        // Set the endpoint URL.
        String endpoint = 'http://yourHost/yourService';
        request.setEndPoint(endpoint);
        // Set the HTTP verb to GET.
        request.setMethod('GET');
        // Send the HTTP request and get the response.
        HttpResponse response = new HTTP().send(request);
    }
}