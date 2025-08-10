/*
   Licensed to the Apache Software Foundation (ASF) under one or more
   contributor license agreements.  See the NOTICE file distributed with
   this work for additional information regarding copyright ownership.
   The ASF licenses this file to You under the Apache License, Version 2.0
   (the "License"); you may not use this file except in compliance with
   the License.  You may obtain a copy of the License at

       http://www.apache.org/licenses/LICENSE-2.0

   Unless required by applicable law or agreed to in writing, software
   distributed under the License is distributed on an "AS IS" BASIS,
   WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   See the License for the specific language governing permissions and
   limitations under the License.
*/
var showControllersOnly = false;
var seriesFilter = "";
var filtersOnlySampleSeries = true;

/*
 * Add header in statistics table to group metrics by category
 * format
 *
 */
function summaryTableHeader(header) {
    var newRow = header.insertRow(-1);
    newRow.className = "tablesorter-no-sort";
    var cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 1;
    cell.innerHTML = "Requests";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 3;
    cell.innerHTML = "Executions";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 7;
    cell.innerHTML = "Response Times (ms)";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 1;
    cell.innerHTML = "Throughput";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 2;
    cell.innerHTML = "Network (KB/sec)";
    newRow.appendChild(cell);
}

/*
 * Populates the table identified by id parameter with the specified data and
 * format
 *
 */
function createTable(table, info, formatter, defaultSorts, seriesIndex, headerCreator) {
    var tableRef = table[0];

    // Create header and populate it with data.titles array
    var header = tableRef.createTHead();

    // Call callback is available
    if(headerCreator) {
        headerCreator(header);
    }

    var newRow = header.insertRow(-1);
    for (var index = 0; index < info.titles.length; index++) {
        var cell = document.createElement('th');
        cell.innerHTML = info.titles[index];
        newRow.appendChild(cell);
    }

    var tBody;

    // Create overall body if defined
    if(info.overall){
        tBody = document.createElement('tbody');
        tBody.className = "tablesorter-no-sort";
        tableRef.appendChild(tBody);
        var newRow = tBody.insertRow(-1);
        var data = info.overall.data;
        for(var index=0;index < data.length; index++){
            var cell = newRow.insertCell(-1);
            cell.innerHTML = formatter ? formatter(index, data[index]): data[index];
        }
    }

    // Create regular body
    tBody = document.createElement('tbody');
    tableRef.appendChild(tBody);

    var regexp;
    if(seriesFilter) {
        regexp = new RegExp(seriesFilter, 'i');
    }
    // Populate body with data.items array
    for(var index=0; index < info.items.length; index++){
        var item = info.items[index];
        if((!regexp || filtersOnlySampleSeries && !info.supportsControllersDiscrimination || regexp.test(item.data[seriesIndex]))
                &&
                (!showControllersOnly || !info.supportsControllersDiscrimination || item.isController)){
            if(item.data.length > 0) {
                var newRow = tBody.insertRow(-1);
                for(var col=0; col < item.data.length; col++){
                    var cell = newRow.insertCell(-1);
                    cell.innerHTML = formatter ? formatter(col, item.data[col]) : item.data[col];
                }
            }
        }
    }

    // Add support of columns sort
    table.tablesorter({sortList : defaultSorts});
}

