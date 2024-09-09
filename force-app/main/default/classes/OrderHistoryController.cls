public class OrderHistoryController {

  @AuraEnabled(cacheable=true)
  public static List<Order> getOrders() {
  return [select Id,OrderNumber,Opportunity.Name, (Select id,Product2.name,Quantity,UnitPrice from OrderItems ) from Order WHERE Status='Activated'];
  }
    
    @AuraEnabled(cacheable=true)
  public static List<Order> getPendingOrders() {
  return [select Id,OrderNumber,Opportunity.Name, (Select id,Product2.name,Quantity,UnitPrice from OrderItems ) from Order WHERE Status='Draft'];
  }
}