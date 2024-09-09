import { LightningElement,api,wire } from 'lwc';
import orderhistory from '@salesforce/apex/OrderHistoryController.getPendingOrders';

export default class PendingOrders extends LightningElement {
     @api orderRecords;
        @wire(orderhistory) wiredorder({ error, data }) {
            if (data) {
                this.orderRecords = data;
                console.log('test',JSON.stringify(data));
                console.log('test',this.orderRecords);
            } else if (error) {
                console.error(error);
            }
        }
}