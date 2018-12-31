import { Component, OnInit } from '@angular/core';
import * as d3 from 'd3';
import * as topojson from 'topojson';

@Component({
  selector: 'app-worldmap',
  templateUrl: './worldmap.component.html',
  styleUrls: ['./worldmap.component.scss']
})
export class WorldmapComponent implements OnInit {

  marginTop = 120;
  marginRight = 20;
  marginBottom = 20;
  marginLeft = 110;

  width = 750 - this.marginRight - this.marginLeft;
  height = 300 - this.marginTop - this.marginBottom;

  data: any;

  constructor() { }

  ngOnInit() {

    //this.getData();
    this.plotWorldMap();
    //this.highlightCountry("","black");

  }

  getData() {
    var that = this;
    d3.csv('./assets/data/data.csv', function (response: any) {

      that.data = response.map(function (item: any) {
        var newItem = {} as any;
        newItem.country = item.x;
        newItem.product = item.y;
        newItem.value = item.value;
        return newItem;
      });
     // that.loadGraph(that.data);
    });
  }

  loadGraph(data: any) {
    console.log("plotting heatmap");
    var that = this;

    var itemSize = 22;
    var cellSize = itemSize - 1;

    var marginTop = 120;
    var marginRight = 20;
    var marginBottom = 20;
    var marginLeft = 110;

    //var width = 750 - marginRight - marginLeft;
    //var height = 300 - marginTop - marginBottom;

    var x_elements = d3.set(data.map(function (item: any) { return item.product; })).values(),
      y_elements = d3.set(data.map(function (item: any) { return item.country; })).values();

    console.log("x_elements" + x_elements);
    console.log("y_elements" + y_elements);

    var xScale = d3.scale.ordinal()
      .domain(x_elements)
      .rangeBands([0, x_elements.length * itemSize]);

    var xAxis = d3.svg.axis()
      .scale(xScale)
      .tickFormat(function (d) {
        return d;
      })
      .orient("top");

    var yScale = d3.scale.ordinal()
      .domain(y_elements)
      .rangeBands([0, y_elements.length * itemSize]);

    var yAxis = d3.svg.axis()
      .scale(yScale)
      .tickFormat(function (d) {
        return d;
      })
      .orient("left");

    var colorScale = d3.scale.threshold()
      .domain([0.85, 1])
      .range(["#2980B9", "#E67E22", "#27AE60", "#27AE60"]);

    var svg = d3.select('.heatmap')
      .append("svg")
      //.attr("width", width + marginLeft + marginRight)
      .attr("width", 1000)
      //.attr("height", height + marginTop + marginBottom)
      .attr("height", 1000)
      .append("g")
      .attr("transform", "translate(" + marginLeft + "," + marginTop + ")");

    var cells = svg.selectAll('rect')
      .data(data)
      .enter().append('g').append('rect')
      .attr('class', 'cell')
      .attr('width', cellSize)
      .attr('height', cellSize)
      .attr('y', function (d: any) { return yScale(d.country); })
      .attr('x', function (d: any) { return xScale(d.product); })
      .attr('fill', function (d: any): any { return colorScale(d.value); })
      .on("mouseover", handleMouseOver)
      .on("mouseout", handleMouseOut);

    svg.append("g")
      .attr("class", "y axis")
      .call(yAxis)
      .selectAll('text')
      .attr('font-weight', 'normal');

    svg.append("g")
      .attr("class", "x axis")
      .call(xAxis)
      .selectAll('text')
      .attr('font-weight', 'normal')
      .style("text-anchor", "start")
      .attr("dx", ".8em")
      .attr("dy", ".5em")
      .attr("transform", function (d: any) {
        return "rotate(-65)";
      });

    function handleMouseOver(d: any, i: any) {
      console.log("country:" + d.country
        + " ,product:" + d.product
        + " ,colour:" + colorScale(d.value));

      ///////////////////////highlight country///////////////////////

      d3.selectAll(".worldmap").remove();
      d3.selectAll("#worldmap").remove();
      that.highlightCountry(d.country, colorScale(d.value));
    }

    function handleMouseOut(d: any, i: any) {
      console.log("handleMouseOut");
      d3.selectAll("#worldmap").remove();
      that.highlightCountry("", "black");

    }

  }

