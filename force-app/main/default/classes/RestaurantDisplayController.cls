public class RestaurantDisplayController {

    @AuraEnabled(cacheable=true)
    public static List<contact> getRestaurants() {
        return [select Id,name,Phone,MailingCity,MailingPostalCode,MailingCountry,Image_URL__c from contact where RecordType.name ='Partner'];
    }
}