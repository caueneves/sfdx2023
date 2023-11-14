/* eslint-disable no-unused-vars */


import { LightningElement, api, wire, track} from 'lwc';  
//import fetchRecords from '@salesforce/apex/RelatedListController.fetchRecords';
import fetchRecordsStatic from '@salesforce/apex/RelatedListController.fetchRecordsStatic';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import { updateRecord } from 'lightning/uiRecordApi';
import { deleteRecord } from 'lightning/uiRecordApi';
import { NavigationMixin } from 'lightning/navigation';
import { refreshApex } from '@salesforce/apex';

//import OBJECT_INFO from '@salesforce/schema/Favorite__c';

//Used for A) obtaining the records or data coming back and B) determining which fields to display.
//import { getListUi } from 'lightning/uiListApi'; 

//Used for describe calls (e.g. is a field editable, and what type of data is coming back in fields)
import { getObjectInfo } from 'lightning/uiObjectInfoApi';

//This will grow, but some of the types that come back (e.g. from the Schema.DisplayType enum) don't quite
//Match up with what the lightning data table component likes, so this is just a mapping between the two types.
const DESCRIBE_TO_DATA_TABLE_MAP = {
    "String" : "text"
};

const actions = [
    { label: 'Edit', name: 'edit' },
    { label: 'Delete', name: 'delete' },
];

const columns = [
    { label: 'Property', fieldName: 'Property__c' },
    { label: 'Favorite Name', fieldName: 'Name' },
    { label: 'Deleted', fieldName: 'Soft_Deleted__c', type: 'checkbox'},
    { label: 'Created by', fieldName: 'User__c' },
    {
        type: 'action',
        typeAttributes: { rowActions: actions },
    },
];

// { label: 'Phone', fieldName: 'Soft_Deleted__c', type: 'phone' },
  
export default class RelatedListCustom extends LightningElement {  

    //@api objectApiName; //Configured via Lightning App Builder, String of the API name to show
    //@api listViewName; //Configured via Lightniung App Builder (see meta.xml), String of the list view to show.
    //@track error; //Standard error handler for errorPanel component
    records = []; //Array of records returned by the list view API wire
    fieldDescribes = []; //Array of describe information populated by the getObjectInfo wire.

    @track error;
    @track data ;
    @track columns = columns;
    /*
    @track columns = [
                    { label: 'Property', fieldName: 'Property__c' },
                    { label: 'Favorite Name', fieldName: 'Name' },
                    { label: 'Deleted', fieldName: 'Soft_Deleted__c', type: 'checkbox'},
                    { label: 'Created by', fieldName: 'User__c' },
                ];
                */
  
    @api objectName;  
    @api fieldName;  
    @api fieldValue;  
    @api parentFieldAPIName;  
    @api recordId;  
    @api strTitle;  
    @api filterType;  
    @api operator;  

    get vals() {  
        var retorno = this.recordId + ',' + this.objectName + ',' +   
        this.parentFieldAPIName + ',' + this.fieldName + ',' +   
        this.fieldValue + ',' + this.filterType + ',' + this.operator;

        window.console.log("retorno: " + retorno);

        return retorno;  
    }


    @wire(fetchRecordsStatic)
    wiredData({
        error,
        data
    }) {
        if (data) {
            this.data = data;
            window.console.log(data);
            window.console.log(JSON.stringify(data, null, '\t'));
        } else if (error) {
            this.error = error;
            window.console.log(JSON.stringify(error, null, '\t'));
        }
    }  
    
    countRecords(event){
        window.console.log("this.totalNumberOfRows: " + this.totalNumberOfRows);

        this.strTitle = this.strTitle + "(" + this.totalNumberOfRows + ")";
    }

    //The getObjectInfo is a part of the user interface API and is chalk full of describe information, including field level describes.
    //This example uses a function "wire" to handle the result of the call to the object info / user interface API.
    //Documentation on wires can be found here, including the function example: https://gs0.lightning.force.com/docs/component-library/documentation/lwc/lwc.data_wire_service_about
    //@wire(getObjectInfo, { objectApiName: OBJECT_INFO })
    //objectInfo;
    /*
    handleDescribe({ error, data }){
        //This method is called when the wire returns for the getObjectInfo call.
        if (data) {
            this.fieldDescribes = [];
            //Logic to run on success.
            //Mapping the describe results to a map of fields (for use when generating the data table columns)
            Object.keys(data.fields).forEach(field => {
                this.fieldDescribes[data.fields[field].apiName] = data.fields[field];
            });
        }else if(error){
            this.error = error;
        }

        window.console.log("this.fieldDescribes: " + JSON.stringify(this.fieldDescribes));
    }
    */

    /*  
    @wire(fetchRecords, { listValues: '$vals' })  
    records;
    */
    /*
    handleRecordsCallback({error, data}){
        if(data){
            this.records = data;
        }else if(error){
            window.console.log("error: " + JSON.stringify(error));
        }
        window.console.log("records: " + JSON.stringify(this.records));
    }
    */

    
    connectedCallback() {
        //const data = this.records.data;
        //this.data = data;
    }
    

    renderedCallback(){}
      

        //This is a getter and is called anytime that the lightning data table should be rerendered (I think, anyway ;-))
    //The method converts the records from the list view API format into the format needed by the lightning data table component.
    /*
    get rows(){
        //Bah, I hate declaring variables up here, but gotta do what ya gotta do.
        let rows = [];

        //Map the list view output to the lightning data table format output.
        if(this.records && this.records.data && this.records.data.records){
            //Iterate through the list view records and map them to a friendlier data table-esque format.
            rows = this.records.data.records.records.map(record => {
                let row = {};
                this.columns.forEach(column => {
                    if (record.fields[column.fieldName]) {
                        row[column.fieldName] = record.fields[column.fieldName].value;
                    }
                });
                return row;
            });
        }

        window.console.log("rows: " + rows);

        return rows;
    }

    //This is a getter for fetching the columns used in the data table (Only really referenced in the .html filed).
    //This converts from the list view API into the data table format, but also applies describe information,
    //Such as determining if a column is editable, determines the label that is displayed, and also what data type to pass to the data table.
    get columns(){
        let cols = [];
        //Map the list view output to the lightning data table format output.
        if (this.records && this.records.info){
            //cols = this.records.data.info.displayColumns.map(displayColumn => {
                cols = this.records.info.displayColumns.map(displayColumn => {
                let dataType = DESCRIBE_TO_DATA_TABLE_MAP[this.fieldDescribes[displayColumn.fieldApiName].dataType];
                if (!dataType) {
                        dataType = 'text';
                    }
                return {
                        fieldName: displayColumn.fieldApiName,
                        label : displayColumn.label,
                        sortable : displayColumn.sortable,
                    editable : this.fieldDescribes[displayColumn.fieldApiName].createable,
                        type : dataType.toLowerCase()
                };
            });
        }

        window.console.log("cols: " + cols);

        return cols;
    }
    */
  
}