public class RestaurantMenuController {

    @AuraEnabled(cacheable=true)
    public static List<Partner_Products__c> getRestaurantsMenu(String contactid) {
        return [select Id,Price__c,Product__c,Product_image__c,Product__r.name,Contact__r.Account.Name from Partner_Products__c where Contact__c =:contactid];
    }
}