import { LightningElement,api,wire,track } from 'lwc';
import accList from '@salesforce/apex/SampleController.getAccRecords';
import { createRecord,updateRecord  } from "lightning/uiRecordApi";
import { ShowToastEvent } from "lightning/platformShowToastEvent";
import { getObjectInfo, getPicklistValues } from "lightning/uiObjectInfoApi";
import ACCOUNT_OBJECT from "@salesforce/schema/Account";
import RATING_FIELD from "@salesforce/schema/Account.Rating";


const actions = [
    { label: 'Edit', name: 'show_details' },
    { label: 'Delete', name: 'delete' },
];
const columns = [
    { label: 'Name', fieldName: 'Name', type: 'text'},    
    { label: 'Phone', fieldName: 'Phone', type: 'phone' },
    { label: 'Email', fieldName: 'Email', type: 'text' },
    { label: 'Account Name', fieldName: 'AccName', type: 'text' },
    { label: 'CloseAt', fieldName: 'closeAt', type: 'date' },
    {
        type: 'action',
        typeAttributes: { rowActions: actions },
    },
];


export default class SampleLWC extends LightningElement {

    @api recordId;
    @track textdata ='lwc if statement';
    @api apidata = [];
    sometext ='';
    @api expression1 ;
    @api expression2 = false;
    fullname ='';
    basick = false;
    phone = 897568909;
    emailid ='pnjvadf@gsafdmi.com';
    datefield;
    @track acclistdata = [];
    searchKey ='';
    isShowModal = false;
    columns = columns;
    accountRecordTypeId;
    ratings;


    @wire(getObjectInfo, { objectApiName: ACCOUNT_OBJECT })
  results({ error, data }) {
    if (data) {
      this.accountRecordTypeId = data.defaultRecordTypeId;
      this.error = undefined;
    } else if (error) {
      this.error = error;
      this.accountRecordTypeId = undefined;
    }
  }

  @wire(getPicklistValues, { recordTypeId: "$accountRecordTypeId", fieldApiName: RATING_FIELD })
  picklistResults({ error, data }) {
    if (data) {
      this.ratings = data.values;
      this.error = undefined;
    } else if (error) {
      this.error = error;
      this.ratings = undefined;
    }
  }

    /*@wire(accList,{ findkey: '$searchKey' })
    getAcclistwired({ error, data }) {
        if (data) {
            //this.contacts = data;
            //this.error = undefined;
            console.log('Accdata',JSON.stringify(data));
            this.acclistdata = data;
        } else if (error) {
            //this.error = error;
            //this.contacts = undefined;
            console.log(error);
        }
    }*/

    buttonclick(){
        accList({ findkey: this.searchKey })
		.then(result => {
			this.acclistdata = result;
            let tempRecords = JSON.parse( JSON.stringify( result ) );
            tempRecords = tempRecords.map( row => {
                return { ...row, AccName: row.Account.Name };
            })
            this.acclistdata = tempRecords;
		})
		.catch(error => {
			//this.error = error;
			//this.accounts = undefined;
		})
    }

    connectedCallback(){
        console.log(this.recordId);
        console.log('Inside parent connectedCallback');
        const urlParams = new URLSearchParams(window.location.search);
        console.log( urlParams.get('contactid'));
        this.expression1 = true;
        this.expression2 = true;
        this.fullname ='Ravi teja';
        this.basick = true;
       let someDate = new Date(); //added 90 days to todays date
       this.datefield = someDate.toISOString();     
       this.buttonclick();  
    }
    constructor(){
        super();
        console.log('Inside parent constructor');
    }
    
    disconnectedCallback(){
        console.log('Inside parent  disconnected callback');
    }
    
    /*render()
    {
       console.log('Inside parent  render');
       return ;
    }*/
    renderedCallback(){
        console.log('Inside parent  renderedCallback');
    }
    errorCallback(error, stack){
        console.log('Inside parent  errorCallback');
    }
    /*sampltebutton(event){
        /*this.expression1 = false;
        console.log(event.target.title);
        if(event.targer.label = 'Brand'){
            this.expression1 = false;
        }
        if(event.targer.label = 'desrucive'){
            this.expression1 = true;
        }
        const fields = {};
        fields['LastName']='Ravi';
        fields['Id']='003dL0000071TC1QAM';
        fields['Email']= this.emailid;


        const recordInput = { fields };

        updateRecord(recordInput)
            .then((restutl) => {
                console.log('acc',restutl.id);
                this.dispatchEvent(
                    new ShowToastEvent({
                        title: "Success",
                        message: "Account created successfully!",
                        variant: "error",
                        mode :'sticky'
                    })
                );

               // this.accountRecord = {};
            })
            .catch((error) => {
                this.dispatchEvent(
                    new ShowToastEvent({
                        title: "Error creating record",
                        //message: reduceErrors(error).join(", "),
                        variant: "error"
                    })
                );
            })
    }*/
            sampltebutton(event){
                this.isShowModal = true;
            }
            hideModalBox(){
                this.isShowModal = false;
            }
    destructive(){
        this.expression1 = true;
    }
    inputchange(event){
        const element = this.template.querySelector('.example');
        element.setCustomValidity('');
        console.log(event.target.name);
        console.log(event.currentTarget.dataset.id);
        console.log(event.currentTarget.dataset.index);
        let recorddata = this.acclistdata[event.currentTarget.dataset.index];
        recorddata.Name = event.target.value;
        this.acclistdata[event.currentTarget.dataset.index] = recorddata;
        if(event.target.value == '' || event.target.value == null){
            element.setCustomValidity('date is required');
        }
        let emailvaldidator = event.target.value;
        console.log(emailvaldidator);
        console.log(event.target.ischecked);
        console.log(event.target.checked);
        if(event.target.name ='name'){
            this.fullname = event.target.value;
        }
        if(event.target.name ='email'){
            this.emailid = event.target.value;
        }
        if(event.target.name ='input1'){
            this.basick = event.target.checked;
        }
        
    }

    handleKeyChange(event) {
        // Debouncing this method: Do not update the reactive property as long as this function is
        // being called within a delay of DELAY. This is to avoid a very large number of Apex method calls.
        /*window.clearTimeout(this.delayTimeout);
        const searchKey = event.target.value;
        // eslint-disable-next-line @lwc/lwc/no-async-operation
        this.delayTimeout = setTimeout(() => {
            this.searchKey = searchKey;
        }, DELAY);*/
        this.searchKey = event.target.value;
        console.log('search',this.searchKey);
        this.buttonclick();
    }
    getUrlParamValue(url, key) {
        return new URL(url).searchParams.get(key);
    }

    handleRowAction(event) {
        const actionName = event.detail.action.name;
        console.log(actionName);
        const row = event.detail.row;
        switch (actionName) {
            case 'delete':
               // this.deleteRow(row);
                break;
            case 'show_details':
                //this.showRowDetails(row);
                break;
            default:
        }
    }
    picklistvalue = 'inProgress';

    get options() {
        return [
            { label: 'New', value: 'new' },
            { label: 'In Progress', value: 'inProgress' },
            { label: 'Finished', value: 'finished' },
            { label: 'Completed', value: 'Completed' },
        ];
    }

    handleChange(event) {
        this.value = event.detail.value;
    }
}