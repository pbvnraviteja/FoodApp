import { LightningElement, wire } from 'lwc';
import getOrderDetails from '@salesforce/apex/OrderHistoryController.getOrders';

export default class OrderHistoryTrial extends LightningElement {
    orderredords =[];
    error = '';
@wire(getOrderDetails)
    wiredContacts({ error, data }) {
        if (data) {
            this.orderredords = data;
            this.error = undefined;
        } else if (error) {
            this.error = error;
            this.contacts = undefined;
        }
    }    
}