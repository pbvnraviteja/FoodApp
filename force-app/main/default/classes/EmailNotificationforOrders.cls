public class EmailNotificationforOrders {
   
    @future
    public static void sendEmail(string orderid){
        
    	 
        Messaging.SingleEmailMessage[] Emailmessages = new   List<Messaging.SingleEmailMessage>{}; 
        Order od = [SELECT Id,OwnerId,OrderNumber,Opportunity.Name,Opportunity.Amount,ShipToContact.email,ShipToContact.Name, (Select id,Product2.name,Quantity,UnitPrice,Partner_Products__r.Product_image__c from OrderItems ) FROM Order WHERE id =:orderid];
        List<orderitem> oiList = od.OrderItems;
        EmailTemplate emailTemplate =[Select Id,Subject,Description,HtmlValue,DeveloperName,Body from EmailTemplate where name ='EmailNotificationforOrder' limit 1];
        
        
             Messaging.SingleEmailMessage message = new Messaging.SingleEmailMessage();
             message.setTargetObjectId(od.OwnerId);
             message.setSenderDisplayName('Zest food');
             message.setReplyTo('zestfood@gmail.com');
             message.setUseSignature(false);
             message.setBccSender(false);
             message.setSaveAsActivity(false);
        	 message.setSubject('Your Order Placed Successfuly');
             String plainBody = emailTemplate.HtmlValue.replace('{!Name}', od.ShipToContact.Name);
             String name = od.Opportunity.Name;
             List<String> res = name.split('-');
             plainBody = plainBody.replace('{!p1}',res[1]);
        	 plainBody = plainBody.replace('{!p2}', od.OrderNumber);
             plainBody = plainBody.replace('{!table}',tablegenerator(oiList,od));
             message.setHtmlBody(plainBody);
             message.toAddresses = new String[] {od.ShipToContact.email};
             Emailmessages.add(message);
      
         try{
             Messaging.SendEmailResult[] results = Messaging.sendEmail(Emailmessages);
         }catch (exception ex){
             system.debug('Error- '+ex);
            } finally {
              
            }
    }
    
    public static string tablegenerator(List<orderitem> oiList,Order od){
        string table = '';
        table +='<table class="table table-bordered" style="width:35%;border: 1px solid #000000;" >';
        table +='<tr>';
        table +='<th scope="col" style="width:40%;border: 1px solid #000000;">Dish</th>';
        table +='<th scope="col" style="width:30%;border: 1px solid #000000;">Quantity</th>';
        table +='<th scope="col" style="width:30%;border: 1px solid #000000;">Price</th>'; 
        table +='</tr>';
        for(orderitem oi : oiList){
            table +='<tr>';
            table +='<td style="width:40%;text-align:right;border: 1px solid #000000;">';
            table +='<div  class=" slds-col slds-small-size_2-of-2 slds-medium-size_2-of-2 slds-large-size_2-of-2">';             
            table +='<img align="left" style="height: 50px !important;width: 50px !important;" src="'+oi.Partner_Products__r.Product_image__c+'" /><b>'+oi.Product2.name+'</b></div></td>'; 
            table +='<td style="width:30%;text-align: center;border: 1px solid #000000;">'+oi.Quantity+'</td>';
            table +='<td style="width:30%;text-align: center;border: 1px solid #000000;">'+oi.UnitPrice+'</td>';
            table +='</tr>';
        }
        table +='<tr>';
        table +='<td style="width:40%"></td>';
        table +='<td style="width:30%;text-align: center;">Total</td>';
        table +='<td style="width:30%;text-align: center;border: 1px solid #000000;">'+od.Opportunity.Amount+'</td>';
        table +='</tr>';
        table +='</table>';
        return table;
    }
}