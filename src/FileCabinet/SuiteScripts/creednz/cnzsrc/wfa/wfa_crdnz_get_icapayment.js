/**
 * @NApiVersion 2.1
 * @NScriptType WorkflowActionScript
 */
define(['N/file'],
    /**
 * @param file
 */
    (file) => {
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

            const paymentRecord = scriptContext.newRecord;
            const custbody_ica_batch_id = paymentRecord.getValue('custbody_flat_file');

            // const icaFile = 122998035;

            //     04352120250123
            // fal2.04345520250123.xml
            // const icaFile = '/iCA Folder/iCA Archive Folder/fal2.'+custbody_ica_batch_id+'.xml'
            let XMLfile = file.load({
                id: custbody_ica_batch_id
            });

            log.debug({
                title: 'folder details',
                details: { "file" : XMLfile
                }
            })
        }

        return {onAction};
    });