  // plotWorldMap() {
  //   console.log("Plotting world map");

  //   var mapsvg = d3.select('.worldmap').append("svg")
  //     .attr("height", 1000 )
  //     .attr("width", 1000 );

  //   var projection = d3.geo.mercator()
  //     .scale(this.width / 4 / Math.PI)
  //     .scale(100)
  //     .translate([this.width / 2, this.height / 2])

  //   var path = d3.geo.path()
  //     .projection(projection);

  //   var url = "https://raw.githubusercontent.com/johan/world.geo.json/master/countries.geo.json";
  //   d3.json(url, function (err, geojson) {
  //     console.log(geojson);

  //     var featuresArray = geojson.features;

  //     console.log(featuresArray);

  //     mapsvg.append("path")
  //       .attr("d", path(geojson));
  //   })
  // }

  plotWorldMap(){

      var mapsvg = d3.select("body").append("svg")
      .attr("height", 10000 )
      .attr("width",  960);

    var projection = d3.geo.equirectangular()
    .scale(153)
    .translate([this.width / 2, this.height / 2])
    .precision(.1);

    var path = d3.geo.path()
    .projection(projection);

    var graticule = d3.geo.graticule();

    var g = mapsvg.append("g");

    g.append("path")
  .datum(graticule)
  .attr("class", "graticule")
  .attr("d", path);

  d3.json("https://gist.githubusercontent.com/mbostock/4090846/raw/d534aba169207548a8a3d670c9c2cc719ff05c47/world-50m.json", function(error, world){
  if (error){
    console.log(error);
  };
  g.insert("path", ".graticule")
      .datum(topojson.feature(world, world.objects.land))
      .attr("fill", "black")
      .attr("d", path);

      g.insert("path", ".graticule")
      .datum(topojson.mesh(world, world.objects.countries, function(a, b) { return a !== b; }))
      .attr("stroke", "aqua")
      .attr("d", path);

      var countries :any = topojson.feature(world, world.objects.countries);

      var data : any;

  countries.features.forEach(function(element:any) {
    if(element.id == 356){
      data = path.centroid(element);
    }
  });

  var objectData = {
    x: data[0],
    y: data[1]
  }

  g.selectAll(".centroid").data([objectData])
    .enter().append("circle")
      .attr("class", "centroid")
      .attr("fill", "rgba(255, 49, 255, 0.388)")
      .attr("stroke", "rgba(0, 0, 0, 0.5)")
      .attr("stroke-width", 0.1)
      .attr("r", 6)
      .attr("cx", function (d){ console.log(d.x); return d.x; })
      .attr("cy", function (d){ console.log(d.y); return d.y; });
      
 } )

  }

  highlightCountry(country: any, color:any) {
    console.log("highlight country:-" + country)
    var mapsvg = d3.select('.heatmap').append("svg")
    .attr("id", "worldmap")
      .attr("height", 4000)
      .attr("width", 4000);

    var projection = d3.geo.mercator()
      .scale(this.width / 3 / Math.PI)
      .scale(100)
      .translate([this.width / 2, this.height / 2])

    var path = d3.geo.path()
      .projection(projection);

    var url = "http://enjalot.github.io/wwsd/data/world/world-110m.geojson";
    //var url = "https://raw.githubusercontent.com/johan/world.geo.json/master/countries.geo.json";
    //var url = "https://unpkg.com/world-atlas@1/world/110m.json";
    d3.json(url, function (err, geojson) {
      console.log(geojson);

      var featuresArray = geojson.features;

      console.log(featuresArray);

      featuresArray.forEach(function (element: any) {
        if (element.properties.name == country) {
          console.log(element);
          country = element;
        }
      });

      mapsvg.append("path")
        .attr("d", path(geojson));

      if(country != "" ||country != null){
        mapsvg.append("path")
        .attr("fill", color)
        .attr("d", path(country));
      }

      
    });
  }
}
