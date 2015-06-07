var barplot_generator = function(parsedDataset) {
  
  var margin = {top: 10, right: 30, bottom: 30, left: 30},
      width = 500 - margin.left - margin.right,
      height = 500 - margin.top - margin.bottom;

  var detail = d3.select("#barplot_svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")")
        .attr("id", "detailGroup")
        .attr("width", width)
        .attr("height", height);

  var init = function() {
    // d3.csv(pumsDataset, function(d) {
    //   return {
    //     puma: +d.PUMA10,
    //     netBest: +d.netBest
    //   };
    // }, function(error, rows) {
    //   parsedDataset = rows;
    // });

  };

  var update = function(updateObject) {
    //console.log(pumaClicked);

    d3.selectAll(".bar").remove();
    d3.selectAll("#bar-x-axis").remove();
    
    //document.getElementById("menu").style.visibility="visible"; 

    // A formatter for counts.
    var formatCount = d3.format(",.0f");

    //Filter the data based on which PUMA was clicked
    var rowsFiltered = parsedDataset.filter(function(d){ return d.puma == parseInt(updateObject.properties.puma); });

    var values = [];
    var i = 0;
    for (i = 0; i < rowsFiltered.length; i++) {
      values.push(rowsFiltered[i].netBest);
    }

    var domain = d3.extent(values);
    domain[0] = 1000 * Math.floor(domain[0]/1000);
    domain[1] = 1000 * Math.ceil(domain[1]/1000);

    var x = d3.scale.linear()
      .domain(domain)
      .range([0, width]);

    // Generate a histogram using uniformly-spaced bins.
    var data = d3.layout.histogram()
        .bins(x.ticks(80))
        (values);


    var y = d3.scale.linear()
        .domain([0, d3.max(data, function(d) { 
          return d.y; 
        })])
        .range([height, 0]);

    var xAxis = d3.svg.axis()
        .scale(x)
        .orient("bottom");

    var detail = d3.select("#detailGroup");

    var bar = detail.selectAll(".bar")
        .data(data)
        .enter().append("g")
        .attr("class", "bar")
        .attr("transform", function(d) { return "translate(" + x(d.x) + "," + y(d.y) + ")"; });

    //console.log(d3.extent(values) + " " + data[0].dx + " " + x(data[0].dx));

    bar.append("rect")
        .attr("x", 1)
        .attr("width", 4)//x(data[0].dx) - 1)
        .attr("height", function(d) { 
          return height - y(d.y); 
        });

    detail.append("g")
        .attr("class", "x axis")
        .attr("id", "bar-x-axis")
        .attr("transform", "translate(0," + height + ")")
        .call(xAxis);
  };

  return {
      init: init,
      update: update
  };
};