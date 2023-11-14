import { LightningElement, track, api } from 'lwc';
 
const columns = [
    { label: 'Item Name', fieldName: 'Name', type: 'text', hideDefaultActions: true },
    { label: 'Item Code', fieldName: 'Code', type: 'text', hideDefaultActions: true },
    { label: 'Price', fieldName: 'Price', type: 'number', hideDefaultActions: true, editable: true },
    { label: 'Priority', fieldName: 'Priority', type: 'text', hideDefaultActions: true },
];
 
const HIGH_PRIORITY = 'High Priority';
const LOW_PRIORITY = 'Low Priority';
const MEDIUM_PRIORITY = 'Medium Priority';
const ALL_PRIORITY = 'All';
 
const filterOptions = [
    { value: HIGH_PRIORITY, label: HIGH_PRIORITY },
    { value: LOW_PRIORITY, label: LOW_PRIORITY },
    { value: MEDIUM_PRIORITY, label: MEDIUM_PRIORITY },
    { value: ALL_PRIORITY, label: ALL_PRIORITY },
];
 
const allItems = [
    { Name: 'test 1', Code: '12323412', Price: 123123, Priority: HIGH_PRIORITY },
    { Name: 'test 2', Code: '12376345', Price: 999999, Priority: LOW_PRIORITY },
    { Name: 'test 3', Code: '89645634', Price: 15, Priority: HIGH_PRIORITY },
    { Name: 'test 4', Code: '64564574', Price: 234, Priority: LOW_PRIORITY },
    { Name: 'test 5', Code: '78456246', Price: 7567, Priority: MEDIUM_PRIORITY },
 
];

export default class ListaAtivosComponent extends LightningElement {

    @api getIdFromParent;
    @api objectApiName;

    @track currentFilter = ALL_PRIORITY;
    @track isExpanded = false;
    @track itemsForCurrentView = allItems;
    @track isLoaded = false;
    allItems = allItems;
    filterOptions = filterOptions;
    columns = columns;
 
    renderedCallback() {
        this.isLoaded = true;
    }
 
    get dropdownTriggerClass() {
        if (this.isExpanded) {
            return 'slds-combobox slds-dropdown-trigger slds-dropdown-trigger_click custom_list_view slds-is-open'
        } else {
            return 'slds-combobox slds-dropdown-trigger slds-dropdown-trigger_click custom_list_view'
        }
    }
 
    handleFilterChangeButton(event) {
        this.isLoaded = false;
        let filter = event.target.dataset.filter;
        this.isExpanded = !this.isExpanded;
        if (filter !== this.currentFilter) {
            this.currentFilter = event.target.dataset.filter;
            setTimeout(() => {
                this.handleFilterData(this.currentFilter), 0
            });
        } else {
            this.isLoaded = true;
        }
    }
 
    handleFilterData(filter) {
        if (filter === ALL_PRIORITY) {
            this.itemsForCurrentView = this.allItems
        } else {
            this.itemsForCurrentView = this.allItems.filter(item => {
                return item.Priority === filter;
            })
        }
        this.isLoaded = true;
    }
 
    handleClickExtend() {
        this.isExpanded = !this.isExpanded;
    }
}