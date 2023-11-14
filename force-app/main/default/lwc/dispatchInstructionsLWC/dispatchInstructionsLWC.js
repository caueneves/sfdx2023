/****************************************************************************************************************************
Description:  JS file for dispatchImstructionLWC component - WO Recordpage
****************************************************************************************************************************
Date         Version          Author             Summary of Changes 
****************************************************************************************************************************
05-jan-2020    1.0          Caue Neves           Defect 7521045 (WO Recordpage)
*****************************************************************************************************************************/

import { LightningElement, api, wire, track} from 'lwc';
import fetchRecords from '@salesforce/apex/ConvergeInstructionHandler.fetchWOInstructions';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import { createRecord } from 'lightning/uiRecordApi';
import { updateRecord } from 'lightning/uiRecordApi';
import { deleteRecord } from 'lightning/uiRecordApi';
import { getPicklistValues } from 'lightning/uiObjectInfoApi';
import { getObjectInfo } from 'lightning/uiObjectInfoApi';
import { refreshApex } from '@salesforce/apex';

import INSTRUCTIONOBJ from '@salesforce/schema/DispatchInstruction__c';
import VISIBILITYFIELD from '@salesforce/schema/DispatchInstruction__c.Visibility__c';
import AUDIENCEFIELD from '@salesforce/schema/DispatchInstruction__c.Audience__c';
import TYPEOFINSTFIELD from '@salesforce/schema/DispatchInstruction__c.Type_of_Instruction__c';

const actions = [
    { label: 'Edit', name: 'edit' },
    { label: 'Delete', name: 'delete' },
];

const columns = [
    { label: 'UNIQUE ID', fieldName: 'Id', type: 'url', typeAttributes: {label: { fieldName: 'Name' }}},
    { label: 'CREATED BY', fieldName: 'CreatedById'},
    { label: 'AUDIENCE', fieldName: 'Audience__c'},
    { label: 'DESCRIPTION', fieldName: 'Instruction__c'},
    {
        type: 'action',
        typeAttributes: { rowActions: actions },
    },
];


export default class DispatchInstructionsLWC extends LightningElement {

    @track data;
    @track dataForm = {};
    @track dataEdit = {};
    @track error;
    @track columns = columns;
    @track bShowModal = false;
    @track currentRecordId;
    @track isEditForm = false;
    @track isNewForm = false;
    @track openConfirm = false;
    @track showLoadingSpinner = false;
    @track loaded = false;
    @track recordTypeId = null;
    @track formAction = null;
    @track selectedAudience = [];
    @track fieldValues = {};
    @track wiredDataResult;
    @track objectApiName = INSTRUCTIONOBJ;

    @api recordId;  // Parent Record Id
    @api compTitle; // Component Title to set up on Edit Page when component is added to the page
    @api showConsole = false; // Used for show the console messages. Keep FALSE (disabled) when debug is not needed
    

    // Wired executed to load Instructions records
    @wire(fetchRecords, { parRecordId: '$recordId' })
    wiredData(result) {
        var dataChanged = {};
        var each;

        this.wiredDataResult = result;

        if (result.data) {            
            
            this.customConsole("result: ", result);

            dataChanged = JSON.parse(JSON.stringify(result.data));

            // Controlled console messages in order to make it easier to debug if needed            
            this.customConsole("dataChanged stringify: ",  dataChanged); 
            this.customConsole("data.length: ", result.data.length); 

            if(result.data.length > 0){

                for(each in dataChanged){
                    if(dataChanged[each] !== undefined && dataChanged[each] !== null){
                       
                        // Controlled console messages in order to make it easier to debug if needed
                        this.customConsole("each: ", each); 
                        this.customConsole("dataChanged.each: ", dataChanged[each]); 
                        this.customConsole("dataChanged.each: ", dataChanged[each].Name);

                        this.dataEdit[dataChanged[each].Id] = dataChanged[each];
                        
                        // New RowId property to control Edit and Delete
                        dataChanged[each].RowId   = dataChanged[each].Id;

                        // Build the link to navigate to the Instruction Record Page
                        dataChanged[each].Id = '/lightning/r/DispatchInstruction__c/' + dataChanged[each].Id + '/view';
                        
                    }
                }
            }
        }

        // New object with changes needed to be set up to the datatable
        this.data = dataChanged;
        
        // Verify if there is data to be shown
        if(dataChanged.length> 0){
            this.loaded = true;
        }

        this.customConsole("dataChanged stringify: ", dataChanged);
       
    }  

    // Get recordTypeID to be used for getting picklist values
    @wire(getObjectInfo, { objectApiName: INSTRUCTIONOBJ })
    objectInfo;

    // Retrieves picklist values for Visibility field
    @wire(getPicklistValues, { recordTypeId: '$objectInfo.data.defaultRecordTypeId', fieldApiName: VISIBILITYFIELD})
    optionsVisibility;

    // Retrieves picklist values for Audience field
    @wire(getPicklistValues, { recordTypeId: '$objectInfo.data.defaultRecordTypeId', fieldApiName: AUDIENCEFIELD})
    optionsAudience;

    // Retrieves picklist values for Type of Instruction field
    @wire(getPicklistValues, { recordTypeId: '$objectInfo.data.defaultRecordTypeId', fieldApiName: TYPEOFINSTFIELD})
    optionsTypeInstruction;


