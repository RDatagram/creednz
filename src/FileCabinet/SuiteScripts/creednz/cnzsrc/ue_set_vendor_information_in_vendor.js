/**
 * @NApiVersion 2.1
 * @NScriptType UserEventScript
 * @NModuleScope Public
 * @author Rajitha K S
  * Script brief description:
   UserEventScript Script is used for following tasks:
    1. set Creednz sub tab in vendor record

 * Revision History:
 *
 * Date                 Issue/Case              Author          Issue Fix Summary
 * =============================================================================================
 * 2023/July/12                            Rajitha         Initial version.
 *          
 */
    define(['N/runtime', 'N/log', 'N/record', 'N/error', 'N/render', 'N/file', 'N/https', 'N/search', 'N/format','N/ui/serverWidget','./lib/creednz_token_lib'],
        (runtime, log, record, error, render, file, https, search, format, serverWidget, creednz_token_lib) => {
      function beforeLoad(context) {
         try {
            var form = context.form;
            // add new button in custom record(creednz details)
            var vendorRecord = context.newRecord;
            var creednzId = vendorRecord.getValue({
               fieldId: 'custentity_vendor_external_id'
            });
            var nsAccountId = runtime.accountId;
            if (nsAccountId == "TSTDRV1255519") {
               form.clientScriptModulePath = 'SuiteScripts/cs_creednz_vendor_evaluation.js';
            } else {
               //form.clientScriptModulePath = 'SuiteBundles/Bundle 537712/cs_creednz_vendor_evaluation.js';
               form.clientScriptModulePath = './cs_creednz_vendor_evaluation.js';

            }
            //craete subtab and sublist to view creednz information
            // Add subtab
            var creednzSubtabId = 'custpage_creednz_subtab';
            form.addTab({
               id: creednzSubtabId,
               label: 'Creednz Information'
            });
            // Create a sublist under the Creednz subtab
            var creednzSublist = form.addSublist({
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
         var creedNzTransactions = creedNzGetResponse.body;
         var creedNzTransactionsParse = JSON.parse(creedNzTransactions);
         if (creedNzTransactionsParse) {
            log.debug("creedNzTransactionsParse", creedNzTransactionsParse);
         }
         var creedNzTransactionsLength = creedNzTransactionsParse.length;
         //set data in the sublist
         if (creedNzTransactionsLength > 0) 
            {
            for (var i = 0; i < creedNzTransactionsLength; i++) 
               {     
                  
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
   
   function checkAccessToken() {
      try {
         var creednzObj = {};
         //get access token from custom record
         var accessTokenLookup = search.lookupFields({
            type: 'customrecord_creednz_details',
            id: 1,
            columns: ['custrecord_creednz_access_token', 'custrecord_creednz_last_updated_date', 'custrecord_creednz_client_id', 'custrecord_creednz_client_secret', 'custrecord_creednz_base_url', 'custrecord_auth0_get_token_api', 'custrecord_audience']
         });
         var lastSyncAccessToken = accessTokenLookup.custrecord_creednz_access_token;
         var lastUpdatedDateTime = accessTokenLookup.custrecord_creednz_last_updated_date;
         var creednzClientId = accessTokenLookup.custrecord_creednz_client_id;
         var creednzClientSecret = accessTokenLookup.custrecord_creednz_client_secret;
         var creednzBaseUrl = accessTokenLookup.custrecord_creednz_base_url;
         log.debug("creednzBaseUrl", creednzBaseUrl);
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
         creednzObj.creednzBaseUrl = creednzBaseUrl;
         log.debug("creednzObj in function", creednzObj);
         return creednzObj;
      } catch (err) {
         log.debug("error in check access token", err.message);
      }
   } //end checkAccessToken
   function getAccessToken(creednzClientId, creednzClientSecret, creednzAuth0, creednzAudience) {
      try {
         return creednz_token_lib.getTokenCreednz(creednzClientId, creednzClientSecret, creednzAuth0, creednzAudience);
      } catch (err) {
         log.debug("error in function getAccessToken", err);
      }
   } //end function
   return {
      beforeLoad: beforeLoad,
      checkAccessToken: checkAccessToken,
      getAccessToken: getAccessToken
   };
   });