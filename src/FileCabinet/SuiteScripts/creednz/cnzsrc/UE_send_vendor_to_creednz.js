/**
 * @NApiVersion 2.1
 * @NScriptType UserEventScript
 * @NModuleScope Public
 * @Author ZORAN@UCGP
 * Script brief description:
 UserEventScript Script is used for following tasks:
 1. POST vendors from netsuite to Creednz.
 */
define(['N/runtime', 'N/log', 'N/record', 'N/error', 'N/render', 'N/file', 'N/https', 'N/search', 'N/format','./lib/creednz_api_lib'],
    (runtime, log, record, error, render, file, https, search, format, creednz_api_lib) => {
        function afterSubmit(context) {
            try {
                // if (context.type !== context.UserEventType.CREATE) {

                let currentRec = context.newRecord;
                let currentRecId = context.newRecord.id;
                log.debug("currentRecId", currentRecId);
                log.debug("current record", currentRec);

                let currentRecord = record.load({
                    type: record.Type.VENDOR,
                    id: currentRecId,
                    isDynamic: true,
                });

                let vendorArray = [];

                let vendorObj = creednz_api_lib.buildAnalyzeVendorDtoFromRecord(currentRecord);
                vendorArray.push(vendorObj);

                log.debug("vendorArray", vendorArray);
                let dataObj = {};
                dataObj.analyzeVendorDtos = vendorArray;

                let creedNzResponse = creednz_api_lib.baseCreednzPost("/external/erp/vendor/analyze",dataObj);

                log.debug("creedNzResponse", creedNzResponse);
                let creedNzTransactions = creedNzResponse.body;
                log.debug("creedNzTransactions Body", creedNzTransactions);
                //get consignment id
                let creedNzTransactionsParse = JSON.parse(creedNzTransactions);
                log.debug("creedNzTransactionsParse", creedNzTransactionsParse);
                if (creedNzTransactionsParse) {


                    let creednzExternalId = creedNzTransactionsParse[0].vendorExternalId;
                    log.debug("creednzExternalId", creednzExternalId);

                    /* TODO:
                        Set status to something like Pending,Analyze...
                        We need to request new status and findings
                    */
                    let recId = record.submitFields({
                        type: record.Type.VENDOR,
                        id: currentRecId,
                        values: {
                            custentity_vendor_external_id: creednzExternalId,
                            custentity_creednz_updated_on: new Date()
                        },
                        options: {
                            enableSourcing: false,
                            ignoreMandatoryFields: true
                        }
                    });
                    log.debug("record updated", recId);
                }
            } catch (err) {
                log.error("error", err.message);
            }
        }

        return {
            afterSubmit: afterSubmit
        };
    });