    // Method used for Action buttons: Edit and Delete
    handleRowAction(event) {

        // assign record id to the record edit form
        this.currentRecordId = event.detail.row.RowId;

        this.customConsole('handleRowAction actionName ====> ', event.detail.action.name);
        this.customConsole('handleRowAction currentRecordId ====> ', this.currentRecordId);

        switch (event.detail.action.name) {
            case 'delete':                
                this.openConfirm = true;
                break;
            case 'edit':                
                this.editCurrentRecord();
                break;
            default:
        }
    }

    
    // Method used for buttons: New
    handleButtonNew() {

        // Clean object with values before opening modal for create a new record
        this.fieldValues = {};
        this.dataForm    = {};

        // open modal box
        this.bShowModal = true;
        this.isEditForm = true;
        this.isNewForm  = true;
        this.formAction = 'New';

    }

    
    // Method for handling Edit line action
    @track error;
    editCurrentRecord() {

        var currentEdit = this.dataEdit[this.currentRecordId];

        // set Edit action to Save button
        this.formAction = "Edit";

        // Set fields values for the record selected
        this.dataForm.Audience     = currentEdit.Audience__c.split(";");
        this.dataForm.Visibility   = currentEdit.Visibility__c;
        this.dataForm.TypeOfInst   = currentEdit.Type_of_Instruction__c;
        this.dataForm.Instruction  = currentEdit.Instruction__c;
        this.dataForm.CreatedBy    = currentEdit.CreatedByUserName__c;
        this.dataForm.LastModified = currentEdit.LastModifiedById;
        
        this.customConsole('editCurrentRecord this.dataForm: ', this.dataForm);
        this.customConsole('editCurrentRecord currentEdit: ', currentEdit);

        // open modal box
        this.isEditForm = true;
        this.isNewForm  = false;
        this.bShowModal = true;

    }

    // Close modal box
    closeModal(e) {        

        this.customConsole('closeModal e.target.name: ', e.target.name);

        if (e.target.name === "Cancel"){
            this.bShowModal = false;
        } else if (e.target.name === "Confirm"){
            this.openConfirm = false;
        } else {
            this.bShowModal  = false;
            this.openConfirm = false;
        }
    }


    // Method used for saving information filled out in form. New or Edit
    saveForm(){

        const fields = this.fieldValues;

        // Handle Modal New Record
        if(this.formAction === "New"){

            fields.Work_Order__c = this.recordId; // set parent WO field
            this.createInstruction({ apiName : INSTRUCTIONOBJ.objectApiName, fields });        

        // Handle Modal New Record    
        } else if(this.formAction === "Edit"){

            fields.Id = this.currentRecordId;
            this.updateInstruction({ fields : fields });

        } else {
          this.customConsole("formAction variable is set up with wrong option", "");  
        }

    }

    // Method for handling Delete line action
    @track error;
    deleteCurrentRecord() {
        deleteRecord(this.currentRecordId)
            .then(() => {
                this.dispatchEvent(
                    new ShowToastEvent({
                        title: 'Success',
                        message: 'Record deleted',
                        variant: 'success'
                    })
                );

            this.resetComponent();

            })
            .catch(error => {
                this.customConsole('ERROR DELETE: ', error);
                this.dispatchEvent(
                    new ShowToastEvent({
                        title: 'Error deleting record',
                        message: error.body.message,
                        variant: 'error'
                    })
                );
            });
    }
    

    // Used for saving Audience values
    handleChangeAudience(e) {
        this.selectedAudience = e.detail.value;
        this.fieldValues[e.target.name] = this.selectedAudience.join(";");

        this.customConsole("selectedAudience: ", this.fieldValues[e.target.name]);


    }

    /// Used for handling field values when changed
    handleChange(e){

        this.fieldValues[e.target.name] = e.target.value;
        this.customConsole("ALL VALUES: ", this.fieldValues);

    }


    // Submit Save New record
    createInstruction(recordInput) {

        this.customConsole('recordInput: ', recordInput);

        createRecord(recordInput)
            .then(result => {
                this.dispatchEvent(
                    new ShowToastEvent({
                        title: 'Success',
                        message: 'Instruction created',
                        variant: 'success'
                    })
                );

                this.customConsole('RESULT: ', result);
                this.resetComponent();

            })
            .catch(error => {
                this.dispatchEvent(
                    new ShowToastEvent({
                        title: 'Error creating record',
                        message: error,
                        variant: 'error'
                    })
                );

                this.customConsole('ERROR: ', error);

            });
    }


    // Handle Edit record submit
    updateInstruction(updateInput){

        // Show Toast at Record Update
        updateRecord(updateInput)
            .then((result) => { 
                this.dispatchEvent(
                    new ShowToastEvent({
                                        title: 'Success',
                                        message: 'Record Updated',
                                        variant: 'success',
                                    }),
                                );

            this.customConsole('SUCCESS: ', result);

            this.resetComponent();

            }).catch(error => {
                this.dispatchEvent(
                    new ShowToastEvent({
                        title: 'Error updating record',
                        message: error,
                        variant: 'error'
                    })
                );

                this.customConsole('ERROR: ', error);

            });

    }

    // Reset necessary variables, close modals and refresh datatable
    resetComponent(){
        
        this.bShowModal  = false;
        this.openConfirm = false;
        this.isEditForm  = false;
        this.isNewForm   = false;

        // set Edit action to Save button
        this.formAction = null;

        // assign record id to the record edit form
        this.currentRecordId = null;

        this.fieldValues = {};
        this.dataForm    = {};

        // Refresh the component data
        return refreshApex(this.wiredDataResult);
        
    }


    // Custom method used to write console.log if console api property is TRUE
    customConsole(msgLabel, msg){
        
        msg = (typeof msg == 'object') ? JSON.stringify(msg, null, '\t') : msg;

        if(this.showConsole)
            window.console.log(msgLabel + msg);
    }
 
}