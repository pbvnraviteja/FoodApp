public class ContactController {
	@AuraEnabled(cacheable=true)
    public static Contact getContactDetails() {
        //user us = [Select id,contactid from user where id =Userinfo.getUserId()];
        return [SELECT Id, Name, Email, Phone FROM Contact where id ='003dL000001IcsfQAC'];
    }
}