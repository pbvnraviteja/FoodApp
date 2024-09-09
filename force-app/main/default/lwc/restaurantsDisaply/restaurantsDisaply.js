import { LightningElement,api,wire } from 'lwc';
import restaurants from '@salesforce/apex/RestaurantDisplayController.getRestaurants';
import messageChannel from '@salesforce/messageChannel/PaymentConfirmation__c';
import { subscribe, MessageContext } from 'lightning/messageService';

export default class RestaurantsDisaply extends LightningElement {
    @api restaurantsrecords;
    @api showmenu = false;
    @api showrestaurants = false;
    @api partnerid;
    @api showpayment = false;
    @api oppid = '';
    @api isLoading = false;

    constructor(){
        super();
        this.isLoading = true;
        console.log('RestaurantsDisaply constructor');
        this.showrestaurants = true;
    }
   connectedCallback()
    {
        console.log('RestaurantsDisaply connected callback');
        this.subscribeToMessageChannel();
    }
        @wire(restaurants) wirerestaurantsrecords({ error, data }) {
            if (data) {
                this.restaurantsrecords = data;
                console.log('test',JSON.stringify(data));
                console.log('test',this.orderRecords);
                this.isLoading = false;
            } else if (error) {
                console.error(error);
                this.isLoading = false;
            }
        }

    menuitems(event){
       
        console.log('recordid',event.currentTarget.dataset.id);
        this.partnerid = event.currentTarget.dataset.id;
        this.showrestaurants = false;
        this.showmenu = true;
    }

    getrestaurants(event){
         /*const childcompname=event.detail.childcompname;
         const childcompdescription=event.detail.childcompdescription;*/
        this.showrestaurants = true;
        this.showmenu = false;
    }

    subscription = null;
 
    @wire(MessageContext)
    messageContext;
 
    subscribeToMessageChannel() {
            this.isLoading = true;
            this.subscription = subscribe(this.messageContext, messageChannel, (message) => {
                this.oppid = message.messageText;
                this.isLoading = false;
                this.showpayment = true;
                this.showmenu = false;
                console.log(`grand parent received ${message.messageText}`);
                
            });
        
    }
}