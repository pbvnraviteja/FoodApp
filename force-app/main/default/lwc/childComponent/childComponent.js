import { LightningElement,api,wire } from 'lwc';
import { subscribe, MessageContext } from "lightning/messageService";
import CLOUDHAK_CHANNEL from "@salesforce/messageChannel/MyMessageChannel__c";
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
export default class ChildComponent extends LightningElement {

    /*@api childValue ='';
    constructor(){
        super();
        console.log('Inside child constructor');
    }
    connectedCallback()
    {
        console.log('Inside child  connected callback');
    }
    disconnectedCallback(){
        console.log('Inside child  disconnected callback');
    }
    
    
    renderedCallback(){
        console.log('Inside child  renderedCallback');
    }
    errorCallback(error, stack){
        console.log('Inside child  errorCallback');
    }

    inputchange(event){

        this.childValue = event.target.value;
     }
    buttonclick(event){
        const  accountrecord = {accountid :'accid',
            contactrecor : 'conid',
            childvalur : this.childValue
        };
        const selectedEvent = new CustomEvent("childcustomevent", {
            detail: accountrecord
          });
      
          // Dispatches the event.
          this.dispatchEvent(selectedEvent);

    }

    @api
    childmethod() {
        this.childValue = 'Called child method from parent';
    }
    @api
    secondmethod(){
        this.childValue = 'Second Method Called';
    }*/
        subscription = null;
        @wire(MessageContext)
        messageContext;
    
        myfirstName = '';
        mylastName  = '';
    
        connectedCallback() {
    
            this.handleSubscribe();
        }
    
        handleSubscribe() {
            if (this.subscription) {
                return;
            }
            this.subscription = subscribe(this.messageContext, CLOUDHAK_CHANNEL, (message) => {
            this.myfirstName = message.firstName;
            this.mylastName = message.lastName;
            this.ShowToast('Success', 'Data Transfer Successfully', 'success', 'dismissable');
            });
        }
        ShowToast(title, message, variant, mode){
            const evt = new ShowToastEvent({
                title: title,
                message:message,
                variant: variant,
                mode: mode
            });
            this.dispatchEvent(evt);
        }
}