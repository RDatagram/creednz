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

                // DEBUG TEST VALUES
                vendorData.url = vendorData.url || 'https://www.rdata.com';
                vendorData.creditLimit = vendorData.creditLimit || 1234;
                vendorData.taxpayerID = vendorData.taxpayerID || '267-941-109';
                // TESTED : vendorData.reportingTax109 = true;

                // DEFAULT VALUES, NOT FOR DEBUG

                vendorData.reportingTax109 = vendorData.reportingTax109 || false; // null=>false

                const vendorRecord = record.load(
                    {
                        type: record.Type.VENDOR,
                        id: linkedVendor,
                        isDynamic: true
                    }
                );

                const updateField = ( jsonField, netsuiteField) => {

                    const value = vendorData[jsonField] || '';

                    if (value) {
                        vendorRecord.setValue({
                            fieldId: netsuiteField,
                            value: value
                        });
                    }
                }
                const updateBooleanField = ( jsonField, netsuiteField) => {

                        vendorRecord.setValue({
                            fieldId: netsuiteField,
                            value: vendorData[jsonField]
                        });

                }

                updateField('name','companyname');
                updateField('purchaseEmail','email');
                updateField('url','url');
                updateField('paymentRemittanceEmail','custentity_payee_email');
                updateField('creditLimit','creditlimit');
                updateField('taxpayerID','taxidnum');
                updateBooleanField('reportingTax109','is1099eligible');

                vendorRecord.setValue({
                    fieldId: 'comments',
                    value: 'Updated with Vendor Evaluation data'
                });

                return vendorRecord.save();
            }
        }

        return {onAction};
    });