$(document).ready(function() {

    // Customize table sorter default options
    $.extend( $.tablesorter.defaults, {
        theme: 'blue',
        cssInfoBlock: "tablesorter-no-sort",
        widthFixed: true,
        widgets: ['zebra']
    });

    var data = {"OkPercent": 100.0, "KoPercent": 0.0};
    var dataset = [
        {
            "label" : "FAIL",
            "data" : data.KoPercent,
            "color" : "#FF6347"
        },
        {
            "label" : "PASS",
            "data" : data.OkPercent,
            "color" : "#9ACD32"
        }];
    $.plot($("#flot-requests-summary"), dataset, {
        series : {
            pie : {
                show : true,
                radius : 1,
                label : {
                    show : true,
                    radius : 3 / 4,
                    formatter : function(label, series) {
                        return '<div style="font-size:8pt;text-align:center;padding:2px;color:white;">'
                            + label
                            + '<br/>'
                            + Math.round10(series.percent, -2)
                            + '%</div>';
                    },
                    background : {
                        opacity : 0.5,
                        color : '#000'
                    }
                }
            }
        },
        legend : {
            show : true
        }
    });

    // Creates APDEX table
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [1.0, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [1.0, 500, 1500, "2-3-click on productId"], "isController": false}, {"data": [1.0, 500, 1500, "2-4-click on itemId"], "isController": false}, {"data": [1.0, 500, 1500, "Click on product id"], "isController": false}, {"data": [1.0, 500, 1500, "4-10-Click on sign out"], "isController": true}, {"data": [1.0, 500, 1500, "4-6-Click on add to cart"], "isController": true}, {"data": [1.0, 500, 1500, "Click on sign out-0"], "isController": false}, {"data": [1.0, 500, 1500, "4-2-Click on sign in"], "isController": true}, {"data": [1.0, 500, 1500, "Scenario-1 Search"], "isController": true}, {"data": [1.0, 500, 1500, "3-1-Open URL"], "isController": true}, {"data": [1.0, 500, 1500, "4-3-Enter usename,passwork & click on login -1"], "isController": false}, {"data": [1.0, 500, 1500, "4-3-Enter usename,passwork & click on login -0"], "isController": false}, {"data": [1.0, 500, 1500, "3-3-Enter Usernname and password"], "isController": true}, {"data": [1.0, 500, 1500, "4-8-Key in payment deatils and click continue"], "isController": true}, {"data": [1.0, 500, 1500, "2-1-Open URL"], "isController": false}, {"data": [1.0, 500, 1500, "3-4-Click on category"], "isController": true}, {"data": [1.0, 500, 1500, "Click on sign out-1"], "isController": false}, {"data": [1.0, 500, 1500, "Scenario-3 Add to Cart"], "isController": true}, {"data": [1.0, 500, 1500, "1 Open URL"], "isController": false}, {"data": [1.0, 500, 1500, "3-7-Click on signout"], "isController": true}, {"data": [1.0, 500, 1500, "Click on sign out"], "isController": false}, {"data": [1.0, 500, 1500, "4-1-Open URL"], "isController": false}, {"data": [1.0, 500, 1500, "Click on add to cart"], "isController": false}, {"data": [1.0, 500, 1500, "4-10-Click on sign out-0"], "isController": false}, {"data": [1.0, 500, 1500, "3-2-Click on sign in"], "isController": true}, {"data": [1.0, 500, 1500, "4-5-Click on product id"], "isController": true}, {"data": [1.0, 500, 1500, "4-10-Click on sign out-1"], "isController": false}, {"data": [1.0, 500, 1500, "Scenario-2 View Details"], "isController": true}, {"data": [1.0, 500, 1500, "4-4-Click on cateogory"], "isController": true}, {"data": [1.0, 500, 1500, "2-2- click on categoryId"], "isController": false}, {"data": [1.0, 500, 1500, "Scenario-4 Check out"], "isController": true}, {"data": [1.0, 500, 1500, "4-9-Click on confirm"], "isController": true}, {"data": [1.0, 500, 1500, "3-3-Enter Usernname and password-0"], "isController": false}, {"data": [1.0, 500, 1500, "3-6-Click on add to cart"], "isController": true}, {"data": [1.0, 500, 1500, "3-3-Enter Usernname and password-1"], "isController": false}, {"data": [1.0, 500, 1500, "4-3-Enter usename,passwork & click on login "], "isController": true}, {"data": [1.0, 500, 1500, "4-7-Click on proceed to check out"], "isController": true}, {"data": [1.0, 500, 1500, "3-5-Click on product id"], "isController": true}, {"data": [1.0, 500, 1500, "1 Search Product"], "isController": false}]}, function(index, item){
        switch(index){
            case 0:
                item = item.toFixed(3);
                break;
            case 1:
            case 2:
                item = formatDuration(item);
                break;
        }
        return item;
    }, [[0, 0]], 3);

    // Create statistics table
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 31, 0, 0.0, 16.161290322580648, 3, 54, 15.0, 25.400000000000002, 54.0, 54.0, 1.127723816799447, 4.57420183982684, 1.1442432086470953], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["2-3-click on productId", 1, 0, 0.0, 20.0, 20, 20, 20.0, 20.0, 20.0, 20.0, 50.0, 194.482421875, 42.96875], "isController": false}, {"data": ["2-4-click on itemId", 1, 0, 0.0, 18.0, 18, 18, 18.0, 18.0, 18.0, 18.0, 55.55555555555555, 196.94010416666669, 47.41753472222223], "isController": false}, {"data": ["Click on product id", 1, 0, 0.0, 12.0, 12, 12, 12.0, 12.0, 12.0, 12.0, 83.33333333333333, 391.5201822916667, 71.61458333333333], "isController": false}, {"data": ["4-10-Click on sign out", 2, 0, 0.0, 15.0, 15, 15, 15.0, 15.0, 15.0, 15.0, 0.6576783952647156, 3.279400279513318, 1.0860685218678068], "isController": true}, {"data": ["4-6-Click on add to cart", 2, 0, 0.0, 20.0, 20, 20, 20.0, 20.0, 20.0, 20.0, 0.6464124111182935, 2.957463033290239, 0.5574044521654816], "isController": true}, {"data": ["Click on sign out-0", 1, 0, 0.0, 4.0, 4, 4, 4.0, 4.0, 4.0, 4.0, 250.0, 46.630859375, 209.9609375], "isController": false}, {"data": ["4-2-Click on sign in", 2, 0, 0.0, 5.0, 5, 5, 5.0, 5.0, 5.0, 5.0, 0.6451612903225806, 2.4722782258064515, 0.5229334677419355], "isController": true}, {"data": ["Scenario-1 Search", 1, 0, 0.0, 75.0, 75, 75, 75.0, 75.0, 75.0, 75.0, 13.333333333333334, 123.29427083333334, 24.869791666666668], "isController": true}, {"data": ["3-1-Open URL", 2, 0, 0.0, 8.0, 8, 8, 8.0, 8.0, 8.0, 8.0, 0.6455777921239509, 3.4870027033570046, 0.4684221675274371], "isController": true}, {"data": ["4-3-Enter usename,passwork & click on login -1", 1, 0, 0.0, 7.0, 7, 7, 7.0, 7.0, 7.0, 7.0, 142.85714285714286, 699.0792410714286, 131.69642857142856], "isController": false}, {"data": ["4-3-Enter usename,passwork & click on login -0", 1, 0, 0.0, 6.0, 6, 6, 6.0, 6.0, 6.0, 6.0, 166.66666666666666, 31.087239583333332, 196.12630208333334], "isController": false}, {"data": ["3-3-Enter Usernname and password", 2, 0, 0.0, 23.0, 23, 23, 23.0, 23.0, 23.0, 23.0, 0.6581112207963146, 3.3432564165844028, 1.381133802237578], "isController": true}, {"data": ["4-8-Key in payment deatils and click continue", 2, 0, 0.0, 15.0, 15, 15, 15.0, 15.0, 15.0, 15.0, 0.6583278472679394, 2.898185483870968, 0.9598471445029625], "isController": true}, {"data": ["2-1-Open URL", 1, 0, 0.0, 54.0, 54, 54, 54.0, 54.0, 54.0, 54.0, 18.51851851851852, 100.02531828703704, 13.43677662037037], "isController": false}, {"data": ["3-4-Click on category", 2, 0, 0.0, 14.0, 14, 14, 14.0, 14.0, 14.0, 14.0, 0.6622516556291391, 2.7395488410596025, 0.5484271523178808], "isController": true}, {"data": ["Click on sign out-1", 1, 0, 0.0, 13.0, 13, 13, 13.0, 13.0, 13.0, 13.0, 76.92307692307693, 369.21574519230774, 63.92728365384615], "isController": false}, {"data": ["Scenario-3 Add to Cart", 1, 0, 0.0, 108.0, 108, 108, 108.0, 108.0, 108.0, 108.0, 9.25925925925926, 302.90617766203707, 72.66348379629629], "isController": true}, {"data": ["1 Open URL", 1, 0, 0.0, 54.0, 54, 54, 54.0, 54.0, 54.0, 54.0, 18.51851851851852, 100.02531828703704, 13.43677662037037], "isController": false}, {"data": ["3-7-Click on signout", 1, 0, 0.0, 17.0, 17, 17, 17.0, 17.0, 17.0, 17.0, 58.8235294117647, 293.313419117647, 98.28814338235293], "isController": true}, {"data": ["Click on sign out", 1, 0, 0.0, 17.0, 17, 17, 17.0, 17.0, 17.0, 17.0, 58.8235294117647, 293.313419117647, 98.28814338235293], "isController": false}, {"data": ["4-1-Open URL", 1, 0, 0.0, 6.0, 6, 6, 6.0, 6.0, 6.0, 6.0, 166.66666666666666, 900.2278645833334, 120.93098958333333], "isController": false}, {"data": ["Click on add to cart", 1, 0, 0.0, 20.0, 20, 20, 20.0, 20.0, 20.0, 20.0, 50.0, 228.955078125, 42.724609375], "isController": false}, {"data": ["4-10-Click on sign out-0", 1, 0, 0.0, 3.0, 3, 3, 3.0, 3.0, 3.0, 3.0, 333.3333333333333, 62.174479166666664, 276.6927083333333], "isController": false}, {"data": ["3-2-Click on sign in", 2, 0, 0.0, 14.0, 14, 14, 14.0, 14.0, 14.0, 14.0, 133.33333333333334, 510.9375, 108.07291666666667], "isController": true}, {"data": ["4-5-Click on product id", 2, 0, 0.0, 21.0, 21, 21, 21.0, 21.0, 21.0, 21.0, 0.6587615283267457, 2.6646389163372857, 0.5661231884057971], "isController": true}, {"data": ["4-10-Click on sign out-1", 1, 0, 0.0, 11.0, 11, 11, 11.0, 11.0, 11.0, 11.0, 90.9090909090909, 436.3458806818182, 74.66264204545455], "isController": false}, {"data": ["Scenario-2 View Details", 1, 0, 0.0, 107.0, 107, 107, 107.0, 107.0, 107.0, 107.0, 9.345794392523365, 157.28132301401868, 30.52898656542056], "isController": true}, {"data": ["4-4-Click on cateogory", 2, 0, 0.0, 7.0, 7, 7, 7.0, 7.0, 7.0, 7.0, 250.0, 1034.1796875, 207.03125], "isController": true}, {"data": ["2-2- click on categoryId", 1, 0, 0.0, 15.0, 15, 15, 15.0, 15.0, 15.0, 15.0, 66.66666666666667, 266.2109375, 55.208333333333336], "isController": false}, {"data": ["Scenario-4 Check out", 1, 0, 0.0, 145.0, 145, 145, 145.0, 145.0, 145.0, 145.0, 6.896551724137931, 322.87850215517244, 75.55226293103449], "isController": true}, {"data": ["4-9-Click on confirm", 2, 0, 0.0, 26.0, 26, 26, 26.0, 26.0, 26.0, 26.0, 0.6565988181221273, 3.3464738591595538, 0.5379750082074852], "isController": true}, {"data": ["3-3-Enter Usernname and password-0", 1, 0, 0.0, 6.0, 6, 6, 6.0, 6.0, 6.0, 6.0, 166.66666666666666, 31.087239583333332, 196.12630208333334], "isController": false}, {"data": ["3-6-Click on add to cart", 1, 0, 0.0, 20.0, 20, 20, 20.0, 20.0, 20.0, 20.0, 50.0, 228.955078125, 42.724609375], "isController": true}, {"data": ["3-3-Enter Usernname and password-1", 1, 0, 0.0, 16.0, 16, 16, 16.0, 16.0, 16.0, 16.0, 62.5, 305.84716796875, 57.6171875], "isController": false}, {"data": ["4-3-Enter usename,passwork & click on login ", 2, 0, 0.0, 13.0, 13, 13, 13.0, 13.0, 13.0, 13.0, 0.6506180871828238, 3.3051907124268056, 1.3654084661678596], "isController": true}, {"data": ["4-7-Click on proceed to check out", 2, 0, 0.0, 17.0, 17, 17, 17.0, 17.0, 17.0, 17.0, 0.6506180871828238, 3.4233693884189984, 0.5476882726089786], "isController": true}, {"data": ["3-5-Click on product id", 1, 0, 0.0, 12.0, 12, 12, 12.0, 12.0, 12.0, 12.0, 83.33333333333333, 391.5201822916667, 71.61458333333333], "isController": true}, {"data": ["1 Search Product", 1, 0, 0.0, 21.0, 21, 21, 21.0, 21.0, 21.0, 21.0, 47.61904761904761, 183.12872023809524, 54.26897321428571], "isController": false}]}, function(index, item){
        switch(index){
            // Errors pct
            case 3:
                item = item.toFixed(2) + '%';
                break;
            // Mean
            case 4:
            // Mean
            case 7:
            // Median
            case 8:
            // Percentile 1
            case 9:
            // Percentile 2
            case 10:
            // Percentile 3
            case 11:
            // Throughput
            case 12:
            // Kbytes/s
            case 13:
            // Sent Kbytes/s
                item = item.toFixed(2);
                break;
        }
        return item;
    }, [[0, 0]], 0, summaryTableHeader);

    // Create error table
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": []}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 31, 0, "", "", "", "", "", "", "", "", "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
