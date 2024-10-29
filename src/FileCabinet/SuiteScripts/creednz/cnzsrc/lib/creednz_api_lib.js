/**
 * @NApiVersion 2.1
 */
define(['N/https', 'N/record', 'N/search', './creednz_token_lib', 'N/format'],
    /**
     * @param{https} https
     * @param{record} record
     * @param{search} search
     * @param{format} format
     * @param creednz_token_lib
     */
    (https, record, search, creednz_token_lib, format) => {

        const baseCreednzPost = (endPoint, dataObj, currentCreednzObject) => {

            try { // get token and baseUrl
                let creednzObj = {};
                if (currentCreednzObject) {
                    creednzObj = currentCreednzObject
                } else {
                    creednzObj = creednz_token_lib.checkAccessToken();
                }

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
                    title: 'creedNzResponse',
                    details: JSON.stringify(creedNzResponse)
                })
                // check return code
                if (creedNzResponse.code !== 201) {
                    log.error({
                        title: 'Response code from CreedNZ API',
                        details: JSON.stringify({endpoint: endPoint, responseCode: creedNzResponse.code})
                    });
                }
                return creedNzResponse;
            } catch (e) {
                log.error({
                    title: 'Error in POST',
                    details: JSON.stringify({endpoint: endPoint, responseCode: e})
                });
                return '';
            }
        }

        const baseCreednzGet = (endPoint, currentCreednzObject) => {
            let creednzObj = {};

            try {
                if (currentCreednzObject) {
                    creednzObj = currentCreednzObject
                } else {
                    creednzObj = creednz_token_lib.checkAccessToken();
                }
                // get token and baseUrl

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
                    title: 'creedNzResponse',
                    details: JSON.stringify(creedNzResponse)
                })
                // check return code
                if (creedNzResponse.code !== 200) {
                    log.error({
                        title: 'Response code from CreedNZ API',
                        details: JSON.stringify({endpoint: endPoint, responseCode: creedNzResponse.code})
                    });
                }

                let creedNzTransactions = creedNzResponse.body;
                let creedNzTransactionsParse = JSON.parse(creedNzTransactions);

                log.debug({
                    title: 'creedNzTransactionsParse from :' + endPoint,
                    details: JSON.stringify(creedNzTransactionsParse)
                });

                return creedNzTransactionsParse;
            } catch (e) {
                log.error({
                    title: 'Error in GET',
                    details: JSON.stringify({endpoint: endPoint, responseCode: e})
                });
                return '';
            }
        }


        const buildAnalyzeVendorDtoFromRecord = (currentRecord) => {
            let vendorObj = {
                // code to build analyzeVendorDto from currentRecord
            };
            //"name": "string",
            let vendorName = currentRecord.getValue({
                fieldId: "entityid"
            });
            if (vendorName) {
                vendorObj.name = vendorName;
            }
            //  "internalId": "string",
            let vendorRecId = JSON.stringify(currentRecord.id);
            if (vendorRecId) {
                vendorObj.internalId = vendorRecId;
            }

            // "registrationCode": "string",
            let vendorCreednzRegCode = currentRecord.getValue({
                fieldId: "custentity_registraion_code_creednz"
            });
            if (vendorCreednzRegCode) {
                vendorObj.registrationCode = vendorCreednzRegCode;
            }
            //  "primarySubsidiary": "string",
            let vendorSubsidiary = currentRecord.getText({
                fieldId: "subsidiary"
            });
            if (vendorSubsidiary) {
                vendorObj.primarySubsidiary = vendorSubsidiary;
            }
            // "dateCreated": "2024-09-18T10:39:46.451Z",
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

            //  "lastModified": "2024-09-18T10:39:46.451Z",
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
            // "email": "string",
            let vendorEmail = currentRecord.getValue({
                fieldId: "email"
            });
            if (vendorEmail) {
                vendorObj.email = vendorEmail;
            }
            // "phone": "string",
            let vendorPhone = currentRecord.getValue({
                fieldId: "phone"
            });
            if (vendorPhone) {
                vendorObj.phone = vendorPhone;
            }
            // TODO:
            // "primaryContact": "string",

            //"vendorPaymentMethod": "string",
            let vendorCreednzPaymentMethod = currentRecord.getValue({
                fieldId: "custentity_vendor_payment_method_creeedn"
            });
            if (vendorCreednzPaymentMethod) {
                vendorObj.vendorPaymentMethod = vendorCreednzPaymentMethod;
            }

            // TODO:
            // "taxpayerID": "string",
            // TODO:
            // "taxpayerIdType": "string",
            let vendorCreednztaxpayerID = currentRecord.getValue({
                fieldId: "taxidnum"
            });
            if (vendorCreednzPaymentMethod) {
                vendorObj.taxpayerID = vendorCreednztaxpayerID;
                vendorObj.taxpayerIdType = 'Employer Identification Number'
            }

            // "currency": "string",
            let vendorCurrency = currentRecord.getValue({
                fieldId: "currency"
            });
            if (vendorCurrency) {
                vendorObj.currency = vendorCurrency;
            }

            // "bankAccountName": "string",
            // TODO:
            // "bankAccountType": "string",
            let vendorCreednzBankAccName = currentRecord.getValue({
                fieldId: "custentity_bank_account_name_creednz"
            });
            if (vendorCreednzBankAccName) {
                vendorObj.bankAccountName = vendorCreednzBankAccName;
                vendorObj.bankAccountType = 'Checking account';
            }

            // "bankNumber": "string",
            let vendorCreednzBankNumber = currentRecord.getValue({
                fieldId: "custentity_bank_number_creednz"
            });
            if (vendorCreednzBankNumber) {
                vendorObj.bankNumber = vendorCreednzBankNumber;
            }

            // "branchName": "string",
            let vendorCreednzBranchName = currentRecord.getValue({
                fieldId: "custentity_branch_name_creednz"
            });
            if (vendorCreednzBranchName) {
                vendorObj.branchName = vendorCreednzBranchName;
            }

            // "branchNumber": "string",
            let vendorCreednzBranchNumber = currentRecord.getValue({
                fieldId: "custentity_branch_number_creednz"
            });
            if (vendorCreednzBranchNumber) {
                vendorObj.branchNumber = vendorCreednzBranchNumber;
            }

            // "bankCode": "string",
            let vendorCreednzBankCode = currentRecord.getValue({
                fieldId: "custentity_bank_code_creednz"
            });
            if (vendorCreednzBankCode) {
                vendorObj.bankCode = vendorCreednzBankCode;
            }

            // "bankAccountNumber": "string",
            let vendorCreednzBankAccNumber = currentRecord.getValue({
                fieldId: "custentity_bank_account_number_creednz"
            });
            if (vendorCreednzBankAccNumber) {
                vendorObj.bankAccountNumber = vendorCreednzBankAccNumber;
            }

            // "bankAddress": "string",
            let vendorCreednzBankAddress = currentRecord.getValue({
                fieldId: "custentity_bank_address_creednz"
            });
            if (vendorCreednzBankAddress) {
                vendorObj.bankAddress = vendorCreednzBankAddress;
            }

            // "bankDetailsUpdate": "string",
            let vendorCreednzBankDetailsUpdate = currentRecord.getValue({
                fieldId: "custentity_bank_details_update_creednz"
            });
            if (vendorCreednzBankDetailsUpdate) {
                vendorObj.bankDetailsUpdate = vendorCreednzBankDetailsUpdate;
            }

            // "eftBankDetailsUpdate": "string",
            let vendorCreednzEftBankUpdate = currentRecord.getValue({
                fieldId: "custentity_eft_bank_detailsupdate_creedn"
            });
            if (vendorCreednzEftBankUpdate) {
                vendorObj.eftBankDetailsUpdate = vendorCreednzEftBankUpdate;
            }

            // "eftBillPayment": "string",
            let vendorCreednzEftBillPayment = currentRecord.getValue({
                fieldId: "custentity_eft_bill_payment_creednz"
            });
            if (vendorCreednzEftBillPayment) {
                vendorObj.eftBillPayment = vendorCreednzEftBillPayment;
            }

            // "iban": "string",
            let vendorCreednzIban = currentRecord.getValue({
                fieldId: "custentity_iban_creednz"
            });
            if (vendorCreednzIban) {
                vendorObj.iban = vendorCreednzIban;
            }

            //  "swift": "string",
            let vendorCreednzSwift = currentRecord.getValue({
                fieldId: "custentity_swift_creednz"
            });
            if (vendorCreednzSwift) {
                vendorObj.swift = vendorCreednzSwift;
            }

            // "routingNumber": "string",
            let vendorCreednzRoutingNumber = currentRecord.getValue({
                fieldId: "custentity_routing_number_creednz"
            });
            if (vendorCreednzRoutingNumber) {
                vendorObj.routingNumber = vendorCreednzRoutingNumber;
            }

            // "paypalAccount": "string",
            let vendorCreednzPaypalAcc = currentRecord.getValue({
                fieldId: "custentity_paypal_account_creednz"
            });
            if (vendorCreednzPaypalAcc) {
                vendorObj.paypalAccount = vendorCreednzPaypalAcc;
            }

            // "billingAddress": "string",
            let vendorAddress = currentRecord.getValue({
                fieldId: "billaddressee"
            });
            if (vendorAddress) {
                vendorObj.billingAddress = vendorAddress;
            }

            //  "billingCountry": "string",
            let vendorBillCountry = currentRecord.getValue({
                fieldId: "billcountry"
            });
            if (vendorBillCountry) {
                vendorObj.billingCountry = vendorBillCountry;
            }

            // "billingCity": "string",
            let vendorBillCity = currentRecord.getValue({
                fieldId: "billcity"
            });
            if (vendorBillCity) {
                vendorObj.billingCity = vendorBillCity;
            }

            // TODO:
            // "billingRegion": "string",


            // "billingZip": "string",
            let vendorBillZip = currentRecord.getValue({
                fieldId: "billzip"
            });
            if (vendorBillZip) {
                vendorObj.billingZip = vendorBillZip;
            }

            /* var vendorPrimaryContact = currentRecord.getValue({
                fieldId: "contact"
             });*/

            /* TODO:
            "reportingTax1099": true,
            "paymentTerms": "string",
            "createdByFpVisitorId": "string",
            "createdByFpRequestId": "string",
            "shippingAddress": "string",
            "bankAccountCheckApproval": true
             */
            let vendorCreednzRisk = currentRecord.getValue({
                fieldId: "custentity_creednz_risk_status"
            });

            let vendorCreednzLastUpdated = currentRecord.getValue({
                fieldId: "custentity_creednz_updated_on"
            });

            return vendorObj;
        }

        const postCreednzAnalyzeVendor = (dataObj) => {

            let creedNzResponse = baseCreednzPost("/external/erp/vendor/analyze", dataObj, null);
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

            return baseCreednzGet(creednzVendorInformation, null);

        }


        const getCreednzVendorFindings = (externalId) => {
            const creednzVendorInformation = "/external/erp/vendor/findings/externalId/" + externalId;

            return baseCreednzGet(creednzVendorInformation, null);

        }

        // /external/erp/vendor-evaluation/
        const getCreednzVendorEvaluation_vendor = (evaluationId) => {
            const creednzVendorInformation = "/external/erp/vendor-evaluation/" + evaluationId + "/vendor";

            return baseCreednzGet(creednzVendorInformation, null);

        }

        // /external/erp/vendor-evaluation/status/:vendorEvaluationId
        const getCreednzVendorEvaluation_status = (externalId) => {
            const baseGetUrl = "/external/erp/vendor-evaluation/status/" + externalId;

            return baseCreednzGet(baseGetUrl, null);

        }

        const postCreednzVendorEvaluation_send_results = (externalId) => {

            const basePostUrl = "/external/erp/vendor-evaluation/" + externalId + "/send-results";


            let creedNzResponse = baseCreednzPost(basePostUrl, null, null);
            let creedNzTransactions = creedNzResponse.body;

            let creedNzTransactionsParse = JSON.parse(creedNzTransactions);
            log.debug({
                title: "creedNzTransactionsParse",
                details: creedNzTransactionsParse
            });

            return creedNzTransactionsParse;
        }

        const getCreednzVendorEvaluation_all = () => {
            const baseGetUrl = "/external/erp/vendor-evaluation";

            return baseCreednzGet(baseGetUrl, null);

        }
        const getCreednzVendorEvaluation_one = (evalutionId) => {
            const baseGetUrl = "/external/erp/vendor-evaluation/"+evalutionId;

            return baseCreednzGet(baseGetUrl, null);

        }

        const postCreednzInviteVendor = (dataObj) => {
            let creedNzResponse = baseCreednzPost("/external/erp/vendor-evaluation/invite", dataObj, null);
            let creedNzTransactions = creedNzResponse.body;

            let creedNzTransactionsParse = JSON.parse(creedNzTransactions);
            log.debug({
                title: "creedNzTransactionsParse",
                details: creedNzTransactionsParse
            });

            return creedNzTransactionsParse;
        }

        const checkRiskFromFindings = (findings) => {
            let riskObject = {
                riskFlag: "Validated",
                bankRiskStatus: "No Risk",
                operationRiskStatus: "No Risk",
                sanctionRiskStatus: "No Risk",
                cyberRiskStatus: "No Risk"
            }

            // iterate array findings
            const CATEGORY_TO_RISK_STATUS = {
                "BankAccount": "bankRiskStatus",
                "PaymentOperations": "operationRiskStatus",
                "Sanctions": "sanctionRiskStatus",
                "CyberRisk": "cyberRiskStatus"
            }
            const CATEGORY_TO_MODERATE_VALUE = {
                "BankAccount": "Moderate Risk",
                "PaymentOperations": "Moderate Risk",
                "Sanctions": "Moderate Risk",
                "CyberRisk": "Moderate Risk"
            }
            const CATEGORY_TO_RISK_VALUE = {
                "BankAccount": "On Risk",
                "PaymentOperations": "On Risk",
                "Sanctions": "On Risk",
                "CyberRisk": "On Risk"
            }
            for (let i = 0; i < findings.length; i++) {

                let vendorFindingsId = findings[i].id;
                let vendorFindingsType = findings[i].type;
                let vendorFindingsTitle = findings[i].title;
                let vendorFindingsCategory = findings[i].category;
                let vendorFindingsDescription = findings[i].description;

                const GAP_TYPE = 'Gap';
                const ALERT_TYPE = 'Alert';

                if (vendorFindingsType === GAP_TYPE) {
                    let riskStatusProperty = CATEGORY_TO_RISK_STATUS[vendorFindingsCategory]
                    if (riskStatusProperty) {
                        riskObject[riskStatusProperty] = CATEGORY_TO_MODERATE_VALUE[vendorFindingsCategory];
                    }
                }

                if (vendorFindingsType === ALERT_TYPE) {
                    let riskStatusProperty = CATEGORY_TO_RISK_STATUS[vendorFindingsCategory]
                    if (riskStatusProperty) {
                        riskObject[riskStatusProperty] = CATEGORY_TO_RISK_VALUE[vendorFindingsCategory];
                        riskObject.riskFlag = "At Risk";
                    }
                }

            }

            return riskObject;
        }
        const regexRiskStatus = (inputValue) => {
            const mapValues = {
                "AtRisk" : "At Risk"
            }

            if (mapValues[inputValue]) {
                return mapValues[inputValue]
            } else {
                return inputValue
            }

        }
        const regexCategory = (inputValue) => {
            const mapValues = {
                "BankAccount" : "Bank Account",
                "PaymentOperations" : "Payment Operations",
            }

            if (mapValues[inputValue]) {
                return mapValues[inputValue]
            } else {
                return inputValue
            }
        }

        const buildVendprAppURL = (vendorID) => {
            let baseLookUp = search.lookupFields({
                type: 'customrecord_creednz_details',
                id: 1,
                columns: ['custrecord_creednz_app_base_url']
            });
            let baseUrl = baseLookUp.custrecord_creednz_app_base_url;

            log.debug({
                title: "buildVendprAppURL",
                details: baseUrl
            });

            return baseUrl + "/vendors/" + vendorID;
        }


        const postCreednzAnalyzePayment = (dataObj) => {

            let creedNzResponse = baseCreednzPost("/external/erp/payment/analyze", dataObj, null);
            let creedNzTransactions = creedNzResponse.body;

            let creedNzTransactionsParse = JSON.parse(creedNzTransactions);
            log.debug({
                title: "creedNzTransactionsParse",
                details: creedNzTransactionsParse
            });

            return creedNzTransactionsParse;
        }

        const getCreednzVPaymentStatus = (externalId) => {
            const creednzVendorInformation = "/external/erp/vendor/status/" + externalId;

            return baseCreednzGet(creednzVendorInformation, null);

        }

        const buildAnalyzePaymentDtoFromTransaction = (currentRecord) => {
            let paymentObj = {

            }

            log.debug({
                title : 'buildAnalyzePaymentDtoFromTransaction',
                details: paymentObj
            });

            return paymentObj;
        }

        return {
            baseCreednzPost,
            buildAnalyzeVendorDtoFromRecord,
            baseCreednzGet,
            getCreednzVendorFindings,
            postCreednzAnalyzeVendor,
            getCreednzVendorStatus,
            postCreednzInviteVendor,
            getCreednzVendorEvaluation_vendor,
            getCreednzVendorEvaluation_status,
            getCreednzVendorEvaluation_all,
            getCreednzVendorEvaluation_one,
            postCreednzVendorEvaluation_send_results,
            checkRiskFromFindings,
            regexRiskStatus: regexRiskStatus,
            regexCategory,
            buildVendprAppURL,
            postCreednzAnalyzePayment,
            getCreednzVPaymentStatus,
            buildAnalyzePaymentDtoFromTransaction
        }

    });
