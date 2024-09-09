import { LightningElement,api,wire } from 'lwc';
import { publish, MessageContext } from "lightning/messageService";
import CLOUDHAK_CHANNEL from "@salesforce/messageChannel/MyMessageChannel__c";
export default class ParentComponent extends LightningElement {

       /* @api childmsg = 'This is child';
        showchild = false;

        hanldeProgressValueChange(event){
            let childdetail = event.detail;
            console.log(childdetail.childvalur,childdetail.accountid,childdetail.contactrecor);
            this.childmsg = childdetail.childvalur;
        }
        parentclick(){
            this.template.querySelector("c-child-component").childmethod();
        }

        secondclick(){
            this.template.querySelector("c-child-component").secondmethod();
        }*/
            @api firstName;
            @api lastName;
        
            @wire(MessageContext)
            messageContext;

            handlefirstName(event){
                this.firstName = event.target.value;
            }
            handlelastName(event){
                this.lastName = event.target.value;
            }
            handleClick(){
                const messaage = {
                    firstName: this.firstName,
                    lastName: this.lastName
                  };
                publish(this.messageContext, CLOUDHAK_CHANNEL, messaage);  
            }
        
       
}