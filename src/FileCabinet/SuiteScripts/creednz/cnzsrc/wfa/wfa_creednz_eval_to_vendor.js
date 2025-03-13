/**
 * @NApiVersion 2.1
 * @NScriptType WorkflowActionScript
 */
define(['N/record'],
    /**
 * @param record
 */
    (record) => {
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

            const evalRecord = scriptContext.newRecord;

            const linkedVendor = evalRecord.getValue('custrecord_vendor_internalid');
            const vendorJSONString = evalRecord.getValue('custrecord_vendor_json');

            if (vendorJSONString) {

                const vendorData = JSON.parse(vendorJSONString);

                const vendorRecord = record.load(
                    {
                        type: record.Type.VENDOR,
                        id: linkedVendor
                    }
                );

                const purchaseEmail = vendorData.purchaseEmail;

                if (purchaseEmail) {
                    vendorRecord.setValue({
                        fieldId: 'email',
                        value: purchaseEmail
                    });
                }

                vendorRecord.setValue({
                    fieldId: 'comments',
                    value: 'Updated with Vendor Evaluation data'
                });



                return vendorRecord.save();
            }
        }

        return {onAction};
    });
