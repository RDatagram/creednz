/**
 * @NApiVersion 2.1
 */

/**
 * @typedef {Object} XMLCreednzObj
 * @property {string} pmtId - Payment ID
 * @property {string} currencyCode
 * @property {string} amount
 * @property {string} paymentDate
 * @property {string} payerName
 * @property {string} payeeName
 * @property {string} payeeBankAccountNumber
 * @property {string} payerBankAccountNumber
 * @property {string} routingNumber
 */

define(['N/file', 'N/xml'],
    /**
     * @param file
     * @param xml
     */
    (file, xml) => {

        const getElement = (jsonObj, field) => {
            // payment["element"]["CurCode"][0]
            let returnObj = {};

            try {
                returnObj = jsonObj["element"][field][0];
            } catch (e) {
                log.error({
                    title: 'Error in getElement',
                    details: e.message
                })
            }

            return returnObj
        }

        const getElementText = (jsonObj, field) => {
            // payment["element"]["CurCode"][0]
            let returnText = "";

            try {
                returnText = jsonObj["element"][field][0].element.text;
            } catch (e) {
                log.error({
                    title: 'Error in getElementText',
                    details: e.message
                })
            }
            return returnText;
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

                        Object.keys(node.attributes).forEach(attr => {

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
         *
         * @param paymentRecord
         * @return {XMLCreednzObj}
         */
        const getDataFromXML = (paymentRecord) => {


            const custbody_ica_batch_id = paymentRecord.getValue('custbody_flat_file');
            const tranid = paymentRecord.getValue('tranid');

            const xmlContent = file.load({id: custbody_ica_batch_id}).getContents();

            const xmlDoc = xml.Parser.fromString({text: xmlContent});
            let jsonObj = parseElement(xmlDoc);

            let payments = jsonObj["File"][0]["element"]["PmtRec"];
            let result = {};

            payments.forEach(payment => {

                let pmtId = payment["element"]["PmtID"][0].element.text;

                if (pmtId === tranid) {

                    result.pmtId = pmtId;
                    result.currencyCode = getElementText(payment, "CurCode"); //payment["element"]["CurCode"][0].element.text;
                    result.amount = getElementText(payment, "CurAmt"); // payment["element"]["CurAmt"][0].text;
                    result.paymentDate = getElementText(payment, "ValueDate"); // payment["element"]["ValueDate"][0].element.text;


                    // ovo preraditi na hasKey
                    const orgnrParty = getElement(payment, "OrgnrParty");
                    if (orgnrParty.hasOwnProperty("element") && orgnrParty.element.hasOwnProperty("Name")) {
                        // if (payment["element"]["OrgnrParty"][0]["element"]["Name"]) {
                        let helper = getElement(orgnrParty, "Name");
                        helper = getElementText(helper, "Name1");
                        result.payerName = helper;
                    } else {
                        result.payerName = "";
                    }

                    const rcvrParty = getElement(payment, "RcvrParty");
                    const rcvrPartyName = getElement(rcvrParty, "Name");
                    result.payeeName = getElementText(rcvrPartyName, "Name1");

                    /*
                     <OrgnrDepAcctID>
                        <DepAcctID AcctCur="USD" AcctID="4945751220" AcctType="D">
                            <BankInfo BankIDType="ABA" Name="Wells Fargo">
                            <BankID>121000248</BankID>
                            <RefInfo RefType="ACH">
                                <RefID>4800864026</RefID> //  payeeBankAccountNumber
                            </RefInfo>
                            </BankInfo>
                        </DepAcctID>
                    </OrgnrDepAcctID>
                     */

                    const OrgnrDepAcctID = getElement(payment, "OrgnrDepAcctID");
                    const OrgnrDepAcctID_DepAcctID = getElement(OrgnrDepAcctID, "DepAcctID");
                    result.payerBankAccountNumber = OrgnrDepAcctID_DepAcctID.attributes["AcctID"];

                    /*
                    <RcvrDepAcctID>
                                <DepAcctID AcctCur="USD" AcctID="40806383" AcctType="D">
                                    <BankInfo BankIDType="ABA">
                                        <BankID>021000089</BankID> //routingNumber
                                    </BankInfo>
                                </DepAcctID>
                            </RcvrDepAcctID>
                     */
                    const RcvrDepAcctID = getElement(payment, "RcvrDepAcctID");
                    const RcvrDepAcctID_DepAcctID = getElement(RcvrDepAcctID, "DepAcctID");
                    result.payeeBankAccountNumber = RcvrDepAcctID_DepAcctID.attributes["AcctID"];
                    const RcvrDepAcctID_DepAcctID_BankInfo = getElement(RcvrDepAcctID_DepAcctID, "BankInfo");
                    result.routingNumber = getElementText(RcvrDepAcctID_DepAcctID_BankInfo,"BankID");

                    log.debug({
                        title: 'match Tranid ' + tranid,
                        details: result
                    });

                }
            });

            return result;
        }

        /**
         *
         * @param paymentRecord
         * @param {XMLCreednzObj} dataObj
         *
         */
        const updateCreednz = (paymentRecord, dataObj) => {

            const FIELDMAP = {
                "custbody_creednz_amount": dataObj.amount || "0.00",
                "custbody_creednz_currency_code": dataObj.currencyCode || "",
                "custbody_creednz_payername": dataObj.payerName || "",
                "custbody_creednz_payeename": dataObj.payeeName || "",
                "custbody_payee_bank_acc_number": dataObj.payeeBankAccountNumber || "",
                "custbody_payer_bank_acc_number": dataObj.payerBankAccountNumber || "",
                "custbody_creednz_routing_number": dataObj.routingNumber || "",
                "custbody_creednz_payment_date": dataObj.paymentDate || "",
            };

            Object.keys(FIELDMAP).forEach(map => {
                paymentRecord.setValue({
                    fieldId: map,
                    value: FIELDMAP[map]
                });
            });

        }

        return {getDataFromXML, updateCreednz}

    });
