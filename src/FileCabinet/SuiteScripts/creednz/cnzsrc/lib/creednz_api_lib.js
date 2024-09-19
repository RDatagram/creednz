/**
 * @NApiVersion 2.1
 */
define(['N/https', 'N/record', 'N/search', './creednz_token_lib', 'N/format'],
    /**
     * @param{https} https
     * @param{record} record
     * @param{search} search
     * @param{format} format
     */
    (https, record, search, creednz_token_lib,format) => {

        const baseCreednzPost = (endPoint,dataObj) => {

            // get token and baseUrl
            let creednzObj = creednz_token_lib.checkAccessToken();
            let lastSyncAccessToken = creednzObj.lastSyncAccessToken;
            let creednzBaseUrl = creednzObj.creednzBaseUrl;

            let creedNzApiPostHeaders = {
                'accept': 'application/json',
                'content-type': 'application/json',
                'authorization': 'Bearer ' + lastSyncAccessToken
            };
            let creedNzUrl = creednzBaseUrl + endPoint;

            let creedNzResponse = https.post({
                url: creedNzUrl,
                headers: creedNzApiPostHeaders,
                body: JSON.stringify(dataObj)
            });

            log.debug({
                title : 'creedNzResponse',
                details: JSON.stringify(creedNzResponse)
            })
            // check return code
            if (creedNzResponse.code !== 201) {
                log.error({
                    title: 'Response code from CreedNZ API',
                    details:JSON.stringify({endpoint:endPoint,responseCode:creedNzResponse.code})
                });
            }
            return creedNzResponse;
        }

        const baseCreednzGet = (endPoint) => {

            // get token and baseUrl
            let creednzObj = creednz_token_lib.checkAccessToken();
            let lastSyncAccessToken = creednzObj.lastSyncAccessToken;
            let creednzBaseUrl = creednzObj.creednzBaseUrl;

            let creedNzApiPostHeaders = {
                'accept': 'application/json',
                'content-type': 'application/json',
                'authorization': 'Bearer ' + lastSyncAccessToken
            };
            let creedNzUrl = creednzBaseUrl + endPoint;

            let creedNzResponse = https.get({
                url: creedNzUrl,
                headers: creedNzApiPostHeaders
            });

            log.debug({
                title : 'creedNzResponse',
                details: JSON.stringify(creedNzResponse)
            })
            // check return code
            if (creedNzResponse.code !== 200) {
                log.error({
                    title: 'Response code from CreedNZ API',
                    details:JSON.stringify({endpoint:endPoint,responseCode:creedNzResponse.code})
                });
            }

            let creedNzTransactions = creedNzResponse.body;
            let creedNzTransactionsParse = JSON.parse(creedNzTransactions);

            log.debug({
                title: 'creedNzTransactionsParse from :' + endPoint,
                details: JSON.stringify(creedNzTransactionsParse)
            });

            return creedNzTransactionsParse;
        }

        const buildAnalyzeVendorDtoFromRecord = (currentRecord) => {
            let vendorObj = {
                // code to build analyzeVendorDto from currentRecord
            };
            let vendorName = currentRecord.getValue({
                fieldId: "entityid"
            });
            if (vendorName) {
                vendorObj.name = vendorName;
            }

            let vendorRecId = JSON.stringify(currentRecord.id);
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

            /* var vendorPrimaryContact = currentRecord.getValue({
                fieldId: "contact"
             });*/


            let vendorCreednzRisk = currentRecord.getValue({
                fieldId: "custentity_creednz_risk_status"
            });

            let vendorCreednzLastUpdated = currentRecord.getValue({
                fieldId: "custentity_creednz_updated_on"
            });

            return vendorObj;
        }

        const postCreednzAnalyzeVendor = (dataObj) => {

            let creedNzResponse = baseCreednzPost("/external/erp/vendor/analyze",dataObj);
            let creedNzTransactions = creedNzResponse.body;

            let creedNzTransactionsParse = JSON.parse(creedNzTransactions);
            log.debug({
                title: "creedNzTransactionsParse",
                details: creedNzTransactionsParse
            });

            return creedNzTransactionsParse;
        }

        const getCreednzVendorStatus = (externalId) => {
            const creednzVendorInformation = "/external/erp/vendor/status/" + externalId;

            return  baseCreednzGet(creednzVendorInformation);

        }
        const getCreednzVendorFindings = (externalId) => {
            const creednzVendorInformation = "/external/erp/vendor/findings/externalId/" + externalId;

            return  baseCreednzGet(creednzVendorInformation);

        }



        return {
            baseCreednzPost,
            buildAnalyzeVendorDtoFromRecord,
            baseCreednzGet,
            getCreednzVendorFindings,
            postCreednzAnalyzeVendor,
            getCreednzVendorStatus
        }

    });
