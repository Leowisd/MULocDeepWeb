/* -------------------------------------------------------------------------- */
/*                                Show js File                                */
/*								Author: Yifu Yao							  */
/*							Last Updated Date: 6/14/2020 					  */
/* -------------------------------------------------------------------------- */

$(function () {
    $('[data-toggle="popover"]').popover()
})

// ++++++++++++++++++++++++++++++++++
// ++++++++++++++++++++++++++++++++++
// Analysis MULocDeep results' data
// ++++++++++++++++++++++++++++++++++
// ++++++++++++++++++++++++++++++++++

// var weights = JSON.parse('<%- JSON.stringify(weights) %>');
// // console.log(weights.length);
// var names = JSON.parse('<%- JSON.stringify(names) %>');
// // console.log(names);
// var seq = JSON.parse('<%- JSON.stringify(seq) %>');
// // console.log(seq.length);
// var cellular = JSON.parse('<%- JSON.stringify(cellular) %>');
// // console.log(cellular);
// var organellar = JSON.parse('<%- JSON.stringify(organellar) %>');
// // console.log(organellar);

// +++++++++++++++++++++++++++++++++++++
// +++++++++++++++++++++++++++++++++++++
// Create main results units
// +++++++++++++++++++++++++++++++++++++
// +++++++++++++++++++++++++++++++++++++

// ============================
// To show all results at first
// ============================
setTimeout("helper()",500);  
function helper(){
    $('.selectpicker').selectpicker('selectAll');
}

