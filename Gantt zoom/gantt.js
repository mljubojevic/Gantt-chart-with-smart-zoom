

$(document).ready(function(){
    $('#file_input').on('change', function(e){
        readFile(this.files[0], function(e) {
            const text = e.target.result;
            var data = csvToArray(text);
            var brand = [];
            var inner_data_start = [];
            var inner_data_finish = [];
            var inner_data_y = [];
            var inner_data = [];

            for (let i=0; i<data.length-1; i++){
                brand [i]= data[i]['Brand']
            }
            var unique_brand = brand.filter(onlyUnique)
            
            for (let i=0; i<data.length-1; i++){
                inner_data_start [i]= data[i]['Start']
                const arrayOfStrings = inner_data_start[i].split('/')
                inner_data_start[i] = Date.UTC(arrayOfStrings[2], arrayOfStrings[0], arrayOfStrings[1])
                
            }
            for (let i=0; i<data.length-1; i++){
                inner_data_finish [i]= data[i]['Finish']
                const arrayOfStrings = inner_data_finish[i].split('/')
                inner_data_finish[i] = Date.UTC(arrayOfStrings[2], arrayOfStrings[0], arrayOfStrings[1])

            }

            for (let i=0; i<data.length-1; i++){
                inner_data_y [i]= unique_brand.indexOf(brand[i]);
            }
            
            var T = document.getElementById("GanttDiv");
            T.style.display = "block";

            
            for (let i=0; i<data.length-1; i++){
                inner_data.push({start: inner_data_start[i],
                                end: inner_data_finish[i],
                                y: inner_data_y[i]})
            }

            var today = new Date(),
            
            day = 1000 * 60 * 60 * 24,
            each = Highcharts.each,
            reduce = Highcharts.reduce,
            btnShowDialog = document.getElementById('btnShowDialog'),
            btnRemoveTask = document.getElementById('btnRemoveSelected'),
            btnAddTask = document.getElementById('btnAddTask'),
            btnCancelAddTask = document.getElementById('btnCancelAddTask'),
            addTaskDialog = document.getElementById('addTaskDialog'),
            inputName = document.getElementById('inputName'),
            selectDepartment = document.getElementById('selectDepartment'),
            selectDependency = document.getElementById('selectDependency'),
            chkMilestone = document.getElementById('chkMilestone'),
            isAddingTask = false;

            // Set to 00:00:00:000 today
            today.setUTCHours(0);
            today.setUTCMinutes(0);
            today.setUTCSeconds(0);
            today.setUTCMilliseconds(0);
            today = today.getTime();


            // Update disabled status of the remove button, depending on whether or not we
            // have any selected points.
            function updateRemoveButtonStatus() {
                var chart = this.series.chart;
                // Run in a timeout to allow the select to update
                setTimeout(function () {
                    btnRemoveTask.disabled = !chart.getSelectedPoints().length ||
                        isAddingTask;
                }, 10);
            }

            function openNewChart(){
                var image_button = document.getElementById("btnImg");
                image_button.style.display = "block";
              
                var chart = this.series.chart;
                var points = chart.getSelectedPoints();
                //console.log(points[0].yCategory)

                var data2 = [{Brand: 'Balenciaga International',
                    Vehicle: 'M Le Magazine du Monde',
                    Cost: [11220]},

                    {Brand: 'Balenciaga International',
                    Vehicle: 'Frieze',
                    Cost: [5100]},
                    
                    {Brand: 'Balenciaga International',
                    Vehicle: 'New York Times',
                    Cost: [5763]},

                    {Brand: 'Balenciaga International',
                    Vehicle: 'Flash Art',
                    Cost: [9066]},

                    {Brand: 'Balenciaga International',
                    Vehicle: 'Art News',
                    Cost: [13005]},

                    {Brand: 'Balenciaga International',
                    Vehicle: 'Art in America',
                    Cost: [7650]},

                    {Brand: 'Brioni International',
                    Vehicle: 'How To Spend It',
                    Cost: [11886]},

                    {Brand: 'Brioni International',
                    Vehicle: 'Frieze',
                    Cost: [5967]},

                    {Brand: 'Brioni International',
                    Vehicle: 'T Magazine Inter',
                    Cost: [8883]},

                ]                    

                var data_new_chart = [];
                var new_chart_categories = [];
                var new_chart_cost = [];
                
                for (let i=0, k=0; i<data2.length; i++){
                    if(data2[i]['Brand'] === points[0].yCategory){
                        data_new_chart[k] = data2[i]
                        k++;
                    }
                }
                console.log(data_new_chart)

                var new_chart_series = data_new_chart.map(function(item){
                return {name: item.Vehicle, data: item.Cost};
                });

                for (let i=0; i<data_new_chart.length; i++){
                    new_chart_categories[i] = data_new_chart[i]['Vehicle']
                    new_chart_cost[i] = data_new_chart[i]['Cost']
                }

                console.log(new_chart_series)
                console.log(new_chart_categories)


                // Create the chart
                Highcharts.chart('container2', {
                chart: {
                    type: 'column'
                },
                title: {
                    text: data_new_chart[0]['Brand']
                },
                xAxis: {
                    categories: ['Vehicle'],
                    crosshair: true
                },
                yAxis: {
                    min: 0,
                    title: {
                        text: 'Total cost'
                    }
                },
                tooltip: {
                    headerFormat: '<span style="font-size:10px">{point.key}</span><table>',
                    pointFormat: '<tr><td style="color:{series.color};padding:0">{series.name}: </td>' +
                        '<td style="padding:0"><b>{point.y:.1f} </b></td></tr>',
                    footerFormat: '</table>',
                    shared: true,
                    useHTML: true
                },
                plotOptions: {
                    column: {
                        pointPadding: 0.2,
                        borderWidth: 0
                    }
                },


                series: JSON.parse(JSON.stringify(new_chart_series))
            });

    }



            // Create the chart
            var chart = Highcharts.ganttChart('container', {

                chart: {
                    spacingLeft: 1
                },

                title: {
                    text: 'Interactive Gantt Chart'
                },

                subtitle: {
                    text: 'Drag and drop points to edit'
                },

                plotOptions: {
                    series: {
                        animation: false, // Do not animate dependency connectors
                        dragDrop: {
                            draggableX: true,
                            draggableY: true,
                            dragMinY: 0,
                            dragMaxY: unique_brand.length-1,
                            dragPrecisionX: day / 3 // Snap to eight hours
                        },
                        dataLabels: {
                            enabled: true,
                            format: '{point.name}',
                            style: {
                                cursor: 'default',
                                pointerEvents: 'none'
                            }
                        },
                        allowPointSelect: true,
                        point: {
                            events: {
                                select: openNewChart,
                                unselect: updateRemoveButtonStatus,
                                remove: updateRemoveButtonStatus
                            }
                        }
                    }
                },

                yAxis: {
                    type: 'category',
                    categories: unique_brand,
                    min: 0,
                    max: unique_brand.length-1
                },

                xAxis: {
                    currentDateIndicator: true
                },

                tooltip: {
                    xDateFormat: '%a %b %d, %H:%M'
                },

                series: [{
                    name: 'Project 1',
                    data: JSON.parse(JSON.stringify(inner_data))
                }]

            });


            /* Add button handlers for add/remove tasks */

            btnRemoveTask.onclick = function () {
                var points = chart.getSelectedPoints();
                each(points, function (point) {
                    point.remove();
                });
            };

            btnShowDialog.onclick = function () {
                // Update dependency list
                var depInnerHTML = '<option value=""></option>';
                each(chart.series[0].points, function (point) {
                    depInnerHTML += '<option value="' + point.id + '">' + point.name +
                        ' </option>';
                });
                selectDependency.innerHTML = depInnerHTML;

                // Show dialog by removing "hidden" class
                addTaskDialog.className = 'overlay';
                isAddingTask = true;

                // Focus name field
                inputName.value = '';
                inputName.focus();
            };

            btnAddTask.onclick = function () {
                // Get values from dialog
                var series = chart.series[0],
                    name = inputName.value,
                    undef,
                    dependency = chart.get(
                        selectDependency.options[selectDependency.selectedIndex].value
                    ),
                    y = parseInt(
                        selectDepartment.options[selectDepartment.selectedIndex].value,
                        10
                    ),
                    maxEnd = reduce(series.points, function (acc, point) {
                        return point.y === y && point.end ? Math.max(acc, point.end) : acc;
                    }, 0),
                    milestone = chkMilestone.checked || undef;

                // Empty category
                if (maxEnd === 0) {
                    maxEnd = today;
                }

                // Add the point
                series.addPoint({
                    start: maxEnd + (milestone ? day : 0),
                    end: milestone ? undef : maxEnd + day,
                    y: y,
                    name: name,
                    dependency: dependency ? dependency.id : undef,
                    milestone: milestone
                });

                // Hide dialog
                addTaskDialog.className += ' hidden';
                isAddingTask = false;
            };

            btnCancelAddTask.onclick = function () {
                // Hide dialog
                addTaskDialog.className += ' hidden';
                isAddingTask = false;
            };

                    });
                    
                });
                });
                    
                function readFile(file, callback){
                    var reader = new FileReader();
                    reader.onload = callback
                    reader.readAsText(file);
                }

                function csvToArray(str, delimiter = ",") {
                const headers = str.slice(0, str.indexOf("\n")).split(delimiter);
                const rows = str.slice(str.indexOf("\n") + 1).split("\n");
                const arr = rows.map(function (row) {
                    const values = row.split(delimiter);
                    const el = headers.reduce(function (object, header, index) {
                    object[header] = values[index];
                    return object;
                    }, {});
                    return el;
                });
                return arr;
                }

                function onlyUnique(value, index, self) {
                return self.indexOf(value) === index;
                }

