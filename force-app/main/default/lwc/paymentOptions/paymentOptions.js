import { LightningElement,api } from 'lwc';
import createorderrec from '@salesforce/apex/OrderConfirmationController.createOrder';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';

export default class PaymentOptions extends LightningElement {
     activeSectionMessage = '';
     @api opportunityid ;
     @api isspinner = false;

    constructor(){
        super();
        this.isspinner = true;
        console.log('Inside constructor');
       
    }
    connectedCallback()
    {
        this.isspinner = false;
        console.log('Payment connected callback');
        console.log('confirmeditems',this.opportunityid);
    }
    handleToggleSection(event) {
        this.activeSectionMessage =
            'Open section name:  ' + event.detail.openSections;
    }

    handleSetActiveSectionC() {
        const accordion = this.template.querySelector('.example-accordion');

        accordion.activeSectionName = 'C';
    }
    procedpayment(){
         this.isspinner = true;
        createorderrec({oppId : this.opportunityid})
         .then(data => {
                console.log('data');     
                const event = new ShowToastEvent({
                title: 'Success',
                message: 'Your Order Has been Placed',
                variant: 'success',
                mode: 'sticky'});
                this.dispatchEvent(event);  
                let event1 = setTimeout(() => {
                window.location.reload();
                }, 3000);     
                })              
        .catch(error =>{
        console.log('error',error);
        });
        
    }
}