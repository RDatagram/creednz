/**
 * @NApiVersion 2.1
 * @NScriptType WorkflowActionScript
 */
define(['N/record','../creednz/cnzsrc/lib/creednz_dao_lib'],
    /**
 * @param{record} record
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

            // log,debug
            log.debug({
                title: 'Adding new address',
                details: 'Adding a new address to the vendor record'
            });
            try {

                const addressDetails = {
                    country: 'CAN',
                    addr1: '2528 Nicklaus Court',
                    city: 'Burlington',
                    state: 'ON',
                    zip: 'L7M4V1',
                    addressee: 'John Doe',
                    defaultBilling : false,
                    defaultShipping : false
                }
                //const vendor = scriptContext.newRecord;

                const vendor = record.load({
                    type: 'Vendor',
                    id: scriptContext.newRecord.id,
                    isDynamic: true
                });

                // Add a new address line to the record
                const addressSubrecord = vendor.selectNewLine({
                    sublistId: 'addressbook'
                });
                vendor.setCurrentSublistValue({
                    sublistId: 'addressbook',
                    fieldId: 'label',
                    value: 'Creednz'
                });
                // Create the subrecord
                const addressRecord = addressSubrecord.getCurrentSublistSubrecord({
                    sublistId: 'addressbook',
                    fieldId: 'addressbookaddress'
                });

                addressRecord.setValue({
                    fieldId: 'country',
                    value: creednz_dao_lib.mapCountry3Code2(addressDetails.country)
                });

                // Set the address fields
                addressRecord.setValue({
                    fieldId: 'addr1',
                    value: addressDetails.addr1
                });

                addressRecord.setValue({
                    fieldId: 'city',
                    value: addressDetails.city
                });

                addressRecord.setValue({
                    fieldId: 'state',
                    value: addressDetails.state
                });

                addressRecord.setValue({
                    fieldId: 'zip',
                    value: addressDetails.zip
                });

                addressRecord.setValue({
                    fieldId: 'addressee',
                    value: addressDetails.addressee
                });

                // Indicate if it's a default billing and shipping address
                addressSubrecord.setValue('defaultbilling', addressDetails.defaultBilling || false);
                addressSubrecord.setValue('defaultshipping', addressDetails.defaultShipping || false);

                // Commit the new line to the record
                vendor.commitLine({
                    sublistId: 'addressbook'
                });

                vendor.save();

            } catch (e) {
                log.error({
                    title : e.name,
                    details: e.message
                })
            }
        }

        return {onAction};
    });
