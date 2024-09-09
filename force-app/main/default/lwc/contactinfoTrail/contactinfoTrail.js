import { LightningElement, wire } from 'lwc';
import getContactDetails from '@salesforce/apex/ContactController.getContactDetails';

export default class ContactinfoTrail extends LightningElement {
    contactrecord ={};
@wire(getContactDetails)
    wiredContacts({ error, data }) {
        if (data) {
            this.contactrecord = data;
            this.error = undefined;
        } else if (error) {
            this.error = error;
            this.contacts = undefined;
        }
    }    
}