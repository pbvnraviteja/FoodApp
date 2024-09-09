import { LightningElement, wire,api  } from 'lwc';
import getrestaurants from '@salesforce/apex/RestaurantDisplayController.getRestaurants';
import messageChannel from '@salesforce/messageChannel/PaymentConfirmation__c';
import { subscribe, MessageContext } from 'lightning/messageService';
export default class RestaurantsDisaplyTrial extends LightningElement {
     restaurants =[];
    error = '';
    @api restuaritId ='';
    @api showmenu = false;
    @api oppid = '';
    @api showpaymenttrial = false;
    @api showspinner = false;
@wire(getrestaurants)
    wiredContacts({ error, data }) {
        if (data) {
            this.restaurants = data;
            this.error = undefined;
        } else if (error) {
            this.error = error;
            this.contacts = undefined;
        }
    }  

    dispalymenu(event){
        console.log(event.currentTarget.dataset.id);
        this.restuaritId = event.currentTarget.dataset.id;
        this.showmenu = true;
    }  
    hanldeProgressValueChange(event){
        this.showmenu = false;
    }
    connectedCallback()
    {
        this.showspinner = true;
    }

     @wire(MessageContext)
    messageContext;
 
    subscribeToMessageChannel() {
            this.isLoading = true;
            this.subscription = subscribe(this.messageContext, messageChannel, (message) => {
                this.oppid = message.messageText;
                this.isLoading = false;
                this.showpaymenttrial = true;
                this.showmenu = false;
                console.log(`grand parent received ${message.messageText}`);
                
            });
        
    }
}