import { LightningElement,api,wire } from 'lwc';
import restaurants from '@salesforce/apex/RestaurantMenuController.getRestaurantsMenu';

export default class RestaurantsMenu extends LightningElement {
    @api contactrecordid;
    @api showmenu = false;
     @api restaurantsmenurecords =[];
     @api showspinner = false;
     constructor(){
        super();
        this.showspinner = true;
        console.log('Inside constructor');
       
    }
   connectedCallback()
    {
        console.log('Inside connected callback');
        this.showmenu = true;
        this.getrestaurantment();
    }
    
    getrestaurantment(){
        restaurants({contactid : this.contactrecordid})
         .then(data => {
             this.restaurantsmenurecords = data;
             this.restaurantsmenurecords = this.restaurantsmenurecords.map(opt => {return {...opt, "Quantity__c": 0}});
             console.log('test',JSON.stringify(this.restaurantsmenurecords));
             this.showspinner = false;
            })
        .catch(error =>{
        console.log('error',error);
        this.showspinner = false;
        }); 
    }

    Previousscreen(event){
        this.showspinner = true;
        const evt= new CustomEvent('backclick', {detail:{childcompname:'',childcompdescription:''}});
        this.dispatchEvent(evt);
        this.showspinner = false;
    }
    increaseQuantity(event){
       let counter = event.currentTarget.dataset.id;
       let menurecords = this.restaurantsmenurecords;
       console.log('quantity',menurecords[counter].Quantity__c);
       let currentQuantity = Number(menurecords[counter].Quantity__c) || 0;
        console.log('quantity before increment', currentQuantity);
        menurecords[counter].Quantity__c = currentQuantity + 1;       
       console.log('quantity',menurecords[counter].Quantity__c);
       this.restaurantsmenurecords = menurecords;
    }

    decreaseQuantity(event){
       let counter = event.currentTarget.dataset.id;
       let modifiedmenurecords = this.restaurantsmenurecords;
       if(modifiedmenurecords[counter].Quantity__c > 0){
           modifiedmenurecords[counter].Quantity__c = modifiedmenurecords[counter].Quantity__c - 1;
       }       
       this.restaurantsmenurecords = modifiedmenurecords;
    }

    orderconfirmation(event){
        this.showmenu = false;
    }
    showmenurecords(event){
        this.showmenu = true;
    }
}