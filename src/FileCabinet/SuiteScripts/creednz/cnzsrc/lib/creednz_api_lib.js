/**
 * @NApiVersion 2.1
 */
define(['N/https', 'N/record', 'N/search', './creednz_token_lib'],
    /**
     * @param{https} https
     * @param{record} record
     * @param{search} search
     * @param{creednz_token_lib} creednz_token_lib
     */
    (https, record, search, creednz_token_lib) => {

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
            if (creedNzResponse.code !== 200) {
                log.error({
                    title: 'Failed to post data to CreedNZ API',
                    details:JSON.stringify({endpoint:endPoint,responseCode:creedNzResponse.code})
                });
            }
            return creedNzResponse;
        }

        return {baseCreednzPost}

    });
