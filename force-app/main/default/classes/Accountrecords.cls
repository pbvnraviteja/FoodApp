Global class Accountrecords implements database.batchable<Sobject>
{

  Global database.Querylocator start (Database.batchablecontext bcontext) 
  {
      string industryname = 'Banking';
      String accountquery = 'Select id, name, rating, industry, ownership, type, active__C from account where industry =: industryname';
      return database.getQuerylocator(accountquery);
  }
    
  Global void Execute (Database.batchablecontext bcontext , list<Sobject> recordstoupdate) 
  {
      if(! recordstoupdate.isempty())
      {
          list<account> accoutnstoupdate = new  list<account>();
          
          for(Sobject objrecord : recordstoupdate)
          {
              Account accrecord = (Account) objrecord;
              
              accrecord.AnnualRevenue = 1000;
              accrecord.Active__c = 'Yes';
              
              accoutnstoupdate.add(accrecord);
          }
          
          if(!accoutnstoupdate.isempty())
          {
              Update accoutnstoupdate;
          }
           
      }
  }
    
    Global void finish (Database.batchablecontext bcontext) 
  {
      system.debug('Batch job id is = '+ bcontext.getjobid());
      
      Asyncapexjob jobdetails = [select id, status, totaljobitems, jobitemsprocessed, NumberofErrors, createdby.Email 
                                 from Asyncapexjob where id =: bcontext.getjobid()];
      
      
      //Write the Email notification code
      
      Messaging.singleEmailmessage sEmail = new Messaging.singleEmailmessage();
      
      String [] toaddress = new string [] {jobdetails.Createdby.Email, 'Rao69897@gmail.com'};
      sEmail.settoaddresses(toaddress);
      
      String [] Ccaddress = new string [] {'srinusfdc1994@gmail.com'};
      sEmail.setCcaddresses(Ccaddress);
      
      SEmail.setreplyto('Support@dell');
      
      String emailcontent = 'Dear customer Support, <br> </br>'+
                            'We are pleased to infrom you, that we have processed the weekly support, <br> </br>'+
                            'Here are the batch job results   : <br></br>'+
                            '<br/>Batch job id = '+jobdetails.id+
                            '<br/> Batch job name = Accountrecords'+
                            '<br/> Batch job status ='+ jobdetails.Status+
                            '<br/> Batch job totaljobitems = '+jobdetails.totaljobitems+
                            '<br/> Batch job NumberofErrors = '+jobdetails.NumberofErrors+
                            '<br/> Batch job createdby.Email ='+ jobdetails.createdby.Email+
                            '<br> <br/> Please contact on the below address, if any queries'+
                            '<i>  **** this is System generated Email  please do not reply </i>'+
                            'Thanks & Regards </br>'+
                            'Dell customer support';
      
      sEmail.setHtmlbody(emailcontent);
      
      Messaging.Sendemailresult [] result = Messaging.Sendemail(new Messaging.SingleEmailMessage [] {sEmail});                          
          
  }
}