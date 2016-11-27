  
  google.charts.load("current", {packages:["corechart"]});
    google.charts.setOnLoadCallback(drawChart);
    function drawChart(dataObj) {
      var data = google.visualization.arrayToDataTable([
        ['Task', 'Hours per Day'],
        ['Потери',     dataObj.user_data],
        [dataObj.label,      100 - dataObj.user_data]
      ]);

      dataObj.options.pieSliceTextStyle = {color: "#fff", fontName: "Arial", fontSize: "16"};
      dataObj.options.titleTextStyle = { 
        color: "#000",
        fontName: 'Arial',
        fontSize: '20',
        bold: true 
      };

      var chart = new google.visualization.PieChart(document.getElementById(dataObj.id));
      chart.draw(data, dataObj.options);
    }

  $('.draw_chart').click(function () {
     drawChart({
      options: {
        title: 'Потери реактивной мощности',
        is3D: true,
        legend: 'none',
        pieSliceText: 'label',
        slices: {
          0: { color: '#dc3912' },
          1: { color: '#ff9900' }
        }
      },
      user_data: dQLost[5],
      id: 'dQ_piechart_3d',
      label: "Мощность"
     });

     drawChart({
      options: {
        title: 'Потери активной мощности',
        is3D: true,
        legend: 'none',
        pieSliceText: 'label',
        slices: {
          0: { color: '#dc3912' },
          1: { color: '#3366cc' }
        }
      },
      user_data: dPLost[5],
      id: 'dP_piechart_3d',
      label: "Мощность"
     });

     drawChart({
      options: {
        title: 'Потери электроэнергии',
        is3D: true,
        legend: 'none',
        pieSliceText: 'label',
        slices: {
          0: { color: '#dc3912' },
          1: { color: '#109618' }
        }
      },
      user_data: dWLost[5],
      id: 'dW_piechart_3d',
      label: "Энергия"
     });

  });  