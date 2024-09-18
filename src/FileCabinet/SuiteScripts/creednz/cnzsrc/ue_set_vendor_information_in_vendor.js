/**
 * @NApiVersion 2.1
 * @NScriptType UserEventScript
 * @NModuleScope Public
 * @author Zoran@UCGP
 * Script brief description:
 UserEventScript Script is used for following tasks:
 1. set Creednz sub tab in vendor record
 */
define(['N/runtime', 'N/log', 'N/record', 'N/error', 'N/render', 'N/file', 'N/https', 'N/search', 'N/format', 'N/ui/serverWidget', './lib/creednz_api_lib'],
    (runtime, log, record, error, render, file, https, search, format, serverWidget, creednz_api_lib,) => {
        function beforeLoad(context) {
            try {
                let form = context.form;

                let vendorRecord = context.newRecord;
                const creednzId = vendorRecord.getValue({
                    fieldId: 'custentity_vendor_external_id'
                });


                /*
                var nsAccountId = runtime.accountId;

                if (nsAccountId == "TSTDRV1255519") {
                    form.clientScriptModulePath = 'SuiteScripts/cs_creednz_vendor_evaluation.js';
                } else {
                    //form.clientScriptModulePath = 'SuiteBundles/Bundle 537712/cs_creednz_vendor_evaluation.js';
                    form.clientScriptModulePath = './cs_creednz_vendor_evaluation.js';
                }
                */

                //craete subtab and sublist to view creednz information
                // Add subtab
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

/*
                var creednzObj = checkAccessToken();
                var lastSyncAccessToken = creednzObj.lastSyncAccessToken;
                var creednzBaseUrl = creednzObj.creednzBaseUrl;
                log.debug("creednzObj from checkAccessToken", creednzObj);
                //check for access token from custom record
                //get from creednz   24120260-2c17-419e-9f5c-948b150c8f0c
                //   var creednzVendorInformation = "https://edge.staging.creednz.com/external/microsoft-dynamics/vendor-findings/externalId/" + filterExternalId;
                var creednzVendorInformation = creednzBaseUrl + "/external/erp/vendor/findings/externalId/" + creednzId;
                log.debug("creednzVendorInformation", creednzVendorInformation);
                var creednzVendorHeader = {
                    'accept': 'application/json',
                    'content-type': 'application/json',
                    'authorization': 'Bearer ' + lastSyncAccessToken
                };
                var creedNzGetResponse = https.get({
                    url: creednzVendorInformation,
                    headers: creednzVendorHeader
                });
                */

                const creednzVendorInformation = "/external/erp/vendor/findings/externalId/" + creednzId;

                let creedNzGetResponse = creednz_api_lib.baseCreednzGet(creednzVendorInformation);

                var creedNzTransactions = creedNzGetResponse.body;
                var creedNzTransactionsParse = JSON.parse(creedNzTransactions);
                if (creedNzTransactionsParse) {
                    log.debug("creedNzTransactionsParse", creedNzTransactionsParse);
                }
                var creedNzTransactionsLength = creedNzTransactionsParse.length;
                //set data in the sublist
                if (creedNzTransactionsLength > 0) {
                    for (var i = 0; i < creedNzTransactionsLength; i++) {

                        var vendorFindingsId = creedNzTransactionsParse[i].id;
                        log.debug("vendor findings id", vendorFindingsId);
                        var vendorFindingsType = creedNzTransactionsParse[i].type;
                        log.debug("vendor findings type", vendorFindingsType);
                        var vendorFindingsTitle = creedNzTransactionsParse[i].title;
                        log.debug("vendor findings title", vendorFindingsTitle);
                        var vendorFindingsCategory = creedNzTransactionsParse[i].category;
                        log.debug("vendorFindingsCategory", vendorFindingsCategory);
                        var vendorFindingsDescription = creedNzTransactionsParse[i].description;
                        log.debug("vendorFindingsDescription", vendorFindingsDescription);

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
                }//end if


            } catch (err) {
                log.debug("error", err.message);
            }
        }

        return {
            beforeLoad: beforeLoad
        };
    });