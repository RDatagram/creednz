/**
 * @NApiVersion 2.1
 * @NScriptType WorkflowActionScript
 */
define(['N/record','../lib/creednz_dao_lib'],
    /**
 * @param record
     * @param creednz_dao_lib
 */
    (record,creednz_dao_lib) => {
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

                vendorData.vendorPaymentMethod = 'MTS';
                vendorData.bankAccountNumber = '4001608';
                vendorData.bankAccountType = "SWT";

                vendorData.usWireInternationalData = '000300752'
                vendorData.swift = vendorData.swift || 'ROYCCAT2';

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
                const updateListField = ( idValue, netsuiteField) => {

                    if (idValue > 0) {
                        vendorRecord.setValue({
                            fieldId: netsuiteField,
                            value: idValue
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

                //custentity_vendorpaymeth
                const findVendPymtMeth = creednz_dao_lib.genQuery('customlist_vendpymtmeth','name','iCA','id');

                if (findVendPymtMeth.found) {
                    updateListField(findVendPymtMeth.idRecord, 'custentity_vendorpaymeth'); // WARNING HARD CODED - REQUESTED BY YANIV DESPITE A WARNING
                }

                //vendorPaymentMethod => custentity_paymentmethod (customlist_payment_method)
                if (vendorData.vendorPaymentMethod) {
                    const lookUpData = creednz_dao_lib.genQuery('customlist_payment_method', 'name', vendorData.vendorPaymentMethod, 'id');
                    if (lookUpData.found) {
                        updateListField(lookUpData.idRecord, 'custentity_paymentmethod');
                    }
                }

                // usWireInternationalData => custentity_vendorbranchbankircid
                updateField('usWireInternationalData','custentity_vendorbranchbankircid');

                // bankAccountType => custentity_recbankprimidtype (customlist_recbankidtype)
                if (vendorData.bankAccountType) {
                    const lookUpData = creednz_dao_lib.genQuery('customlist_recbankidtype', 'name', vendorData.bankAccountType, 'id');
                    if (lookUpData.found) {
                        updateListField(lookUpData.idRecord, 'custentity_recbankprimidtype');
                    }
                }

                // bankAccountNumber => custentity_recpartyaccount
                updateField('bankAccountNumber','custentity_recpartyaccount');

                // swift => custentity_recbankprimid
                updateField('swift','custentity_recbankprimid');

                vendorRecord.setValue({
                    fieldId: 'comments',
                    value: 'Updated with Vendor Evaluation data'
                });

                return vendorRecord.save();
            }
        }

        return {onAction};
    });
