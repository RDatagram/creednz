/**
 * @NApiVersion 2.1
 * @NScriptType UserEventScript
 * @NModuleScope Public
 * @author Rajitha K S
  * Script brief description:
   UserEventScript Script is used for following tasks:
    1. POST vendors from netsuite to Creednz.

 * Revision History:
 *
 * Date                 Issue/Case              Author          Issue Fix Summary
 * =============================================================================================
 * 2023/July/17                            Rajitha         Initial version.
 *          
 */
    define(['N/runtime', 'N/log', 'N/record', 'N/error', 'N/render', 'N/file', 'N/https', 'N/search', 'N/format'], (runtime, log, record, error, render, file, https, search, format) => {
      function afterSubmit(context) {
         try {
             // if (context.type !== context.UserEventType.CREATE) {
            var form = context.form;
            let currentRec = context.newRecord;
            let currentRecId = context.newRecord.id;
            log.debug("currentRecId", currentRecId);
            log.debug("current record", currentRec);
            var currentRecord = record.load({
               type: record.Type.VENDOR,
               id: currentRecId,
               isDynamic: true,
            });
            /* var vendorId = result.getValue({
                name: "internalid",
                label: "Internal ID"
             });*/
            var vendorArray = [];
            var vendorObj ={};
            var vendorName = currentRecord.getValue({
               fieldId: "entityid"
            });
            if(vendorName)
               {
                vendorObj.name =  vendorName;
               }
           /* var vendorPrimaryContact = currentRecord.getValue({
               fieldId: "contact"
            });*/
            var vendorCurrency = currentRecord.getValue({
               fieldId: "currency"
            });
           // vendorCurrency = JSON.stringify(vendorCurrency);
            if(vendorCurrency)
              {
               vendorObj.currency =  vendorCurrency;
              }
            var vendorPhone = currentRecord.getValue({
               fieldId: "phone"
            });
            if(vendorPhone)
               {
                vendorObj.phone =  vendorPhone;
               }
            var vendorSubsidiary = currentRecord.getValue({
               fieldId: "subsidiary"
            });
            if(vendorSubsidiary)
               {
                vendorObj.primarySubsidiary =  vendorSubsidiary;
               }
            var vendorCreatedDate = currentRecord.getValue({
               fieldId: "datecreated"
            });
            var vendordateCreatedFormat = format.format({
               value: vendorCreatedDate,
               type: format.Type.DATETIMETZ
            });
            var vendordateCreated1 = format.parse({
               value: vendordateCreatedFormat,
               type: format.Type.DATETIMETZ
            });
            if(vendordateCreated1)
              {
               vendorObj.dateCreated =  vendordateCreated1;
              }     
          //  var vendordateCreated1 = new Date(vendorCreatedDate);
            var vendorLastModified = currentRecord.getValue({
               fieldId: "lastmodifieddate"
            });
            var lastModifiedFormat = format.format({
               value: vendorLastModified,
               type: format.Type.DATETIMETZ
            });
            var lastModified2 = format.parse({
               value: lastModifiedFormat,
               type: format.Type.DATETIMETZ
            });
            if(lastModified2)
              {
               vendorObj.lastModified =  lastModified2;
              }
            var vendorEmail = currentRecord.getValue({
               fieldId: "email"
            });
            if(vendorEmail)
               {
                vendorObj.email =  vendorEmail;
               }
               var vendorAddress = currentRecord.getValue({
                  fieldId: "billaddressee"
               });
               if(vendorAddress)
                  {
                   vendorObj.address =  vendorAddress;
                  }

            var vendorBillCountry = currentRecord.getValue({
               fieldId: "billcountry"
            });
            if(vendorBillCountry)
               {
                vendorObj.billingCountry =  vendorBillCountry;
               }
            var vendorBillCity = currentRecord.getValue({
               fieldId: "billcity"
            });
            if(vendorBillCity)
               {
                vendorObj.billingCity =  vendorBillCity;
               }
            var vendorBillZip = currentRecord.getValue({
               fieldId: "billzip"
            });
            if(vendorBillZip)
               {
                vendorObj.billingZip =  vendorBillZip;
               }
            /* var vendorExternalId = currentRec.getValue({
                       fieldId: "custentity_vendor_external_id"
                  });*/
            var vendorCreednzRisk = currentRecord.getValue({
               fieldId: "custentity_creednz_risk_status"
            });

            var vendorCreednzLastUpdated = currentRecord.getValue({
               fieldId: "custentity_creednz_updated_on"
            });
            var vendorRecId = JSON.stringify(currentRecId);
            if(vendorRecId)
               {
                vendorObj.internalId =  vendorRecId;
               }



               var vendorCreednzPaymentMethod = currentRecord.getValue({
                  fieldId: "custentity_vendor_payment_method_creeedn"
               });
               if(vendorCreednzPaymentMethod)
                 {
                  vendorObj.vendorPaymentMethod =  vendorCreednzPaymentMethod;
                 }
               var vendorCreednzBankAccName = currentRecord.getValue({
                  fieldId: "custentity_bank_account_name_creednz"
               });
               if(vendorCreednzBankAccName)
                 {
                  vendorObj.bankAccountName =  vendorCreednzBankAccName;
                 }
               var vendorCreednzBankAddress = currentRecord.getValue({
                  fieldId: "custentity_bank_address_creednz"
               });
               if(vendorCreednzBankAddress)
                 {
                  vendorObj.bankAddress =  vendorCreednzBankAddress;
                 }
               var vendorCreednzBankCode = currentRecord.getValue({
                  fieldId: "custentity_bank_code_creednz"
               });
               if(vendorCreednzBankCode)
                 {
                  vendorObj.bankCode =  vendorCreednzBankCode;
                 }
               var vendorCreednzBankNumber = currentRecord.getValue({
                  fieldId: "custentity_bank_number_creednz"
               });
               if(vendorCreednzBankNumber)
                 {
                  vendorObj.bankAccountNumber =  vendorCreednzBankNumber;
                 }
               var vendorCreednzBankDetailsUpdate = currentRecord.getValue({
                  fieldId: "custentity_bank_details_update_creednz"
               });
               if(vendorCreednzBankDetailsUpdate)
                 {
                  vendorObj.bankDetailsUpdate =  vendorCreednzBankDetailsUpdate;
                 }
               var vendorCreednzEftBankUpdate = currentRecord.getValue({
                  fieldId: "custentity_eft_bank_detailsupdate_creedn"
               });
               if(vendorCreednzEftBankUpdate)
                 {
                  vendorObj.eftBankDetailsUpdate =  vendorCreednzEftBankUpdate;
                 }
               var vendorCreednzEftBillPayment = currentRecord.getValue({
                  fieldId: "custentity_eft_bill_payment_creednz"
               });
               if(vendorCreednzEftBillPayment)
                 {
                  vendorObj.eftBillPayment =  vendorCreednzEftBillPayment;
                 }
               var vendorCreednzIban = currentRecord.getValue({
                  fieldId: "custentity_iban_creednz"
               });
               if(vendorCreednzIban)
                 {
                  vendorObj.iban =  vendorCreednzIban;
                 }
               var vendorCreednzSwift = currentRecord.getValue({
                  fieldId: "custentity_swift_creednz"
               });
               if(vendorCreednzSwift)
                 {
                  vendorObj.swift =  vendorCreednzSwift;
                 }
               var vendorCreednzRegCode = currentRecord.getValue({
                  fieldId: "custentity_registraion_code_creednz"
               });
               if(vendorCreednzRegCode)
                 {
                  vendorObj.registrationCode =  vendorCreednzRegCode;
                 }
               var vendorCreednzBranchNumber = currentRecord.getValue({
                  fieldId: "custentity_branch_number_creednz"
               });
               if(vendorCreednzBranchNumber)
                 {
                  vendorObj.branchNumber =  vendorCreednzBranchNumber;
                 }
               var vendorCreednzBranchName = currentRecord.getValue({
                  fieldId: "custentity_branch_name_creednz"
               });
               if(vendorCreednzBranchName)
                 {
                  vendorObj.branchName =  vendorCreednzBranchName;
                 }
               var vendorCreednzRoutingNumber = currentRecord.getValue({
                  fieldId: "custentity_routing_number_creednz"
               });
               if(vendorCreednzRoutingNumber)
                 {
                  vendorObj.routingNumber =  vendorCreednzRoutingNumber;
                 }
               var vendorCreednzPaypalAcc = currentRecord.getValue({
                  fieldId: "custentity_paypal_account_creednz"
               });
               if(vendorCreednzPaypalAcc)
                 {
                  vendorObj.paypalAccount =  vendorCreednzPaypalAcc;
                 }
            //log.debug("vendorNameToSet",vendorNameToSet);
           /*var vendorObj = {
               "name": vendorName,
               "internalId": vendorRecId,
               //"registrationCode": "",
               "primarySubsidiary": vendorSubsidiary,
               "dateCreated": vendordateCreated1,
               "lastModified": lastMofified2,
               "email": vendorEmail,
                "phone": "+19365358895",
               "vendorPaymentMethod": "incididunt",
               "currency": "1",
               "bankAccountName": "culpa commodo one",
               "bankNumber": "ut minim dolor aliqua one",
               "branchName": "irure one",
               "branchNumber": "pariatur Lorem one",
               "bankCode": "dolore cillum one",
               "bankAccountNumber": "tempor eu non one",
               "bankAddress": "deserunt est enim id one",
               "bankDetailsUpdate": "eu enim one",
               "eftBankDetailsUpdate": "occaecat proident nulla minim one",
               "eftBillPayment": "esse laboris ut laborum one",
               "iban": "a one",
               "swift": "exercitation est eiusmod one",
               "routingNumber": "12",
               "paypalAccount": "sed nostrud incididunt one",
               "billingAddress": "1 one",
               "billingCountry": "US one",
               "billingCity": "Selmerside one",
               "billingRegion": "ullamco do one",
               "billingZip": "34552-7771 526"
            };*/
            vendorArray.push(vendorObj);
            log.debug("vendorArray", vendorArray);
            var dataObj = {};
            dataObj.analyzeVendorDtos = vendorArray;
            // get item details
            //set data to post
            //log.debug("dataObj", JSON.stringify(dataObj));
            //get access token from custom record
           var creednzObj = checkAccessToken();
           var lastSyncAccessToken =  creednzObj.lastSyncAccessToken;
           var creednzBaseUrl = creednzObj.creednzBaseUrl;
           
            //post data to Creednz
          
          var creedNzUrl = creednzBaseUrl +"/external/erp/vendor/analyze";

            var creedNzApiPostHeaders = {
               'accept': 'application/json',
               'content-type': 'application/json',
               'authorization': 'Bearer ' + lastSyncAccessToken
               //  'authorization': 'Bearer eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCIsImtpZCI6IjBDQURVdzIwQUJYNnJvMm1uaU5jXyJ9.eyJpc3MiOiJodHRwczovL2NyZWVkbnotdGVzdC51cy5hdXRoMC5jb20vIiwic3ViIjoiN2Q3ZTZjZVFCeFJZTU5vYUJzVEpTUVdETDFpeWR1NkZAY2xpZW50cyIsImF1ZCI6Imh0dHBzOi8vY3JlZWRuei1keW5hbWljcy1pbnRlZ3JhdGlvbiIsImlhdCI6MTcxODE4MTY5MSwiZXhwIjoxNzE4MjY4MDkxLCJndHkiOiJjbGllbnQtY3JlZGVudGlhbHMiLCJhenAiOiI3ZDdlNmNlUUJ4UllNTm9hQnNUSlNRV0RMMWl5ZHU2RiJ9.yz2MZFO21PrhwxxuEXxIb0tvwcgRVWQMyzFU2kqMp63PZ5n7x9_H9tZtP96ui96dVGnVqRmKF3V-43eVQNUpqb3LTwzTmuFe6MYg3yHV4Q9sSRJvTOm7mPlbC14Af52MopnkK0YmqxdZnagJ7MdkXr5a_z2PWmnsDhZ811OiMKNo22As7yd9oA60D9MfSmUf6iXq_41Ms6olae4vPgvWbLJ9kedfkahnYlQ-em947kEdMR6XT-X0PiOHnjOurQnNm0USDqHuirKIrl76Z4S92yk5P3qbnl-gSzdgYc9wzGPSOsLYAKu8Fj0ls_1sDABYRz5RIKyCleV_O4oolkqzLw'
            };
            var creedNzResponse = https.post({
               url: creedNzUrl,
               headers: creedNzApiPostHeaders,
               body: JSON.stringify(dataObj)
            });
            log.debug("creedNzResponse", creedNzResponse);
            var creedNzTransactions = creedNzResponse.body;
            log.debug("creedNzTransactions Body", creedNzTransactions);
            //get consignment id
            var creedNzTransactionsParse = JSON.parse(creedNzTransactions);
            log.debug("creedNzTransactionsParse", creedNzTransactionsParse);
            var creednzExternalId = creedNzTransactionsParse[0].vendorExternalId;
            log.debug("creednzExternalId", creednzExternalId);
            var recId = record.submitFields({
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
         } catch (err) {
            log.debug("error", err.message);
         }
      }
   
      function checkAccessToken() {
         try {
            //get access token from custom record
            var creednzObj = {};
            //get access token from custom record
            var accessTokenLookup = search.lookupFields({
               type: 'customrecord_creednz_details',
               id: 1,
               columns: ['custrecord_creednz_access_token', 'custrecord_creednz_last_updated_date', 'custrecord_creednz_client_id', 'custrecord_creednz_client_secret', 'custrecord_creednz_base_url','custrecord_auth0_get_token_api','custrecord_audience']
            });
            var lastSyncAccessToken = accessTokenLookup.custrecord_creednz_access_token;
            var lastUpdatedDateTime = accessTokenLookup.custrecord_creednz_last_updated_date;
            var creednzClientId = accessTokenLookup.custrecord_creednz_client_id;
            var creednzClientSecret = accessTokenLookup.custrecord_creednz_client_secret;
            var creednzBaseUrl = accessTokenLookup.custrecord_creednz_base_url;
            var creednzAuth0 = accessTokenLookup.custrecord_auth0_get_token_api;
            var creednzAudience = accessTokenLookup.custrecord_audience;
            //check access token is existing or expired
            var currentDate = new Date();
            log.debug("current date", currentDate);
            // check if access token is exist or not
            if (lastSyncAccessToken) {
               //check if the access token is expired or not
               log.debug("access token exist, ckeck expired or not");
               //lastUpdatedDateTime = new Date(lastUpdatedDateTime);
               var lastUpdatedDateTimeNow = format.format({
                  value: lastUpdatedDateTime,
                  type: format.Type.DATETIMETZ
               });
               log.debug("lastUpdatedDateTimeNow", lastUpdatedDateTimeNow);
               var parsedDateStringAsRawDateObject = format.parse({
                  value: lastUpdatedDateTimeNow,
                  type: format.Type.DATETIMETZ
               });
               log.debug("parsedDateStringAsRawDateObject", parsedDateStringAsRawDateObject);
               var accessTokenTimeDiff = (currentDate.getTime() - parsedDateStringAsRawDateObject.getTime()) / 1000;
               log.debug("time difference in seconds", accessTokenTimeDiff);
               // if access token expired, create new access token using refresh token
               if (accessTokenTimeDiff > 86400) {
                  // create new access token
                  log.debug('old access token is expired, create new access token');
                  lastSyncAccessToken = getAccessToken(creednzClientId, creednzClientSecret, creednzAuth0, creednzAudience);
                  log.debug("access token created when it expired", lastSyncAccessToken);
               }
            } //end if(lastSyncAccessToken)
            else {
               log.debug("no api key exist");
               // call function to create new access token
               lastSyncAccessToken = getAccessToken(creednzClientId, creednzClientSecret, creednzAuth0, creednzAudience);
               log.debug("access token created", lastSyncAccessToken);
            }

            creednzObj.lastSyncAccessToken = lastSyncAccessToken;
            creednzObj.creednzBaseUrl= creednzBaseUrl;

            return creednzObj;
         } catch (err) {
            log.debug("error in check access token", err.message);
         }
      } //end checkAccessToken
      function getAccessToken(creednzClientId, creednzClientSecret, creednzAuth0, creednzAudience) {
         try {
           // var creedApiUrl = "https://creednz-test.us.auth0.com/oauth/token";
           var creedApiUrl = creednzAuth0;

            var creedNzApiHeaders = {
               'content-type': 'application/x-www-form-urlencoded'
            };
            var newAccessTokenData = {
               "client_id": creednzClientId,
               "client_secret": creednzClientSecret,
               "grant_type": "client_credentials",
             //  "audience": "https://creednz-dynamics-integration"
             "audience": creednzAudience

            };
            var creedNzTokenApiResponse = https.post({
               url: creedApiUrl,
               headers: creedNzApiHeaders,
               body: newAccessTokenData
            });
            var creedNzTokenBody = creedNzTokenApiResponse.body;
            log.debug("creedNzTokenBody", creedNzTokenBody);
            log.debug("creedNzTokenBody", creedNzTokenBody);
            creedNzTokenBody = JSON.parse(creedNzTokenBody);
            var accessToken = creedNzTokenBody.access_token;
            log.debug("accessToken in getAccessToken", accessToken);
            //alert(accessToken)
            var currentDate = new Date();
            log.debug('currentDate', currentDate);
            record.submitFields({
               type: 'customrecord_creednz_details',
               id: 1,
               values: {
                  // 'custrecord_raken_code': 'oLL0r0',
                  'custrecord_creednz_access_token': accessToken,
                  'custrecord_creednz_last_updated_date': currentDate
               }
            });
            return accessToken;
         } catch (err) {
            log.debug("error in function getAccessToken", err);
         }
      } //end function
      return {
         afterSubmit: afterSubmit,
         getAccessToken: getAccessToken,
         checkAccessToken: checkAccessToken
      };
   });