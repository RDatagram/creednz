/**
 * @NApiVersion 2.1
 */
define(['N/https', 'N/record'],
    /**
 * @param{https} https
 * @param{record} record
 */
    (https, record) => {

        const getTokenCreednz = (creednzClientId, creednzClientSecret, creednzAuth0, creednzAudience) => {
            try {
                // var creedApiUrl = "https://creednz-test.us.auth0.com/oauth/token";
                const creedApiUrl = creednzAuth0;
                let creedNzApiHeaders = {
                    'content-type': 'application/x-www-form-urlencoded'
                };
                let newAccessTokenData = {
                    "client_id": creednzClientId,
                    "client_secret": creednzClientSecret,
                    "grant_type": "client_credentials",
                    "audience": creednzAudience
                };
                let creedNzTokenApiResponse = https.post({
                    url: creedApiUrl,
                    headers: creedNzApiHeaders,
                    body: newAccessTokenData
                });
                // log.debug("creedNzTokenApiResponse", creedNzTokenApiResponse);
                let creedNzTokenBody = creedNzTokenApiResponse.body;
                // log.debug("creedNzTokenBody", creedNzTokenBody);
                creedNzTokenBody = JSON.parse(creedNzTokenBody);
                let accessToken = creedNzTokenBody.access_token;
                log.debug("accessToken in getAccessToken", accessToken);
                let currentDate = new Date();
                // log.debug('currentDate', currentDate);
                record.submitFields({
                    type: 'customrecord_creednz_details',
                    id: 1,
                    values: {
                        'custrecord_creednz_access_token': accessToken,
                        'custrecord_creednz_last_updated_date': currentDate
                    }
                });
                return accessToken;
            } catch (err) {
                log.debug("error in function getAccessToken", err);
            }
        }
        return {getTokenCreednz}

    });
