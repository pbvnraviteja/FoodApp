public class ContactInformation {
	
 @AuraEnabled(cacheable=true)
  public static List<contact> getcontact() {
  return [SELECT Id, Name, Phone,Email FROM contact where id ='003dL000001IcsfQAC'];
  }

}