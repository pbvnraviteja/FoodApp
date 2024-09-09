import { LightningElement,api,wire } from 'lwc';
import createopp from '@salesforce/apex/OrderConfirmationController.createOpportunity';
import messageChannel from '@salesforce/messageChannel/PaymentConfirmation__c';
import {publish, MessageContext} from 'lightning/messageService';

export default class OrderConfirmation extends LightningElement {
     @api contactrecordid;
     @api confirmeditems =[];
     @api totalAmount = 0;
     @api isspinner = false;

     @wire(MessageContext)
      messageContext;

     constructor(){
        super();
        this.isspinner = true;
        console.log('Inside constructor');
       
    }
   connectedCallback()
    {
        console.log('Inside connected callback');
        console.log('confirmeditems',JSON.stringify(this.confirmeditems));
        this.getconfirmeditems();
    }
    getconfirmeditems(){
             this.totalAmount =0;
             let confirmt = [];
             this.confirmeditems = this.confirmeditems.filter(opt => opt.Quantity__c > 0);
             this.confirmeditems = this.confirmeditems.map(opt => {return {...opt, "Quantity": opt.Quantity__c}});
             this.confirmeditems.forEach(item => {
                 this.totalAmount += item.Quantity__c * item.Price__c;
             });             
             this.isspinner = false;
             
             
    }

    Previousscreen(event){
        const evt= new CustomEvent('backmenu', {detail:{childcompname:'',childcompdescription:''}});
        this.dispatchEvent(evt);
    }
    increaseconfirmQuantity(event){        
       let counter = event.currentTarget.dataset.id;
       console.log('increase',JSON.stringify(this.confirmeditems));
       const modifiedmenurecords = this.confirmeditems;
        modifiedmenurecords[counter].Quantity = modifiedmenurecords[counter].Quantity + 1;
       this.confirmeditems = modifiedmenurecords;       
       this.totalAmount =0;
       this.confirmeditems.forEach(item => {
            this.totalAmount += item.Quantity * item.Price__c;
        });
    }

    decreaseconfirmQuantity(event){
       console.log('decrease',event.currentTarget.dataset.id);
       let counter = event.currentTarget.dataset.id;
       let modifiedmenurecords = this.confirmeditems;
       if(modifiedmenurecords[counter].Quantity > 0){
           modifiedmenurecords[counter].Quantity = modifiedmenurecords[counter].Quantity - 1;
       }       
       this.confirmeditems = modifiedmenurecords;
       console.log('increase',JSON.stringify(this.confirmeditems));
       this.totalAmount =0;
       this.confirmeditems.forEach(item => {
            this.totalAmount += item.Quantity * item.Price__c;
        });
    }
    checkout(){
        this.isspinner = true;
        this.confirmeditems = this.confirmeditems.map(opt => {return {...opt, "Quantity__c": opt.Quantity}});
        this.confirmeditems = this.confirmeditems.map(item => {
            const { Quantity, ...rest } = item; // Destructure the object, omitting Quantity
            return rest; // Return the object without the Quantity property
        });
        createopp({productsList : this.confirmeditems})
         .then(data => {
              console.log('success'+data);
              let showpayment = {messageText: data};
              publish(this.messageContext, messageChannel, showpayment);
              this.isspinner = false;
            })
        .catch(error =>{
             this.isspinner = false;
             console.log('error',error);
        });
       
    }
}