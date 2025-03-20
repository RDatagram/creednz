/**
 * @NApiVersion 2.1
 */
define(['N/query', 'N/search'],
    /**
 * @param{query} query
 * @param{search} search
 */
    (query, search) => {

        const genQuery = (tableName,lookupField,lookpValue,returnField) => {
            let retObj = {
                found : false,
                idRecord : -1
            };

            let qSql = 'select ' + returnField + ' as recid from ' + tableName + ' where ' + lookupField + ' = ? ';

            const qResultSet = query.runSuiteQL(
                {
                    query : qSql,
                    params: [lookpValue]
                }
            );
            /**
             *
             * @type {Array<Object>}
             * @property recid
             */
            const mapResult = qResultSet.asMappedResults();

            log.debug({
                title : 'genQuery.mapResult',
                details : mapResult
            });
            if (mapResult.length > 0) {
                retObj["found"] = true;
                retObj["idRecord"] = mapResult[0].recid;
            }

            return retObj;
        }

        return {genQuery}

    });
