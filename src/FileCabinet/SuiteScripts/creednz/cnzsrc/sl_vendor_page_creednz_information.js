/**
 *
 * @NApiVersion 2.1
 * @NScriptType Suitelet
 * @NModuleScope public
 */
let PAGE_SIZE = 500;
let customFilters = {};
let searchId = 'customsearch_ss_vendor_creednz_informa';
define(["N/ui/serverWidget", "N/log", "N/record", "N/url", "N/search", "N/task", "N/redirect", "N/runtime", "N/encode", "N/file", "N/https", "N/format", "./ssearches/searchlib","./lib/creednz_api_lib"],
    (ui, log, record, url, search, task, redirect, runtime, encode, file, https, format, searchlib,creednz_api_lib) => {
        function onRequest(context) {
            let nsAccountId = runtime.accountId;
            log.debug("context", runtime.accountId);
            // get method

            if (context.request.method === 'GET') {
                try {


                    //gte parameters from client script
                    let filterExternalId = context.request.parameters.externalId;
                    log.debug("filterExternalId in GET", filterExternalId);
                    let filterVendorId = context.request.parameters.vendorId;

                    let form = ui.createForm({
                        id: 'creednz_informaition',
                        title: 'Creednz Vendor Analysis'
                    });
                    if (nsAccountId == "TSTDRV1255519") {
                        form.clientScriptModulePath = 'SuiteScripts/cs_send_vendor_to_creednz.js';
                        // form.clientScriptModulePath = 'SuiteScripts/cs_send_vendor_to_creednz_info.js';

                    } else {
                        //form.clientScriptModulePath = 'SuiteBundles/Bundle 537712/cs_send_vendor_to_creednz.js';
                        form.clientScriptModulePath = './cs_send_vendor_to_creednz.js';

                    }
                    let pageId = parseInt(context.request.parameters.page);


                    let vendorExternalId = form.addField({
                        id: 'custpage_vendor_external_id',
                        type: ui.FieldType.TEXT,
                        label: 'Vendor External ID'
                    }).updateDisplayType({
                        displayType: ui.FieldDisplayType.HIDDEN
                    });
                    vendorExternalId.defaultValue = filterExternalId;
                    form.addButton({
                        id: 'cancel_button',
                        label: 'Cancel',
                        functionName: 'cancelWindow()'
                    });


                    // add text fields
                    let bankAccRiskField = form.addField({
                        id: 'custpage_bank_acc_risk',
                        type: ui.FieldType.TEXT,
                        label: 'Bank Account Risk'
                    }).updateDisplayType({
                        displayType: ui.FieldDisplayType.DISABLED
                    });
                    let operationRiskField = form.addField({
                        id: 'custpage_operation_risk',
                        type: ui.FieldType.TEXT,
                        label: 'Operation Risk'
                    }).updateDisplayType({
                        displayType: ui.FieldDisplayType.DISABLED
                    });
                    let sanctionRiskField = form.addField({
                        id: 'custpage_sanction_risk',
                        type: ui.FieldType.TEXT,
                        label: 'Sanction Risk'
                    }).updateDisplayType({
                        displayType: ui.FieldDisplayType.DISABLED
                    });
                    let cyberRiskField = form.addField({
                        id: 'custpage_cyber_risk',
                        type: ui.FieldType.TEXT,
                        label: 'Cyber Risk'
                    }).updateDisplayType({
                        displayType: ui.FieldDisplayType.DISABLED
                    });

                    //create sublist
                    let creedNzSublist = form.addSublist({
                        id: "custpage_creednz_information_sublist",
                        type: ui.SublistType.LIST,
                        label: "Creednz Information",
                    });

                    creedNzSublist.addField({
                        id: "custpage_vendor_id",
                        label: "ID",
                        type: ui.FieldType.TEXT
                    });

                    creedNzSublist.addField({
                        id: "custpage_vendor_type",
                        label: "Type",
                        type: ui.FieldType.TEXT,
                    });
                    creedNzSublist.addField({
                        id: "custpage_vendor_title",
                        label: "Title",
                        type: ui.FieldType.TEXT
                    });
                    creedNzSublist.addField({
                        id: "custpage_description",
                        label: "Description",
                        type: ui.FieldType.TEXT,
                    })
                    creedNzSublist.addField({
                        id: "custpage_category",
                        label: "Category",
                        type: ui.FieldType.TEXT
                    });
                    creedNzSublist.addField({
                        id: "custpage_vendor_external_id",
                        label: "Creednz Vendor External id",
                        type: ui.FieldType.TEXT
                    }).updateDisplayType({
                        displayType: ui.FieldDisplayType.HIDDEN
                    });

                    //  creedNzSublist.addMarkAllButtons();
                    let retrieveSearch = runSearch(searchId, PAGE_SIZE);

                    var pageCount = Math.ceil(retrieveSearch.count / PAGE_SIZE);
                    log.debug('pageCount', pageCount);
                    // Set pageId to correct value if out of index
                    if (!pageId || pageId == '' || pageId < 0) {
                        pageId = 0;
                        log.debug('pageId', pageId);
                    } else if (pageId >= pageCount) pageId = pageCount - 1;

                    if (retrieveSearch.count > 0) {
                        // Add buttons to simulate Next & Previous
                        if (pageId != 0) {
                            form.addButton({
                                id: 'custpage_previous',
                                label: 'Previous',
                                //functionName: 'getSuiteletPage(' + scriptId + ', ' + deploymentId + ', ' + (pageId - 1) + ')'
                                functionName: 'getSuiteletPage("customscript_sl_vendor_page_creednz_info" ,   "customdeploy_sl_vendor_page_creednz_info", ' + (pageId - 1) + ')'

                            });
                        }
                        if (pageId != pageCount - 1) {
                            form.addButton({
                                id: 'custpage_next',
                                label: 'Next',
                                functionName: 'getSuiteletPage("customscript_sl_vendor_page_creednz_info" ,   "customdeploy_sl_vendor_page_creednz_info", ' + (pageId + 1) + ')'

                                //functionName: 'getSuiteletPage(' + scriptId + ', ' + deploymentId + ', ' + (pageId + 1) + ')'
                            });
                        }
                    }
                    // Add drop-down and options to navigate to specific page
                    var selectOptions = form.addField({
                        id: 'custpage_pageid',
                        label: 'Page Index',
                        type: ui.FieldType.SELECT
                    });
                    /* selectOptions.updateLayoutType({
                        layoutType: ui.FieldLayoutType.NORMAL
                     });*/
                    for (i = 0; i < pageCount; i++) {
                        if (i == pageId) {
                            selectOptions.addSelectOption({
                                value: 'pageid_' + i,
                                text: ((i * PAGE_SIZE) + 1) + ' – ' + ((i + 1) * PAGE_SIZE),
                                isSelected: true
                            });
                        } else {
                            selectOptions.addSelectOption({
                                value: 'pageid_' + i,
                                text: ((i * PAGE_SIZE) + 1) + ' – ' + ((i + 1) * PAGE_SIZE)
                            });
                        }
                    }

                    //var creedNzTransactionsParse = JSON.parse(creedNzTransactions);
                    let creedNzTransactionsParse = creednz_api_lib.getCreednzVendorFindings(filterExternalId);



                    if (creedNzTransactionsParse) {
                        log.debug("creedNzTransactionsParse", creedNzTransactionsParse);

                    }
                    let creedNzTransactionsLength = creedNzTransactionsParse.length;
                    let riskFlag = 0;
                    let bankRiskStatus = 0;
                    let operationRiskStatus = 0;
                    let sanctionRiskStatus = 0;
                    let cyberRiskStatus = 0;
                    //get data from response
                    if (creedNzTransactionsLength > 0) {
                        for (let i = 0; i < creedNzTransactionsLength; i++) {
                            try {

                                //  log.debug("cyberRiskField",cyberRiskField.defaultValue);
                                let vendorFindingsId = creedNzTransactionsParse[i].id;
                                log.debug("vendor findings id", vendorFindingsId);
                                let vendorFindingsType = creedNzTransactionsParse[i].type;
                                // log.debug("vendor findings type", vendorFindingsType);
                                let vendorFindingsTitle = creedNzTransactionsParse[i].title;
                                // log.debug("vendor findings title", vendorFindingsTitle);
                                let vendorFindingsCategory = creedNzTransactionsParse[i].category;
                                //log.debug("vendorFindingsCategory", vendorFindingsCategory);
                                let vendorFindingsDescription = creedNzTransactionsParse[i].description;
                                // log.debug("vendorFindingsDescription", vendorFindingsDescription);
                                //setSublistValues(creedNzSublist,vendorFindingsId,vendorFindingsType,vendorFindingsTitle,vendorFindingsCategory,vendorFindingsDescription,j);
                                if (vendorFindingsId) {
                                    creedNzSublist.setSublistValue({
                                        id: 'custpage_vendor_id',
                                        line: i,
                                        value: vendorFindingsId
                                    });
                                    log.debug("vendorFindingsId is set to sublist");
                                }

                                if (vendorFindingsType) {
                                    creedNzSublist.setSublistValue({
                                        id: 'custpage_vendor_type',
                                        line: i,
                                        value: vendorFindingsType
                                    });
                                }

                                if (vendorFindingsTitle) {
                                    creedNzSublist.setSublistValue({
                                        id: 'custpage_vendor_title',
                                        line: i,
                                        value: vendorFindingsTitle
                                    });
                                }

                                if (vendorFindingsCategory) {
                                    creedNzSublist.setSublistValue({
                                        id: 'custpage_description',
                                        line: i,
                                        value: vendorFindingsCategory
                                    });
                                }

                                if (vendorFindingsDescription) {
                                    log.debug("vendorFindingsDescription", vendorFindingsDescription);
                                    creedNzSublist.setSublistValue({
                                        id: 'custpage_category',
                                        line: i,
                                        value: vendorFindingsDescription
                                    });
                                }

                                // check risk status
                                if (vendorFindingsCategory == "BankAccount") {
                                    if (vendorFindingsType == 'Alert') {
                                        bankRiskStatus = 1;
                                        riskFlag = 1;
                                    }

                                } else if (vendorFindingsCategory == "PaymentOperations") {
                                    if (vendorFindingsType == 'Alert') {
                                        operationRiskStatus = 1;
                                        riskFlag = 1;

                                    }

                                } else if (vendorFindingsCategory == "Sanctions") {
                                    if (vendorFindingsType == 'Alert') {
                                        sanctionRiskStatus = 1;
                                        riskFlag = 1;

                                    }

                                } else if (vendorFindingsCategory == "CyberRisk") {
                                    if (vendorFindingsType == 'Alert') {
                                        cyberRiskStatus = 1;
                                        riskFlag = 1;

                                    }

                                }


                            } catch (err) {
                                log.debug("error in for loop", err);
                            }
                        } //end for loop
                        //update custom record to check vendor is on risk or not
                        log.debug("risk flag", riskFlag);
                        log.debug("Bank risk flag", bankRiskStatus);
                        log.debug("operational risk flag", operationRiskStatus);
                        log.debug("cyber risk flag", cyberRiskStatus);
                        log.debug("sanction risk flag", sanctionRiskStatus);
                        if (bankRiskStatus) {
                            bankAccRiskField.defaultValue = "ON RISK"
                        } else {
                            bankAccRiskField.defaultValue = "NO RISK"

                        }
                        if (operationRiskStatus) {
                            operationRiskField.defaultValue = "ON RISK"
                        } else {
                            operationRiskField.defaultValue = "NO RISK"

                        }
                        if (sanctionRiskStatus) {
                            sanctionRiskField.defaultValue = "ON RISK"
                        } else {
                            sanctionRiskField.defaultValue = "NO RISK"

                        }
                        if (cyberRiskStatus) {
                            cyberRiskField.defaultValue = "ON RISK"
                        } else {
                            cyberRiskField.defaultValue = "NO RISK"

                        }

                        //
                        if (filterVendorId) {
                            let vendorEvalRecId = record.submitFields({
                                type: 'customrecord_vendor_evaluation_table',
                                id: filterVendorId,
                                values: {
                                    'custrecord_vendor_risk_status': riskFlag
                                }
                            });
                            //    var closeHtml = '<html><body><script type="text/javascript">window.opener.location.reload(); alert("record reload");</script></body></html>';
                            //   context.response.writePage(closeHtml);
                            //   log.debug("complete reload opener");
                        }
                    } //end if
                    // j++
                    //  });
                    //  }

                    context.response.writePage(form);
                    log.debug("reload opener");
                    //   var closeHtml = '<html><body><script type="text/javascript">window.opener.location.reload();</script></body></html>';
                    //   context.response.write(closeHtml);
                    log.debug("complete reload opener");

                } catch (err) {
                    log.debug("error", err);
                }
            } else {
                //post
                try {
                } catch (err) {
                    log.debug("error in post", err);
                }
            } //end post
        } //end execute


        function runSearch(searchId, searchPageSize) {
            try {
                //check sorting method
                /*var searchObj = search.load({
                   id: searchId
                });*/
                let searchObj = searchlib.customsearch_ss_vendor_creednz_informa()
                return searchObj.runPaged({
                    pageSize: searchPageSize
                });
            } catch (er) {
                log.debug('Error on runSearch', JSON.stringify(er));
            }
        } //end runsearch

        return {
            onRequest: onRequest
        };
    });