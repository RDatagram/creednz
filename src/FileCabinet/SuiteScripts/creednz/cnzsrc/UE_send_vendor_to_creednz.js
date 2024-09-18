/**
 * @NApiVersion 2.1
 * @NScriptType UserEventScript
 * @NModuleScope Public
 * Script brief description:
 UserEventScript Script is used for following tasks:
 1. POST vendors from netsuite to Creednz.
 */
define(['N/runtime', 'N/log', 'N/record', 'N/error', 'N/render', 'N/file', 'N/https', 'N/search', 'N/format', './lib/creednz_token_lib','./lib/creednz_api_lib'],
    (runtime, log, record, error, render, file, https, search, format, creednz_token_lib,creednz_api_lib) => {
        function afterSubmit(context) {
            try {
                // if (context.type !== context.UserEventType.CREATE) {
                const form = context.form;
                let currentRec = context.newRecord;
                let currentRecId = context.newRecord.id;
                log.debug("currentRecId", currentRecId);
                log.debug("current record", currentRec);

                let currentRecord = record.load({
                    type: record.Type.VENDOR,
                    id: currentRecId,
                    isDynamic: true,
                });
                /* var vendorId = result.getValue({
                    name: "internalid",
                    label: "Internal ID"
                 });*/
                let vendorArray = [];
                let vendorObj = {};
                vendorObj = creednz_api_lib.buildAnalyzeVendorDtoFromRecord(currentRecord);

                /*
                let vendorName = currentRecord.getValue({
                    fieldId: "entityid"
                });
                if (vendorName) {
                    vendorObj.name = vendorName;
                }

                let vendorRecId = JSON.stringify(currentRecId);
                if (vendorRecId) {
                    vendorObj.internalId = vendorRecId;
                }

                let vendorCreednzRegCode = currentRecord.getValue({
                    fieldId: "custentity_registraion_code_creednz"
                });
                if (vendorCreednzRegCode) {
                    vendorObj.registrationCode = vendorCreednzRegCode;
                }

                let vendorSubsidiary = currentRecord.getValue({
                    fieldId: "subsidiary"
                });
                if (vendorSubsidiary) {
                    vendorObj.primarySubsidiary = vendorSubsidiary;
                }

                let vendorCreatedDate = currentRecord.getValue({
                    fieldId: "datecreated"
                });
                let vendordateCreatedFormat = format.format({
                    value: vendorCreatedDate,
                    type: format.Type.DATETIMETZ
                });
                let vendordateCreated1 = format.parse({
                    value: vendordateCreatedFormat,
                    type: format.Type.DATETIMETZ
                });
                if (vendordateCreated1) {
                    vendorObj.dateCreated = vendordateCreated1;
                }

                //  var vendordateCreated1 = new Date(vendorCreatedDate);
                let vendorLastModified = currentRecord.getValue({
                    fieldId: "lastmodifieddate"
                });
                let lastModifiedFormat = format.format({
                    value: vendorLastModified,
                    type: format.Type.DATETIMETZ
                });
                let lastModified2 = format.parse({
                    value: lastModifiedFormat,
                    type: format.Type.DATETIMETZ
                });
                if (lastModified2) {
                    vendorObj.lastModified = lastModified2;
                }

                let vendorEmail = currentRecord.getValue({
                    fieldId: "email"
                });
                if (vendorEmail) {
                    vendorObj.email = vendorEmail;
                }

                let vendorPhone = currentRecord.getValue({
                    fieldId: "phone"
                });
                if (vendorPhone) {
                    vendorObj.phone = vendorPhone;
                }

                let vendorCreednzPaymentMethod = currentRecord.getValue({
                    fieldId: "custentity_vendor_payment_method_creeedn"
                });
                if (vendorCreednzPaymentMethod) {
                    vendorObj.vendorPaymentMethod = vendorCreednzPaymentMethod;
                }

                let vendorCurrency = currentRecord.getValue({
                    fieldId: "currency"
                });
                // vendorCurrency = JSON.stringify(vendorCurrency);
                if (vendorCurrency) {
                    vendorObj.currency = vendorCurrency;
                }

                let vendorCreednzBankAccName = currentRecord.getValue({
                    fieldId: "custentity_bank_account_name_creednz"
                });
                if (vendorCreednzBankAccName) {
                    vendorObj.bankAccountName = vendorCreednzBankAccName;
                }

                let vendorCreednzBankNumber = currentRecord.getValue({
                    fieldId: "custentity_bank_number_creednz"
                });
                if (vendorCreednzBankNumber) {
                    vendorObj.bankNumber = vendorCreednzBankNumber;
                }

                let vendorCreednzBranchName = currentRecord.getValue({
                    fieldId: "custentity_branch_name_creednz"
                });
                if (vendorCreednzBranchName) {
                    vendorObj.branchName = vendorCreednzBranchName;
                }

                let vendorCreednzBranchNumber = currentRecord.getValue({
                    fieldId: "custentity_branch_number_creednz"
                });
                if (vendorCreednzBranchNumber) {
                    vendorObj.branchNumber = vendorCreednzBranchNumber;
                }

                let vendorCreednzBankCode = currentRecord.getValue({
                    fieldId: "custentity_bank_code_creednz"
                });
                if (vendorCreednzBankCode) {
                    vendorObj.bankCode = vendorCreednzBankCode;
                }

                let vendorCreednzBankAccNumber = currentRecord.getValue({
                    fieldId: "custentity_bank_account_number_creednz"
                });
                if (vendorCreednzBankAccNumber) {
                    vendorObj.bankAccountNumber = vendorCreednzBankAccNumber;
                }

                let vendorCreednzBankAddress = currentRecord.getValue({
                    fieldId: "custentity_bank_address_creednz"
                });
                if (vendorCreednzBankAddress) {
                    vendorObj.bankAddress = vendorCreednzBankAddress;
                }

                let vendorCreednzBankDetailsUpdate = currentRecord.getValue({
                    fieldId: "custentity_bank_details_update_creednz"
                });
                if (vendorCreednzBankDetailsUpdate) {
                    vendorObj.bankDetailsUpdate = vendorCreednzBankDetailsUpdate;
                }

                let vendorCreednzEftBankUpdate = currentRecord.getValue({
                    fieldId: "custentity_eft_bank_detailsupdate_creedn"
                });
                if (vendorCreednzEftBankUpdate) {
                    vendorObj.eftBankDetailsUpdate = vendorCreednzEftBankUpdate;
                }

                let vendorCreednzEftBillPayment = currentRecord.getValue({
                    fieldId: "custentity_eft_bill_payment_creednz"
                });
                if (vendorCreednzEftBillPayment) {
                    vendorObj.eftBillPayment = vendorCreednzEftBillPayment;
                }


                let vendorCreednzIban = currentRecord.getValue({
                    fieldId: "custentity_iban_creednz"
                });
                if (vendorCreednzIban) {
                    vendorObj.iban = vendorCreednzIban;
                }

                let vendorCreednzSwift = currentRecord.getValue({
                    fieldId: "custentity_swift_creednz"
                });
                if (vendorCreednzSwift) {
                    vendorObj.swift = vendorCreednzSwift;
                }

                let vendorCreednzRoutingNumber = currentRecord.getValue({
                    fieldId: "custentity_routing_number_creednz"
                });
                if (vendorCreednzRoutingNumber) {
                    vendorObj.routingNumber = vendorCreednzRoutingNumber;
                }

                let vendorCreednzPaypalAcc = currentRecord.getValue({
                    fieldId: "custentity_paypal_account_creednz"
                });
                if (vendorCreednzPaypalAcc) {
                    vendorObj.paypalAccount = vendorCreednzPaypalAcc;
                }


                let vendorAddress = currentRecord.getValue({
                    fieldId: "billaddressee"
                });
                if (vendorAddress) {
                    vendorObj.billingAddress = vendorAddress;
                }

                let vendorBillCountry = currentRecord.getValue({
                    fieldId: "billcountry"
                });
                if (vendorBillCountry) {
                    vendorObj.billingCountry = vendorBillCountry;
                }
                let vendorBillCity = currentRecord.getValue({
                    fieldId: "billcity"
                });
                if (vendorBillCity) {
                    vendorObj.billingCity = vendorBillCity;
                }
                let vendorBillZip = currentRecord.getValue({
                    fieldId: "billzip"
                });
                if (vendorBillZip) {
                    vendorObj.billingZip = vendorBillZip;
                }

                /!* var vendorPrimaryContact = currentRecord.getValue({
                    fieldId: "contact"
                 });*!/


                let vendorCreednzRisk = currentRecord.getValue({
                    fieldId: "custentity_creednz_risk_status"
                });

                let vendorCreednzLastUpdated = currentRecord.getValue({
                    fieldId: "custentity_creednz_updated_on"
                });
*/

                //log.debug("vendorNameToSet",vendorNameToSet);

                vendorArray.push(vendorObj);
                log.debug("vendorArray", vendorArray);
                let dataObj = {};
                dataObj.analyzeVendorDtos = vendorArray;


                // TODO: Replace with library function

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
                log.debug("error", err.message);
            }
        }

        return {
            afterSubmit: afterSubmit
        };
    });