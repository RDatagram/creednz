/**
 *
 * @NApiVersion 2.1
 * @NScriptType Suitelet
 * @NModuleScope public
 * @author Rajitha
 * Script brief description:
     Show Creednz information
 * Revision History:
 *
 * Date                 Issue/Case         Author          Issue Fix Summary
 * =============================================================================================
 * 2024/June/20                            Rajitha         Initial version.
 */
     var PAGE_SIZE = 500;
     var customFilters = {};
     var searchId = 'customsearch_ss_vendor_creednz_informa';
     define(["N/ui/serverWidget", "N/log", "N/record", "N/url", "N/search", "N/task", "N/redirect", "N/runtime", "N/encode", "N/file", "N/https", "N/format"], (ui, log, record, url, search, task, redirect, runtime, encode, file, https, format) => {
        function onRequest(context) {
           var nsAccountId = runtime.accountId;
           log.debug("context",runtime.accountId);
           // get method

           if (context.request.method === 'GET') {
              try {


               //gte parameters from client script
               var filterExternalId = context.request.parameters.externalId;
               log.debug("filterExternalId in GET",filterExternalId);
               var filterVendorId = context.request.parameters.vendorId;

                 var form = ui.createForm({
                    id: 'creednz_informaition',
                    title: 'Creednz Informaition'
                 });
                 if(nsAccountId == "TSTDRV1255519")
                  {
                     form.clientScriptModulePath = 'SuiteScripts/cs_send_vendor_to_creednz.js';
                    // form.clientScriptModulePath = 'SuiteScripts/cs_send_vendor_to_creednz_info.js';

                  }
                  else{
                   form.clientScriptModulePath = 'SuiteBundles/Bundle 537712/cs_send_vendor_to_creednz.js';
                  }
                 var pageId = parseInt(context.request.parameters.page);


                 var vendorExternalId =  form.addField({
                  id : 'custpage_vendor_external_id',
                  type : ui.FieldType.TEXT,
                  label : 'Vendor External ID'
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
                  var bankAccRiskField = form.addField({
                    id: 'custpage_bank_acc_risk',
                    type: ui.FieldType.TEXT,
                    label: 'Bank Account Risk'
                 }).updateDisplayType({
                    displayType: ui.FieldDisplayType.DISABLED
                 });
                 var operationRiskField = form.addField({
                    id: 'custpage_operation_risk',
                    type: ui.FieldType.TEXT,
                    label: 'Operation Risk'
                 }).updateDisplayType({
                    displayType: ui.FieldDisplayType.DISABLED
                 });
                 var sanctionRiskField = form.addField({
                    id: 'custpage_sanction_risk',
                    type: ui.FieldType.TEXT,
                    label: 'Sanction Risk'
                 }).updateDisplayType({
                    displayType: ui.FieldDisplayType.DISABLED
                 });
                 var cyberRiskField = form.addField({
                    id: 'custpage_cyber_risk',
                    type: ui.FieldType.TEXT,
                    label: 'Cyber Risk'
                 }).updateDisplayType({
                    displayType: ui.FieldDisplayType.DISABLED
                 });
                 
                 //create sublist
                 var creedNzSublist = form.addSublist({
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
                 var retrieveSearch = runSearch(searchId, PAGE_SIZE);
                
                 var pageCount = Math.ceil(retrieveSearch.count / PAGE_SIZE);
                 log.debug('pageCount', pageCount);
                 // Set pageId to correct value if out of index
                 if (!pageId || pageId == '' || pageId < 0) {
                    pageId = 0;
                    log.debug('pageId', pageId);
                 } else if (pageId >= pageCount) pageId = pageCount - 1;

                 if(retrieveSearch.count > 0)
                  {
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
               
                    var k = 0;
                    // set sublist values
                   // var lastSyncAccessToken = checkAccessToken();
                    var creednzObj = checkAccessToken();
                  var lastSyncAccessToken =  creednzObj.lastSyncAccessToken;
                  var creednzBaseUrl = creednzObj.creednzBaseUrl;
                  log.debug("creednzObj from checkAccessToken",creednzObj);
                    //check for access token from custom record
              
                       //get from creednz   24120260-2c17-419e-9f5c-948b150c8f0c
                    //   var creednzVendorInformation = "https://edge.staging.creednz.com/external/microsoft-dynamics/vendor-findings/externalId/" + filterExternalId;
                    var creednzVendorInformation = creednzBaseUrl +"/external/erp/vendor/findings/externalId/" + filterExternalId;
  
                    log.debug("creednzVendorInformation",creednzVendorInformation);
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
                       if(creedNzTransactionsParse)
                        {
                           log.debug("creedNzTransactionsParse", creedNzTransactionsParse);

                        }
                       var creedNzTransactionsLength = creedNzTransactionsParse.length;
                      var riskFlag = 0;
                      var bankRiskStatus = 0;
                      var operationRiskStatus = 0;
                      var sanctionRiskStatus = 0;
                      var cyberRiskStatus = 0;
                       //get data from response
                       if (creedNzTransactionsLength > 0) {
                          for (var i = 0; i < creedNzTransactionsLength; i++) {
                             try {
                              
                            //  log.debug("cyberRiskField",cyberRiskField.defaultValue);
                                var vendorFindingsId = creedNzTransactionsParse[i].id;
                                log.debug("vendor findings id", vendorFindingsId);
                                var vendorFindingsType = creedNzTransactionsParse[i].type;
                               // log.debug("vendor findings type", vendorFindingsType);
                                var vendorFindingsTitle = creedNzTransactionsParse[i].title;
                               // log.debug("vendor findings title", vendorFindingsTitle);
                                var vendorFindingsCategory = creedNzTransactionsParse[i].category;
                                //log.debug("vendorFindingsCategory", vendorFindingsCategory);
                                var vendorFindingsDescription = creedNzTransactionsParse[i].description;
                               // log.debug("vendorFindingsDescription", vendorFindingsDescription);
                               //setSublistValues(creedNzSublist,vendorFindingsId,vendorFindingsType,vendorFindingsTitle,vendorFindingsCategory,vendorFindingsDescription,j);
                               if(vendorFindingsId)
                                {
                                   creedNzSublist.setSublistValue({
                                   id: 'custpage_vendor_id',
                                   line: i,
                                   value: vendorFindingsId
                                });
                                log.debug("vendorFindingsId is set to sublist");
                             }
                    
                             if(vendorFindingsType)
                                {
                                   creedNzSublist.setSublistValue({
                                   id: 'custpage_vendor_type',
                                   line: i,
                                   value: vendorFindingsType
                                });
                             }
                    
                             if(vendorFindingsTitle)
                                {
                                   creedNzSublist.setSublistValue({
                                   id: 'custpage_vendor_title',
                                   line: i,
                                   value: vendorFindingsTitle
                                });
                             }
                    
                             if(vendorFindingsCategory)
                                {
                                   creedNzSublist.setSublistValue({
                                   id: 'custpage_description',
                                   line: i,
                                   value: vendorFindingsCategory
                                });
                             }
                    
                             if(vendorFindingsDescription)
                                {
                                   log.debug("vendorFindingsDescription",vendorFindingsDescription);
                                   creedNzSublist.setSublistValue({
                                   id: 'custpage_category',
                                   line: i,
                                   value: vendorFindingsDescription
                                });
                             }

                             // check risk status 
                             if(vendorFindingsCategory == "BankAccount")
                             {
                                if(vendorFindingsType == 'Alert')
                                {
                                    bankRiskStatus = 1;
                                    riskFlag = 1;
                                }
                                
                             }
                             else if(vendorFindingsCategory == "PaymentOperations")
                             {
                                if(vendorFindingsType == 'Alert')
                                {
                                    operationRiskStatus = 1;
                                    riskFlag = 1;

                                }
                                
                             }
                             else if(vendorFindingsCategory == "Sanctions")
                                {
                                   if(vendorFindingsType == 'Alert')
                                   {
                                       sanctionRiskStatus = 1;
                                       riskFlag = 1;

                                   }
                                   
                                }
                            else if(vendorFindingsCategory == "CyberRisk")
                                {
                                   if(vendorFindingsType == 'Alert')
                                    {
                                        cyberRiskStatus = 1;
                                        riskFlag = 1;

                                    }
                                   
                                }

                            
                             } catch (err) {
                                log.debug("error in for loop", err);
                             }
                          } //end for loop
                          //update custom record to check vendor is on risk or not
                          log.debug("risk flag",riskFlag);
                          log.debug("Bank risk flag",bankRiskStatus);
                          log.debug("operational risk flag",operationRiskStatus);
                          log.debug("cyber risk flag",cyberRiskStatus);
                          log.debug("sanction risk flag",sanctionRiskStatus);
                          if(bankRiskStatus)
                          {
                            bankAccRiskField.defaultValue = "ON RISK"
                          }
                          else
                          {
                            bankAccRiskField.defaultValue = "NO RISK"
 
                          }
                          if(operationRiskStatus)
                            {
                              operationRiskField.defaultValue = "ON RISK"
                            }
                            else
                            {
                                operationRiskField.defaultValue = "NO RISK"
   
                            }
                         if(sanctionRiskStatus)
                            {
                                sanctionRiskField.defaultValue = "ON RISK"
                            }
                            else
                            {
                                sanctionRiskField.defaultValue = "NO RISK"
       
                            }
                        if(cyberRiskStatus)
                            {
                                cyberRiskField.defaultValue = "ON RISK"
                            }
                            else
                            {
                                cyberRiskField.defaultValue = "NO RISK"
           
                            }

                          if(filterVendorId)
                           {
                              var vendorEvalRecId = record.submitFields({
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
              try {} catch (err) {
                 log.debug("error in post", err);
              }
           } //end post
        } //end execute
        function checkAccessToken() {
         try {
            var creednzObj ={};
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
            log.debug("creednzBaseUrl",creednzBaseUrl);
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

            creednzObj.lastSyncAccessToken = lastSyncAccessToken ;
            creednzObj.creednzBaseUrl = creednzBaseUrl;
            log.debug("creednzObj in function",creednzObj);

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
        function runSearch(searchId, searchPageSize) {
           try {
              //check sorting method
              var searchObj = search.load({
                 id: searchId
              });
              return searchObj.runPaged({
                 pageSize: searchPageSize
              });
           } catch (er) {
              log.debug('Error on runSearch', JSON.stringify(er));
           }
        } //end runsearch
        function fetchSearchResult(pagedData, pageIndex) {
           try {
              var searchPage = pagedData.fetch({
                 index: pageIndex
              });
              // log.debug('searchPage', searchPage);
              var results = new Array();
              searchPage.data.forEach(function(result) {
                 //recordId = result.id;
                 var vendorId = result.getValue({
                    name: "internalid",
                    label: "Internal ID"
                 });
                 var vendorName = result.getValue({
                    name: "entityid",
                    label: "Name"
                 });
                 var vendorExternalId = result.getValue({
                    name: "custentity_vendor_external_id",
                    label: "CREEDNZ ID"
                 });
                 var vendorCreednzRisk = result.getValue({
                    name: "custentity_creednz_risk_status",
                    label: "Creednz Risk Status"
                 });
                 var vendorCreednzLastUpdated = result.getValue({
                    name: "custentity_creednz_updated_on",
                    label: "Creednz Updated On"
                 });
                 results.push({
                    'vendorId': vendorId,
                    'vendorName': vendorName,
                    'vendorExternalId': vendorExternalId,
                    'vendorCreednzRisk': vendorCreednzRisk,
                    'vendorCreednzLastUpdated': vendorCreednzLastUpdated
                 });
              });
              return results;
           } catch (er) {
              log.debug('Error on fetchSearchResult', JSON.stringify(er));
           }
        } //end fetch search
       /* function setSublistValues(creedNzSublist,vendorFindingsId,vendorFindingsType,vendorFindingsTitle,vendorFindingsCategory,vendorFindingsDescription,k)
        {
         log.debug("set sublist value",creedNzSublist +","+ vendorFindingsId+","+vendorFindingsType+","+vendorFindingsCategory);
         if(vendorFindingsId)
            {
               creedNzSublist.setSublistValue({
               id: 'custpage_vendor_id',
               line: k,
               value: vendorFindingsId
            });
            log.debug("vendorFindingsId is set to sublist");
         }

         if(vendorFindingsType)
            {
               creedNzSublist.setSublistValue({
               id: 'custpage_vendor_type',
               line: k,
               value: vendorFindingsType
            });
         }

         if(vendorFindingsTitle)
            {
               creedNzSublist.setSublistValue({
               id: 'custpage_vendor_title',
               line: k,
               value: vendorFindingsTitle
            });
         }

         if(vendorFindingsCategory)
            {
               creedNzSublist.setSublistValue({
               id: 'custpage_description',
               line: k,
               value: vendorFindingsCategory
            });
         }

         if(vendorFindingsDescription)
            {
               log.debug("vendorFindingsDescription",vendorFindingsDescription);
               creedNzSublist.setSublistValue({
               id: 'custpage_category',
               line: k,
               value: vendorFindingsDescription
            });
         }
         return creedNzSublist;
        }*/
        return {
           onRequest: onRequest
        };
     });