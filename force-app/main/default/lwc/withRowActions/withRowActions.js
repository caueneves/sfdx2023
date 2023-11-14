import { LightningElement, track } from 'lwc';
//import fetchDataHelper from './fetchDataHelper';
import fetchRecordsStatic from '@salesforce/apex/RelatedListController.fetchRecordsStatic';

const actions = [
    { label: 'Show details', name: 'show_details' },
    { label: 'Delete', name: 'delete' },
];

const columns = [
    { label: 'Property', fieldName: 'Property__c' },
    { label: 'Favorite Name', fieldName: 'Name' },
    { label: 'Deleted', fieldName: 'Soft_Deleted__c'},
    { label: 'Created by', fieldName: 'User__c' },
    {
        type: 'action',
        typeAttributes: { rowActions: actions },
    },
];

export default class WithRowActions extends LightningElement {
    @track data = [];
    @track columns = columns;
    @track record = {};

    connectedCallback() {
        this.data = fetchRecordsStatic();
        window.console.log("DATA: " + JSON.stringify(this.data, null, '\t'));
    }

    handleRowAction(event) {
        const actionName = event.detail.action.name;
        const row = event.detail.row;
        switch (actionName) {
            case 'delete':
                this.deleteRow(row);
                break;
            case 'show_details':
                this.showRowDetails(row);
                break;
            default:
        }
    }

    deleteRow(row) {
        const { id } = row;
        const index = this.findRowIndexById(id);
        if (index !== -1) {
            this.data = this.data
                .slice(0, index)
                .concat(this.data.slice(index + 1));
        }
    }

    findRowIndexById(id) {
        let ret = -1;
        this.data.some((row, index) => {
            if (row.id === id) {
                ret = index;
                return true;
            }
            return false;
        });
        return ret;
    }

    showRowDetails(row) {
        this.record = row;
    }
}