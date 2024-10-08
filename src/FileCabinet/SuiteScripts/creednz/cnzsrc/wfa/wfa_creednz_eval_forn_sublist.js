/**
 * @NApiVersion 2.1
 * @NScriptType WorkflowActionScript
 */
define(['N/ui/serverWidget','../lib/creednz_api_lib'],
    /**
 * @param{serverWidget} serverWidget
 */
    (serverWidget,creednz_api_lib) => {
        /**
         * Defines the WorkflowAction script trigger point.
         * @param {Object} scriptContext
         * @param {Record} scriptContext.newRecord - New record
         * @param {Record} scriptContext.oldRecord - Old record
         * @param {string} scriptContext.workflowId - Internal ID of workflow which triggered this action
         * @param {string} scriptContext.type - Event type
         * @param {Form} scriptContext.form - Current form that the script uses to interact with the record
         * @since 2016.1
         */
        const makeFormSublist = (form) => {
            let creednzSubtabId = 'custpage_creednz_subtab';
            form.addTab({
                id: creednzSubtabId,
                label: 'Creednz Information'
            });
            // Create a sublist under the Creednz subtab
            let creednzSublist = form.addSublist({
                id: 'custpage_creednz_sublist',
                type: serverWidget.SublistType.LIST,
                label: 'Creednz Information',
                tab: creednzSubtabId
            });
            // Add fields to the sublist
            creednzSublist.addField({
                id: 'custpage_id',
                type: serverWidget.FieldType.TEXT,
                label: 'ID'
            });
            creednzSublist.addField({
                id: 'custpage_type',
                type: serverWidget.FieldType.TEXT,
                label: 'Type'
            });
            creednzSublist.addField({
                id: 'custpage_title',
                type: serverWidget.FieldType.TEXT,
                label: 'Title'
            });
            creednzSublist.addField({
                id: 'custpage_description',
                type: serverWidget.FieldType.TEXT,
                label: 'Description'
            });
            creednzSublist.addField({
                id: 'custpage_category',
                type: serverWidget.FieldType.TEXT,
                label: 'Category'
            });

            return creednzSublist;

        }
        const onAction = (scriptContext) => {
            let wfaForm = scriptContext.form;
            let recordVE = scriptContext.newRecord;

            const vendorExternalId = recordVE.getValue({fieldId: 'custrecord_vendor_externalid'});

            let creedNzTransactionsParse = creednz_api_lib.getCreednzVendorFindings(vendorExternalId);
            const creedNzTransactionsLength = creedNzTransactionsParse.length;
            if (creedNzTransactionsLength > 0) {
                let creednzSublist = makeFormSublist(wfaForm);

                for (let i = 0; i < creedNzTransactionsLength; i++) {

                    let vendorFindingsId = creedNzTransactionsParse[i].id;
                    let vendorFindingsType = creedNzTransactionsParse[i].type;
                    let vendorFindingsTitle = creedNzTransactionsParse[i].title;
                    let vendorFindingsCategory = creedNzTransactionsParse[i].category;
                    let vendorFindingsDescription = creedNzTransactionsParse[i].description;

                    creednzSublist.setSublistValue({
                        id: 'custpage_id',
                        line: i,
                        value: vendorFindingsId
                    });
                    creednzSublist.setSublistValue({
                        id: 'custpage_type',
                        line: i,
                        value: vendorFindingsType
                    });
                    creednzSublist.setSublistValue({
                        id: 'custpage_title',
                        line: i,
                        value: vendorFindingsTitle
                    });
                    creednzSublist.setSublistValue({
                        id: 'custpage_description',
                        line: i,
                        value: vendorFindingsCategory
                    });
                    creednzSublist.setSublistValue({
                        id: 'custpage_category',
                        line: i,
                        value: vendorFindingsDescription
                    });

                }
                creednzSublist.setSublistValue({
                    id: 'custpage_id',
                    line: creedNzTransactionsLength,
                    value: 'END'
                });
            }

        }

        return {onAction};
    });
