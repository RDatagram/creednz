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
            const recordVE = scriptContext.newRecord;

            let evalID = recordVE.getValue({
                fieldId: 'custrecord_creednz_evaluation_id'
            });


            // getCreednzVendorEvaluation_status
            let creedNzTransactions = creednz_api_lib.getCreednzVendorEvaluation_vendor(evalID);

            // TODO : Do something with data returned from Creednz

            let externalId = creedNzTransactions.externalId;

            // NOTE: externalId is for VENDOR - FINDINGS

            // set externalid in recordVE
            recordVE.setValue({
                fieldId: 'custrecord_vendor_externalid',
                value: externalId
            });

            log.debug({
                title: 'creedNzTransactions.externalId',
                details: creedNzTransactions.externalId,
            });

            return externalId
        }

        return {onAction};
    });
