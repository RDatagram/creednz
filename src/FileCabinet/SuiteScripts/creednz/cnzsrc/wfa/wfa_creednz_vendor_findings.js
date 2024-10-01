/**
 * @NApiVersion 2.1
 * @NScriptType WorkflowActionScript
 */
define(['../lib/creednz_api_lib'],

    (creednz_api_lib) => {
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
        const onAction = (scriptContext) => {
            // create recordVE from newRecord
            const recordVE = scriptContext.newRecord;

            // get custrecord_vendor_externalid
            const vendorExternalId = recordVE.getValue({fieldId: 'custentity_vendor_external_id'});

            // get getCreednzVendorFindings result
            const creedNzTransactionsParse = creednz_api_lib.getCreednzVendorFindings(vendorExternalId);

            const creedNzTransactionsLength = creedNzTransactionsParse.length;
            log.debug({
                title: 'creedNzTransactionsLength',
                details: creedNzTransactionsLength,
            });

            return creedNzTransactionsLength;
        }

        return {onAction};
    });
