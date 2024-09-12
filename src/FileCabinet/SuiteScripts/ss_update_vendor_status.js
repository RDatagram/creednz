/**
 * @NApiVersion 2.1
 * @NScriptType ScheduledScript
 * @NModuleScope Public
 * @author Rajitha K S
 * Script brief description:
   Scheduled Script is used for following tasks:
    1.Schedule script to update vendor status
 * Revision History:
 *
 * Date                 Issue/Case          Author          Issue Fix Summary
 * =============================================================================================
 * 2023/july/17                          Rajitha         Initial version.
 *          
 */
    var executionCount;
   
    define(['N/https', 'N/log', 'N/record', 'N/encode', 'N/format', 'N/search', 'N/email', 'N/runtime', 'N/task'], (https, log, record, encode, format, search, email, runtime, task) => {
       function execute(context) {
          try {
            var startTime = new Date().getTime();

            // load vendor search
            var vendorSearch = search.load({
                id: 'customsearch_ss_get_status_from_creednz'
            });
    
            vendorSearch.run().each(function(result) {
                var vendorInternalId = result.getValue({
                    name: 'internalid'
                });
                var creednzExternalId = result.getValue({
                    name: 'custentity_vendor_external_id'
                });

                //check access token existing or not and expired or not
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
                    var lastUpdatedDateTimeNow = format.format({
                        value: lastUpdatedDateTime,
                        type: format.Type.DATETIMETZ
                     });
                     var parsedDateStringAsRawDateObject = format.parse({
                        value: lastUpdatedDateTimeNow,
                        type: format.Type.DATETIMETZ
                     });
                     var accessTokenTimeDiff = (currentDate.getTime() - parsedDateStringAsRawDateObject.getTime()) / 1000;
                     log.debug("time difference in seconds", accessTokenTimeDiff);
                     // if access token expired, create new access token using refresh token
                     if (accessTokenTimeDiff > 86400) {
                        // create new access token
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

                //get vendor status from creednz
                var creedNzApiHeaders = {
                    'accept': 'application/json',
                    'content-type': 'application/json',
                    'authorization': 'Bearer ' + lastSyncAccessToken
                 };
              //  var creednzVendorStatusUrl = "https://edge.staging.creednz.com/external/microsoft-dynamics/vendor-status/"+ creednzExternalId;
            //  var creednzVendorStatusUrl = "https://edge.staging.creednz.com/external/erp/vendor/status/"+ creednzExternalId;
            var creednzVendorStatusUrl = creednzBaseUrl + "/external/erp/vendor/status/"+ creednzExternalId;
              var creedNzStatusResponse = https.get({
                    url: creednzVendorStatusUrl,
                    headers: creedNzApiHeaders
                 });
                 log.debug("creedNzStatusResponse",creedNzStatusResponse);
                 var creedNzStatusTransactions = creedNzStatusResponse.body;
                 log.debug("creedNzStatusTransactions Body",creedNzStatusTransactions);
                 //get consignment id
                 var creedNzStatusTransactionsParse = JSON.parse(creedNzStatusTransactions);
                 log.debug("creedNzStatusTransactionsParse", creedNzStatusTransactionsParse);
                 log.debug(creedNzStatusTransactionsParse.status);
                 log.debug(creedNzStatusTransactionsParse.externalId);
                 var creednzRiskStatus = creedNzStatusTransactionsParse.status;
                 log.debug(creedNzStatusTransactionsParse.externalId);

                 //set status in custom field in vendor record
                 var recId = record.submitFields({
                    type: record.Type.VENDOR,
                    id: vendorInternalId,
                    values: {
                       custentity_creednz_risk_status: creednzRiskStatus,
                    },
                    options: {
                       enableSourcing: false,
                       ignoreMandatoryFields: true
                    }
                 });
                 log.debug("record updated",recId);
  


                 // Reschedule the task
                var endTime = new Date().getTime();
                var timeElapsed = (endTime * 0.001) - (startTime * 0.001);
                var scriptObj = runtime.getCurrentScript();
                var remainingUsage = scriptObj.getRemainingUsage();
                if (remainingUsage < 1000 || timeElapsed > 3300) // time more than 55 min
                {
                    log.debug("Usage Exceeded Resubmitting remainingUsage", remainingUsage);
        
                    var scheduledScriptTask = task.create({
                    taskType: task.TaskType.SCHEDULED_SCRIPT,
                    scriptId: runtime.getCurrentScript().id,
                    deploymentId: runtime.getCurrentScript().deploymentId
                    });
        
                    log.debug("ssTask" + scheduledScriptTask);
                    scheduledScriptTask.submit();

                }
                else{
                  return true;
                }

            });


               } catch (err) {
             log.debug("error", err);
          }
       }
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
          // log.debug("creedNzTokenApiResponse", creedNzTokenApiResponse);
           var creedNzTokenBody = creedNzTokenApiResponse.body;
          // log.debug("creedNzTokenBody", creedNzTokenBody);
           creedNzTokenBody = JSON.parse(creedNzTokenBody);
           var accessToken = creedNzTokenBody.access_token;
           log.debug("accessToken in getAccessToken", accessToken);
           var currentDate = new Date();
          // log.debug('currentDate', currentDate);
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
          execute: execute,
          getAccessToken: getAccessToken
       };
    });