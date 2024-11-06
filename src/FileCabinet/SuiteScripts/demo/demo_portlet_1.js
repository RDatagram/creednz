/**
 * @NApiVersion 2.1
 * @NScriptType Portlet
 */
define(['N/ui/serverWidget'], function (serverWidget) {
    function render(params) {
        let portlet = params.portlet;

        // Set up Portlet
        portlet.title = 'My Simple Portlet';

        let htmlContent = `<style> 
            .table-class { 
            border-collapse: collapse;
                border: 1px solid black;
                font-size: medium;
                width: 50%;
            }
            .row-class { 
                border: 1px solid black;
                font-size: medium;
            }
            </style>`;

        htmlContent += '<p style="font-size: medium">Total number of Vendors: <span style="color: green">5800</span></p>';
        htmlContent += '<p style="font-size: medium">Total Vendors At Risk: <span style="color: red">123</span></p>';
        htmlContent += '<table class="table-class"><thead><th>Total</th><th>At risk</th></thead>';
        htmlContent += '<tr class="row-class"><td style="color: green">5800</td><td style="color: red">123</td></tr>';
        htmlContent +=  '</table>';

        let myField2 = portlet.addField({
            id: 'custpage_text2',
            type: serverWidget.FieldType.INLINEHTML,
            label: 'My Field'
        });
        myField2.defaultValue = htmlContent;
    }



    return {
        render: render
    };
});