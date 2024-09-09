import { LightningElement,api,wire} from 'lwc';
import contactinforecord from '@salesforce/apex/ContactInformation.getcontact';

export default class ContactInfo extends LightningElement {
    @api contactRecord;

    @wire(contactinforecord) wiredcontact({ error, data }) {
    if (data) {
        this.contactRecord = data[0];
        console.log('test',JSON.stringify(data));
    } else if (error) {
        console.error(error);
    }
}
}