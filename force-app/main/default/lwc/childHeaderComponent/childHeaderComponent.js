import { LightningElement, api, track } from 'lwc';
import ATIVO from '@salesforce/schema/Stock_Data__c.Ativo__c';
import MEDIO from '@salesforce/schema/Stock_Data__c.Preco_Medio__c';
import GAINLOSS from '@salesforce/schema/Stock_Data__c.Gain_Loss__c';
import LONGSHORT from '@salesforce/schema/Stock_Data__c.Long_ou_Short__c';
import CONTRATOS from '@salesforce/schema/Stock_Data__c.Num_Contratos__c';
import LASTOPER from '@salesforce/schema/Stock_Data__c.Ultima_Operacao__c';
import LASTPRICE from '@salesforce/schema/Stock_Data__c.Ultimo_Preco__c';

/*
Ativo	         > Ativo__c
Created By	     > CreatedById
Gain / Loss %    > Gain_Loss__c
Last Modified By > LastModifiedById
Long ou Short	 > Long_ou_Short__c
Num Contratos	 > Num_Contratos__c
Owner	         > OwnerId
Preco Medio	     > Preco_Medio__c
Stock Data       > Name
Última Operação	 > Ultima_Operacao__c
Último Preço	 > Ultimo_Preco__c
*/

export default class ChildHeaderComponent extends LightningElement {

    @api getIdFromParent;
    @api objectApiName;
    @track fields = [ATIVO, GAINLOSS, LASTOPER, LASTPRICE, MEDIO, CONTRATOS, LONGSHORT];

    // initialize component
    connectedCallback() {
        this.fields.forEach(element => {
            for(let key in element){
                console.log(key + " / " + element[key]);
                // fieldApiName / Ativo__c
                // objectApiName / Stock_Data__c
            }
        });
    }

    handleSubmit(event){
        event.preventDefault();       // stop the form from submitting
        const fields = event.detail.fields;
        //fields.LastName = 'My Custom Last Name'; // modify a field
        //this.template.querySelector('lightning-record-form').submit(fields);
        console.log("fields: " + event.detail.fields);
        
     }
    
}