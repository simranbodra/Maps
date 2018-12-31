import { Component, OnInit } from '@angular/core';
import * as d3 from 'd3';
import * as topojson from 'topojson';

@Component({
  selector: 'app-world',
  templateUrl: './world.component.html',
  styleUrls: ['./world.component.scss']
})
export class WorldComponent implements OnInit {

  data: any;
  svg: any;
  CountryCodes: any[][] = [["France", 250], ["Italy", 380], ["Germany", 276], ["United Kingdom", 826], ["Spain", 724]];

  constructor() { }

  ngOnInit() {
    this.svg = d3.select(".map").append("svg")
      .attr("width", 1960)
      .attr("height", 800);
    this.getData();
    this.plotWorldMap(0, "");

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

      that.plotHeatMap(that.data);
    });
  }

  plotHeatMap(data: any) {
    var that = this;
    var itemSize = 22;
    var cellSize = itemSize - 1;

    var x_elements = d3.set(data.map(function (item: any) { return item.product; })).values(),
      y_elements = d3.set(data.map(function (item: any) { return item.country; })).values();

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

    var heatmapsvg = this.svg.append("svg")
      .attr("class", "heatmap")
      .attr("width", 1000)
      .attr("height", 800);

    var colorScale = d3.scale.threshold()
      .domain([0.85, 1])
      .range(["#2980B9", "#E67E22", "#27AE60", "#27AE60"]);

    heatmapsvg.append("g")
      .call(xAxis)
      .selectAll('text')
      .attr('font-weight', 'normal')
      .style("text-anchor", "start")
      .attr("transform", "translate(" + 120 + "," + 600 + ") rotate(" + -65 + ")");

    heatmapsvg.append("g")
      .call(yAxis)
      .selectAll('text')
      .attr('font-weight', 'normal')
      .attr("transform", "translate(" + 120 + "," + 600 + ")");
    
    heatmapsvg.selectAll('rect')
      .data(data)
      .enter().append('g').append('rect')
      .attr('class', 'cell')
      .attr('width', cellSize)
      .attr('height', cellSize)
      .attr('y', function (d: any) { return yScale(d.country) + 600; })
      .attr('x', function (d: any) { return xScale(d.product) + 120; })
      .attr('fill', function (d: any): any { return colorScale(d.value); })
      .attr('font-weight', 'normal')
      .on("mouseover", handleMouseOver)
      .on("mouseout", handleMouseOut);

    function handleMouseOver(d: any, i: any) {
      console.log("country:" + d.country
        + " ,product:" + d.product
        + " ,colour:" + colorScale(d.value));

        // heatmapsvg.append("g")
        // .select("rect").data(d)
        // .enter().select("rect")
        // .attr("width", cellSize +10)
        // .attr("height", cellSize +10)
        // .attr("fill", "red")
        // .attr("x", function (d: any) { return 0 })
        // .attr("y", function (d: any) { return 0 })
        // .attr("transform", "translate(" + 120 + "," + 600 + ")");

        heatmapsvg.append("g").append("rect").attr("class","recttool")
        .attr('width', cellSize+165)
        .attr('height', cellSize+3)
        .attr("fill","rgba(0, 128, 0, 0.7)")
        .attr("x",xScale(d.product)+ 110)
        .attr("y",yScale(d.country)+ 570)
        ;
        heatmapsvg
        .append("g").append("text")
        .attr("class","valuetext")
        .text(function(){return "Value:"+d.value})
        .attr("x",xScale(d.product) + 110)
        .attr("y",yScale(d.country) + 590)
        ; 
    // heatmapsvg.append("div")
    //     .style("position", "absolute")
    //     .style("z-index", "10")
    //     .style("visibility", "hidden")
    //     .text("a simple tooltip");
      ///////////////////////highlight country///////////////////////

      var selectedCountry: any;

      that.CountryCodes.forEach(function (element: any) {
        if (element[0] === d.country) {
          console.log("Code" + element[1]);
          selectedCountry = element[1];
        }
      });

      d3.selectAll(".worldmap").remove();
      console.log("value" + colorScale(d.value))
      var currentColor = colorScale(d.value);
      that.plotWorldMap(selectedCountry, currentColor);
    }

    function handleMouseOut(d: any, i: any) {
      console.log("handleMouseOut");
      d3.selectAll(".worldmap").remove();
      d3.selectAll(".recttool").remove();
      d3.selectAll(".valuetext").remove();
      that.plotWorldMap(0, "");
    }
  }


  plotWorldMap(code: any, color: any) {
    var width = 960,
      height = 480,
      radius = 10,
      //fill = "rgba(255, 49, 255, 0.388)",
      stroke = "rgba(0, 0, 0, 0.5)",
      strokeWidth = 0.1;

    var projection = d3.geo.equirectangular()
      .scale(153)
      .translate([width / 2, height / 2])
      .precision(.1);

    var path = d3.geo.path()
      .projection(projection);

    var graticule = d3.geo.graticule();

    var worldmapsvg = this.svg.append("svg")
      .attr("class", "worldmap")
      .attr("width", 1000)
      .attr("height", 700);

    var g = worldmapsvg.append("g");

    g.append("path")
      .datum(graticule)
      .attr("class", "graticule")
      .attr("d", path);

    d3.json("https://gist.githubusercontent.com/mbostock/4090846/raw/d534aba169207548a8a3d670c9c2cc719ff05c47/world-50m.json", function (error, world) {
      if (error) throw error;
      g.insert("path", ".graticule")
        .datum(topojson.feature(world, world.objects.land))
        .attr("fill", "black")
        .attr("d", path);

      g.insert("path", ".graticule")
        .datum(topojson.mesh(world, world.objects.countries, function (a, b) { return a !== b; }))
        .attr("stroke", "aqua")
        .attr("d", path);

      if (code != 0) {
        var countries: any = topojson.feature(world, world.objects.countries);

        var countryData: any;

        countries.features.forEach(function (element: any) {
          if (element.id == code) {
            countryData = path.centroid(element);
          }
        });

        var pointObject = {
          x: countryData[0],
          y: countryData[1]
        }

        g.selectAll(".centroid").data([pointObject])
          .enter().append("circle")
          .attr("class", "centroid")
          .attr("fill", color)
          .attr("stroke", color)
          .attr("stroke-width", strokeWidth)
          .attr("r", radius)
          .attr("cx", function (d: any) { console.log(d.x); return d.x; })
          .attr("cy", function (d: any) { console.log(d.y); return d.y; });
      }

    });

  }



}