// ===========================
// Create elements dynamically
// ===========================
var mainContainer = document.querySelector('#mainContainer');
var sideNav = document.querySelector('.sidenav');
var navCopy = sideNav.innerHTML;
var chart = [];
var cellularChart = [];
var organellarChart = [];
$(".selectpicker").change(function () {
    var idList = $(".selectpicker").val();
    // console.log(idList);

    mainContainer.innerHTML = "";

    sideNav.innerHTML = navCopy;
    $('[data-toggle="popover"]').popover();

    for (var i = 0; i < idList.length; i++) {

        var id = idList[i];

        var container = document.createElement("container");
        mainContainer.appendChild(container);

        // ===========================
        // create a head for each query
        // click to show sequence
        // ===========================
        var queryHead = document.createElement("div");
        container.appendChild(queryHead);
        queryHead.classList.add("alert");
        queryHead.classList.add("text-center");
        queryHead.classList.add("alert-primary");
        queryHead.textContent = names[id] + " (click to show sequence)";
        queryHead.setAttribute("id", "query_header_" + id);
        queryHead.setAttribute("data-toggle", "popover");
        queryHead.setAttribute("data-placement", "top");
        queryHead.setAttribute("data-content", seq[id]);
        queryHead.onclick = function () {
            var cur = parseInt(this.id.substring(13));
            var tmp = document.getElementById("query_header_" + cur);
            if (tmp.textContent == names[cur] + " (click to show sequence)") {
                tmp.classList.remove("alert-primary");
                tmp.classList.add("alert-warning");
                tmp.textContent = names[cur] + " (click to unshow sequence)";
            }
            else {
                tmp.classList.remove("alert-warning");
                tmp.classList.add("alert-primary");
                tmp.textContent = names[cur] + " (click to show sequence)";
            }
        }


        // ==============================
        // Create cellular Collapse Components
        // ==============================
        var cellularCard = document.createElement("div");
        container.appendChild(cellularCard);
        cellularCard.classList.add("card");
        cellularCard.classList.add("mt-2");

        var cellularHeader = document.createElement("div");
        cellularCard.appendChild(cellularHeader);
        cellularHeader.classList.add("card-header");
        cellularHeader.setAttribute("id", "cellular_heading_" + id);

        var cellularHeaderH2 = document.createElement("h2");
        cellularHeader.appendChild(cellularHeaderH2);
        cellularHeaderH2.classList.add("mb-0");

        var cellularBtn = document.createElement("button");
        cellularHeaderH2.appendChild(cellularBtn);
        cellularBtn.classList.add("btn");
        cellularBtn.classList.add("btn-link");
        cellularBtn.setAttribute("data-toggle", "collapse");
        cellularBtn.setAttribute("data-target", "#cellular_" + id);
        cellularBtn.textContent = "Sub Cellular Prediction: " + cellular[id].Predict.replace(/_/g, ' ');;

        var cellularContent = document.createElement("div");
        cellularCard.appendChild(cellularContent);
        cellularContent.classList.add("collapse");
        cellularContent.setAttribute("id", "cellular_" + id);

        var cellularContentBody = document.createElement("div");
        cellularContent.appendChild(cellularContentBody);
        cellularContentBody.classList.add("card-body");
        cellularContentBody.setAttribute("id", "cellular_content_" + id);

        var cellularChartContainer = document.createElement("div");
        cellularContentBody.appendChild(cellularChartContainer);
        cellularChartContainer.setAttribute("id", "cellularChartContainer_" + id);
        cellularChartContainer.classList.add("chart_container");

        var cellularCChartData = [];
        for (var key in cellular[id]) {
            let temp = {
                label: key.replace(/_/g, ' '),
                y: cellular[id][key]
            }
            if (temp.label != 'seqName' && temp.label != 'Predict')
                cellularCChartData.push(temp);
        }

        CanvasJS.addColorSet("cellularColorSet",
        [
        "#0099ff","#ffff00","#ff6600","#00cc66","#ff6699","#ffcc66","#003399","#009999","#cccc00","#003300"
        ]);

        cellularChart[id] = new CanvasJS.Chart("cellularChartContainer_" + id, {
            animationEnabled: true,
            theme: "light2",
            colorSet: "cellularColorSet",
            zoomEnabled: true,
            exportEnabled: true,
            data: [{
                type: "column",
                showInLegend: true, 
		        legendMarkerColor: "grey",
		        legendText: "Sub Cellular",
                dataPoints: cellularCChartData
            }]
        });
        // // -------------
        // // create a list
        // // -------------
        // var cellularListContainer = document.createElement("div");
        // cellularContentBody.appendChild(cellularListContainer);
        // cellularListContainer.classList.add("table-responsive-sm");

        // var cellularList = document.createElement("table");
        // cellularListContainer.appendChild(cellularList);
        // cellularList.classList.add("table");
        // cellularList.classList.add("table-hover");
        // cellularList.setAttribute("id", "cellular_table_" + id);

        // var cellularListthead = document.createElement("thead");
        // cellularList.appendChild(cellularListthead);

        // var cellularListtheadtr = document.createElement("tr");
        // cellularListthead.appendChild(cellularListtheadtr);

        // var cellularListtheadth0 = document.createElement("th");
        // cellularListtheadtr.appendChild(cellularListtheadth0);
        // cellularListtheadth0.setAttribute("scope", "col");
        // cellularListtheadth0.textContent = "#";
        // var cellularListtheadth1 = document.createElement("th");
        // cellularListtheadtr.appendChild(cellularListtheadth1);
        // cellularListtheadth1.setAttribute("scope", "col");
        // cellularListtheadth1.textContent = "Name";
        // var cellularListtheadth2 = document.createElement("th");
        // cellularListtheadtr.appendChild(cellularListtheadth2);
        // cellularListtheadth2.setAttribute("scope", "col");
        // cellularListtheadth2.textContent = "Value";

        // var cellularListtbody = document.createElement("tbody");
        // cellularList.appendChild(cellularListtbody);
        // let idx = 1;
        // for (var key in cellular[id]) {
        //     let attrName = key;
        //     let attrValue = cellular[id][key];
        //     if (attrName == "seqName" || attrName == "Predict") continue;

        //     let tr = document.createElement("tr");
        //     cellularListtbody.appendChild(tr);
        //     let th = document.createElement("th");
        //     tr.appendChild(th);
        //     th.setAttribute("scope", "row");
        //     th.textContent = idx++;
        //     let td1 = document.createElement("td");
        //     tr.appendChild(td1);
        //     td1.textContent = attrName;
        //     let td2 = document.createElement("td");
        //     tr.appendChild(td2);
        //     td2.textContent = attrValue;
        // }

        // $("#cellular_table_" + id).DataTable({
        //     "paging":   false,
        //     "info":     false,
        //     "searching": false,
        //     "order": [[2, "desc"]]
        // });

        // // ===============================
        // // Create organellar Collapse Components
        // // ===============================

        var organellarCard = document.createElement("div");
        container.appendChild(organellarCard);
        organellarCard.classList.add("card");

        var organellarHeader = document.createElement("div");
        organellarCard.appendChild(organellarHeader);
        organellarHeader.classList.add("card-header");
        organellarHeader.setAttribute("id", "organellar_heading_" + id);

        var organellarHeaderH2 = document.createElement("h2");
        organellarHeader.appendChild(organellarHeaderH2);
        organellarHeaderH2.classList.add("mb-0");

        var organellarBtn = document.createElement("button");
        organellarHeaderH2.appendChild(organellarBtn);
        organellarBtn.classList.add("btn");
        organellarBtn.classList.add("btn-link");
        organellarBtn.setAttribute("data-toggle", "collapse");
        organellarBtn.setAttribute("data-target", "#organellar_" + id);
        organellarBtn.textContent = "Sub Organellar Prediction: " + organellar[id].Prediction.replace(/_/g, ' ');

        var organellarContent = document.createElement("div");
        organellarCard.appendChild(organellarContent);
        organellarContent.classList.add("collapse");
        organellarContent.setAttribute("id", "organellar_" + id);

        var organellarContentBody = document.createElement("div");
        organellarContent.appendChild(organellarContentBody);
        organellarContentBody.classList.add("card-body");
        organellarContentBody.setAttribute("id", "organellar_content_" + id);

        var organellarChartContainer = document.createElement("div");
        organellarContentBody.appendChild(organellarChartContainer);
        organellarChartContainer.setAttribute("id", "organellarChartContainer_" + id);
        organellarChartContainer.classList.add("chart_container");

        var organellarChartData = [];
        for (var key in organellar[id]) {
            let temp = {
                label: key.replace(/_/g, ' '),
                y: organellar[id][key]
            }
            if (temp.label != 'Prediction')
                organellarChartData.push(temp);
        }
        
        CanvasJS.addColorSet("organellarColorSet",
        [
        "#0099ff","#0099ff","#0099ff","#0099ff","#0099ff","#0099ff","#0099ff","#0099ff","#ffff00","#ffff00","#ffff00","#ffff00","#ffff00","#ffff00","#ffff00","#ffff00",
        "#ff6600","#ff6600","#00cc66","#00cc66","#00cc66","#00cc66","#00cc66","#ff6699","#ff6699","#ff6699","#ff6699","#ff6699","#ff6699","#ffcc66","#ffcc66","#ffcc66",
        "#ffcc66","#ffcc66","#003399","#003399","#003399","#003399","#003399","#009999","#009999","#009999","#009999","#cccc00","#003300"
        ]);

        organellarChart[id] = new CanvasJS.Chart("organellarChartContainer_" + id, {
            animationEnabled: true,
            colorSet: "organellarColorSet",
            theme: "light2",
            zoomEnabled: true,
            exportEnabled: true,
            data: [{
                type: "column",
                showInLegend: true, 
		        legendMarkerColor: "grey",
		        legendText: "Sub Organellar",
                dataPoints: organellarChartData
            }]
        });
        // -------------
        // create a list
        // -------------
        // var organellarListContainer = document.createElement("div");
        // organellarContentBody.appendChild(organellarListContainer);
        // organellarListContainer.classList.add("table-responsive-sm");

        // var organellarList = document.createElement("table");
        // organellarListContainer.appendChild(organellarList);
        // organellarList.classList.add("table");
        // organellarList.classList.add("table-hover");
        // organellarList.setAttribute("id", "organellar_table_" + id);

        // var organellarListthead = document.createElement("thead");
        // organellarList.appendChild(organellarListthead);

        // var organellarListtheadtr = document.createElement("tr");
        // organellarListthead.appendChild(organellarListtheadtr);

        // var organellarListtheadth0 = document.createElement("th");
        // organellarListtheadtr.appendChild(organellarListtheadth0);
        // organellarListtheadth0.setAttribute("scope", "col");
        // organellarListtheadth0.textContent = "#";
        // var organellarListtheadth1 = document.createElement("th");
        // organellarListtheadtr.appendChild(organellarListtheadth1);
        // organellarListtheadth1.setAttribute("scope", "col");
        // organellarListtheadth1.textContent = "Name";
        // var organellarListtheadth2 = document.createElement("th");
        // organellarListtheadtr.appendChild(organellarListtheadth2);
        // organellarListtheadth2.setAttribute("scope", "col");
        // organellarListtheadth2.textContent = "Value";

        // var organellarListtbody = document.createElement("tbody");
        // organellarList.appendChild(organellarListtbody);
        // let idx2 = 1;
        // for (var key in organellar[id]) {
        //     let attrName = key;
        //     let attrValue = organellar[id][key];
        //     if (attrName == "Prediction") continue;

        //     let tr = document.createElement("tr");
        //     organellarListtbody.appendChild(tr);
        //     let th = document.createElement("th");
        //     tr.appendChild(th);
        //     th.setAttribute("scope", "row");
        //     th.textContent = idx2++;
        //     let td1 = document.createElement("td");
        //     tr.appendChild(td1);
        //     td1.textContent = attrName;
        //     let td2 = document.createElement("td");
        //     tr.appendChild(td2);
        //     td2.textContent = attrValue;
        // }

        // $("#organellar_table_" + id).DataTable({
        //     // "paging":   false,
        //     "info":     false,
        //     // "searching": false,
        //     "order": [[2, "desc"]]
        // });

        // // ===================================
        // // Create Weights Collapse Components
        // // ===================================
        var weightsCard = document.createElement("div");
        container.appendChild(weightsCard);
        weightsCard.classList.add("card");
        weightsCard.classList.add("mb-3");

        var weightsHeader = document.createElement("div");
        weightsCard.appendChild(weightsHeader);
        weightsHeader.classList.add("card-header");
        weightsHeader.setAttribute("id", "weights_heading_" + id);

        var weightsHeaderH2 = document.createElement("h2");
        weightsHeader.appendChild(weightsHeaderH2);
        weightsHeaderH2.classList.add("mb-0");

        var weightsBtn = document.createElement("button");
        weightsHeaderH2.appendChild(weightsBtn);
        weightsBtn.classList.add("btn");
        weightsBtn.classList.add("btn-link");
        weightsBtn.setAttribute("data-toggle", "collapse");
        weightsBtn.setAttribute("data-target", "#weights_" + id);
        weightsBtn.textContent = "Attention Weights Chart";

        var weightsContent = document.createElement("div");
        weightsCard.appendChild(weightsContent);
        weightsContent.classList.add("collapse");
        weightsContent.setAttribute("id", "weights_" + id);

        var weightsContentBody = document.createElement("div");
        weightsContent.appendChild(weightsContentBody);
        weightsContentBody.classList.add("card-body");
        weightsContentBody.setAttribute("id", "weights_content_" + id);

        var chartContainer = document.createElement("div");
        weightsContentBody.appendChild(chartContainer);
        chartContainer.setAttribute("id", "chartContainer_" + id);
        chartContainer.classList.add("chart_container");

        var chartData = [];
        for (var k = 0; k < seq[id].length; k++) {
            let temp = {
                label: (k + 1) + ':' + seq[id][k],
                y: weights[id][k]
            }
            chartData.push(temp);
        }

        chart[id] = new CanvasJS.Chart("chartContainer_" + id, {
            animationEnabled: true,
            theme: "light2",
            zoomEnabled: true,
            exportEnabled: true,
            axisX: {
            },
            axisY: {
                includeZero: false,
            },
            data: [{
                type: "line",
                indexLabelFontSize: 16,
                dataPoints: chartData
            }]
        });
    }
    // After the collapse expanded than render the chart, or the chart cannot get the size of the container.
    for (var i = 0; i < idList.length; i++) {
        let id = idList[i];
        $('#weights_' + id).on("shown.bs.collapse", function () {
            chart[id].render();
        });
        $('#cellular_' + id).on("shown.bs.collapse", function () {
            cellularChart[id].render();
        });
        $('#organellar_' + id).on("shown.bs.collapse", function () {
            organellarChart[id].render();
        });
    }

    $('[data-toggle="popover"]').popover(); // enable each popover

    // ++++++++++++++++++++++++++
    // ++++++++++++++++++++++++++
    // Update a list to side nav bar
    // ++++++++++++++++++++++++++
    // ++++++++++++++++++++++++++

    var listGroup = document.getElementById("barList");
    for (var i = 0; i < idList.length; i++) {
        var id = idList[i];

        var a = document.createElement("button");
        a.textContent = names[id];
        a.classList.add("list-group-item");
        a.classList.add("list-group-item-action");
        a.classList.add("list-group-item-primary");
        a.setAttribute("style", "font-size: 10px;");
        a.setAttribute("id", "goto" + id);
        a.onclick = function () {
            var cur = parseInt(this.id.substring(4));
            var element = document.querySelector("#query_header_" + cur);
            var actualTop = element.offsetTop;
            var current = element.offsetParent;
            while (current !== null) {
                actualTop += current.offsetTop;
                current = current.offsetParent;
            }
            window.scrollTo({
                top: actualTop - document.documentElement.clientHeight / 6,
                behavior: "smooth"
            });
        };
        listGroup.appendChild(a);
    }

    // display the side bar or not
    var inside = document.getElementById("barList").innerHTML;
    if (inside.length > 0) document.getElementById("sidebarBtn").style.display = "block";
    else {
        document.getElementById("sidebarBtn").style.display = "none";
        document.getElementById("mySidenav").style.width = '0';
    }
});

