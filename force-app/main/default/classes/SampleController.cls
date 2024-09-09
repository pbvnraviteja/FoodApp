public without sharing class SampleController {
    
     @AuraEnabled(cacheable=true)
    public static List<contact> getAccRecords(string findkey){
        system.debug('findkey'+findkey);
        String key = '%' + findkey + '%';
        List<contact> accList = [Select id,Name,Email,Phone,Account.Name from contact WHERE Name LIKE :key];
        return accList;
    }
   /* @AuraEnabled
    public static  contact createcontact(String lastname,String firstname,String email,date dob,integer phone){
        contact con = new contact();
        con.LastName = lastname;
        con.firstname = firstname;
        con.email = email;
        con.phone = phone;
        insert con;
    }  */ 
    
}