/**
 * @NApiVersion 2.1
 * @NScriptType WorkflowActionScript
 */
define(['N/file', 'N/xml'],
    /**
     * @param file
     * @param xml
     */
    (file, xml) => {


        function parseAttributes(element) {
            let obj = {tag: element.nodeName};

            if (element.hasAttributes()) {
                obj.attributes = {};
                for (let i = 0; i < element.attributes.length; i++) {
                    let attr = element.attributes[i];
                    obj.attributes[attr.name] = attr.value;
                }
            }

            return obj;
        }

        function parseElement(element) {
            let obj = {};

            for (let i = 0; i < element.childNodes.length; i++) {
                let node = element.childNodes[i];


                if (node.nodeType === xml.NodeType.ELEMENT_NODE) {

                    if (!obj.hasOwnProperty(node.nodeName)) {
                        obj[node.nodeName] = [];
                    }
                    let attrObject = {};
                    if (Object.keys(node.attributes).length === 0) {

                    } else {

                        log.debug({
                            title: 'attributes ' + node.nodeName,
                            details: node.attributes
                        });

                        Object.keys(node.attributes).forEach(attr => {

                            log.debug({
                                title: 'attribute ' + attr,
                                details: node.attributes[attr].value
                            });
                            attrObject[attr] = node.attributes[attr].value;
                        })

                    }

                    obj[node.nodeName].push({"element": parseElement(node), "attributes": attrObject});

                } else if (node.nodeType === xml.NodeType.TEXT_NODE) {
                    obj["text"] = node.nodeValue;

                }
            }

            return obj;
        }

        /**
         * Defines the WorkflowAction script trigger point.
         * @param {Object} scriptContext
         * @param {Record} scriptContext.newRecord - New record
         * @param {Record} scriptContext.oldRecord - Old record
         * @param {string} scriptContext.workflowId - Internal ID of workflow which triggered this action
         * @param {string} scriptContext.type - Event type
         * @param {Form} scriptContext.form - Current form that the script uses to interact with the record
         * @since 2016.1
         */
        const onAction = (scriptContext) => {

            const paymentRecord = scriptContext.newRecord;
            const custbody_ica_batch_id = paymentRecord.getValue('custbody_flat_file');
            const tranid = paymentRecord.getValue('tranid');

            const xmlContent = file.load({id: custbody_ica_batch_id}).getContents();

            const xmlDoc = xml.Parser.fromString({text: xmlContent});

            let jsonObj = parseElement(xmlDoc);


            let payments = jsonObj["File"][0]["element"]["PmtRec"];
            /*
            log.debug({
                title: 'jsonObj',
                details: payments
            });
            let attributes = jsonObj["File"][0]["attributes"];
            log.debug({
                title: 'attributes',
                details: attributes
            });
            */
            payments.forEach(payment => {
                // Process each payment here

                log.debug({
                    title: 'payment',
                    details: payment
                });
                log.debug({
                    title: 'payment.attributes',
                    details: payment.attributes
                });

                let pmtId = payment["element"]["PmtID"][0].element.text;
                let result = {};

                if (pmtId === tranid) {


                    result.pmtId = pmtId;
                    result.currencyCode = payment["element"]["CurCode"][0].element.text;
                    result.amount = payment["element"]["CurAmt"][0].text;
                    result.paymentDate = payment["element"]["ValueDate"][0].element.text;


                    if (payment["element"]["OrgnrParty"][0]["element"]["Name"]) {
                        result.payerName = payment["element"]["OrgnrParty"][0]["element"]["Name"][0]["element"]["Name1"][0].element.text;
                    } else {
                        result.payerName = "";
                    }

                    result.payeeName = payment["element"]["RcvrParty"][0]["element"]["Name"][0]["element"]["Name1"][0].element.text;

                    log.debug({
                        title: 'match Tranid ' + tranid,
                        details: result
                    });


                }



            });

        }

        return {onAction};
    });
