public class OrderConfirmationController {

    @AuraEnabled
    public static string createOpportunity(List<Partner_Products__c> productsList) {
        decimal total =0;
        decimal quantity = 0;
        String name ='';
        List<OpportunityLineItem> itemsList = new List<OpportunityLineItem>();
        for(Partner_Products__c pp : productsList){
            quantity += pp.Quantity__c;
            total 	 += pp.Quantity__c * pp.Price__c;
            name = pp.Contact__r.Account.Name;
        }
        Contact con = [SELECT Id, Name, Phone,Email,AccountId FROM contact where id ='003dL000001IcsfQAC'];
        system.debug('productsList'+productsList);
           	Opportunity opportunityObj = new Opportunity(
            AccountId = con.AccountId,
            ContactId = con.Id,
            Name = (con.Name +' - '+name+' - '+System.now().date()).replace('00:00:00',''),
            StageName = 'Prospecting',
            Amount = total,
            TotalOpportunityQuantity = quantity,
            CloseDate = system.today(),
            ForecastCategoryName = 'Pipeline',
            Pricebook2Id = '01sdL000000twZdQAI');
        try{
            insert opportunityObj;
        }catch(exception e){
            system.debug('error -'+ e);
        }
         
        for(Partner_Products__c pp : productsList){
            OpportunityLineItem opportunitylineitemObj = new OpportunityLineItem(
                OpportunityId       = opportunityObj.Id,
                Quantity            = pp.Quantity__c,
                UnitPrice           = pp.Price__c,
            	Product2Id          = pp.Product__c,
            	Partner_Products__c = pp.Id);
            itemsList.add(opportunitylineitemObj);
        }
        
        try{
            insert itemsList;
        }catch(exception e){
            system.debug('errorline -'+ e);
        }
        return opportunityObj.Id;
    }
    
    @AuraEnabled
    public static string createOrder(String oppId) {
        Opportunity opp = [SELECT Id,AccountId,ContactId,Name,Amount,Pricebook2Id,
                           (SELECT Id,Quantity,UnitPrice,Product2Id,PricebookEntryId,Partner_Products__c FROM OpportunityLineItems) 
                           FROM Opportunity WHERE Id=:oppId];
        List<OpportunityLineItem> itemsList = opp.OpportunityLineItems;
        List<OrderItem> oiList = new List<OrderItem>();
        
            Order orderObj      = new Order(
                AccountId       = opp.AccountId,
                Pricebook2Id    = opp.Pricebook2Id,
                OpportunityId   = opp.Id,
                EffectiveDate   = System.today(),
                Status          = 'Draft',
                BillToContactId = opp.ContactId,
                ShipToContactId = opp.ContactId);
            
        try{
            insert orderObj;
        }catch(exception e){
            system.debug('error -'+ e);
        }
         
        for(OpportunityLineItem oi : itemsList){
            OrderItem orderitemObj = new OrderItem(
                OrderId    = orderObj.Id,
                Product2Id = oi.Product2Id,
                Quantity   = oi.Quantity,
                UnitPrice  = oi.UnitPrice,
                PricebookEntryId = oi.PricebookEntryId,
                Partner_Products__c = oi.Partner_Products__c
            	);
            oiList.add(orderitemObj);
        }
        
        try{
            insert oiList;
            EmailNotificationforOrders.sendEmail(orderObj.Id);
        }catch(exception e){
            system.debug('errorline -'+ e);
        }
        return orderObj.Id;
    }
}