window.onscroll = function () { scrollFunction() };

function scrollFunction() {
    if (document.body.scrollTop > 20 || document.documentElement.scrollTop > 20) {
        document.getElementById("box").style.display = "block";
    } else {
        document.getElementById("box").style.display = "none";
    }
}

box.onclick = function () {
    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });
}

function toggleNav() {
    var width = document.getElementById("mySidenav").style.width;
    if (width == '15%') document.getElementById("mySidenav").style.width = '0';
    else document.getElementById("mySidenav").style.width = '15%';
}

function closeNav() {
    document.getElementById("mySidenav").style.width = "0";
}

function startIntro() {
    var intro = introJs();
    intro.setOptions({
        steps: [
            {
                element: document.querySelector('#downloadBtn'),
                intro: "Click it to download predicting results."
            },
            {
                element: document.querySelector('#picker'),
                intro: "You can select results which you wanna check in currrent job.",
            },
            {
                element: document.querySelector('#query_header_0'),
                intro: 'The name of current sequence. Click to display the detail of this sequence.',
            },
            {
                element: document.querySelector('#cellular_heading_0'),
                intro: "Click to show/hide the chart of sub-cellular prediction results. You can drag to zoom and click menu button to print/save the chart.",
            },
            {
                element: document.querySelector('#organellar_heading_0'),
                intro: 'Click to show/hide the chart of sub-organellar prediction results. You can drag to zoom and click menu button to print/save the chart.'
            },
            {
                element: document.querySelector('#weights_heading_0'),
                intro: 'Click to show/hide the chart of attention weights. You can drag to zoom and click menu button to print/save the chart.'
            },
            {
                intro: "Click the right bottom button(if appear) to scroll to the top of this page.",
            },
            {
                intro: "Click the left side button to show the side nav bar including selected results. You can click specific result to scroll to it.",
            }
        ]
    });

    intro.start();
}