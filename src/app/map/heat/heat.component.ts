
import { Component, OnInit} from '@angular/core';
import * as d3 from 'd3';


@Component({
  selector: 'app-heat',
  templateUrl: './heat.component.html',
  styleUrls: ['./heat.component.scss']
})
export class HeatComponent implements OnInit {
 x_elements:any;
 
 datas:any;
  ngOnInit() {
   
    this.loadData();
}

loadData()
{
   var that = this;
   d3.csv('./assets/data/data.csv', function ( response:any ) {
    that.datas = response.map(function( item:any ) {
    var newItem = {} as any;
          newItem.country = item.x;
          newItem.product = item.y;
          newItem.value = item.value;
          return newItem;
      });
      that.x_elements=d3.set(that.datas.map(function( item:any) { return item.product; } )).values();
      that.loadGraph(that.datas);
    });      
}
loadGraph(datas:any){
    var that= this;
    var itemSize = 30,
    cellSize = itemSize - 1,
    margin = {top: 120, right:20, bottom: 70, left: 150};
    var width = 1000 - margin.right - margin.left,
    height = 300 - margin.top ;
    var y_elements = d3.set(datas.map(function( item:any ) { return item.country; } )).values();
    var xScale = d3.scale.ordinal()
      .domain(that.x_elements)
      .rangeBands([0, that.x_elements.length * itemSize]);

  var xAxis = d3.svg.axis()
      .scale(xScale)
      .tickFormat(function (d) {
          return d;
      })
      .orient("top");

  var yScale = d3.scale.ordinal()
      .domain(y_elements)
      .rangeBands([0, y_elements.length * itemSize]);

    var yAxis=d3.svg.axis()
      .scale(yScale)
      .tickFormat(function (d) {
          return d;
      })
      .orient("left");
      

  var colorScale = d3.scale.quantize()
      .domain([0,4])
      .range(["#ecfb07", "#7efb07","#0cbf33", "#239c75" ]);
  d3.selectAll("svg").remove();   
  var svg = d3.select('.heatmap')
      .append("svg")
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
      .append("g")
      .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

// var div = d3.select("body").append("div")	
//       .attr("class", "tooltip")				
//       .style("opacity", 0);
svg.append("rect")
.attr("class","yellowbox")
.attr('width', cellSize)
.attr('height', cellSize)
.style("fill","#ecfb07")
.attr("transform", "translate(0,200)");
svg.append("g").append("text").text("<1").attr("transform", "translate(32,222)");


svg.append("rect")
.attr("class","greenbox")
.attr('width', cellSize)
.attr('height', cellSize)
.style("fill","#7efb07")
.attr("transform", "translate(100,200)");
svg.append("g").append("text").text("1<2").attr("transform", "translate(132,222)");


svg.append("rect")
.attr("class","dgreenbox")
.attr('width', cellSize)
.attr('height', cellSize)
.style("fill","#0cbf33")
.attr("transform", "translate(200,200)");
svg.append("g").append("text").text("2<3").attr("transform", "translate(232,222)");


svg.append("rect")
.attr("class","bamboogreen")
.attr('width', cellSize)
.attr('height', cellSize)
.style("fill","#239c75")
.attr("transform", "translate(300,200)");
svg.append("g").append("text").text(">3").attr("transform", "translate(332,222)");

svg.selectAll('rect')
      .data(datas)
      .enter().append('g').append('rect')
      .attr('class', 'cell')
    //   .attr('width', cellSize)
    //   .attr('height', cellSize)
    //   .attr('y', function(d:any) { return yScale(d.country); })
    //   .attr('x', function(d:any) { return xScale(d.product); })
      .style("fill", "white")
      .on("mouseover",onMouseHover)
      .on("mouseout",handleMouseOut);     
    svg.selectAll(".cell")
.attr('width', cellSize)
.attr('height', cellSize)
.attr('y', function(d:any) { return yScale(d.country); })
.attr('x', function(d:any) { return xScale(d.product); }).transition().duration(700).ease("linear")
.style("fill", function(d:any):any { return colorScale(d.value); })
    
      function onMouseHover(d:any) {  
        d3.selectAll("svg").append("g").append("rect").attr("class","recttool")
        .attr('width', cellSize+165)
        .attr('height', cellSize+3)
        .attr("fill","rgba(0, 128, 0, 0.7)")
        .attr("x",xScale(d.product)+95)
        .attr("y",yScale(d.country)+95)
        ;
        d3.selectAll("svg")
        .append("g").append("text")
        .attr("class","valuetext")
        .text(function(){return "Value:"+d.value})
        .attr("x",xScale(d.product)+103)
        .attr("y",yScale(d.country)+115)
        ;
        		
      }
      function handleMouseOut() {  
        d3.selectAll(".recttool").remove();
        d3.selectAll(".valuetext").remove();
       
      }   
function onMouseClick(d:any){
  datas.sort(function (a: any, b: any) {
      if(a.country==b.country && b.country==d)
      {
        return (+a.value) - (+b.value);  
      }   
    })
that.x_elements=[] as any;
var k=0;
 for(var i=0;i<datas.length;i++)
 {
     if(datas[i].country==d)
     {
         console.log(datas.product);
         that.x_elements[k]=datas[i].product;
         k++;
     }
 }

 
 console.log(that.x_elements); 
 datas.map(function(x:any){console.log(x)});
 
 that.loadGraph(datas);
}

svg.append("g")
      .attr("class", "y_axis").transition().duration(1)
      .call(yAxis).selectAll('text')
      .attr('font-weight', 'normal');
d3.selectAll(".tick text").on("click",onMouseClick);     

svg.append("g")
      .attr("class", "x_axis").transition().duration(500).ease("quad")
      .call(xAxis)
      .selectAll('text')
      .attr('font-weight', 'normal')
      .style("text-anchor", "start")
      .attr("dx", ".8em")
      .attr("dy", ".5em")
      .attr("transform", function (d) {
          return "rotate(-60)";
      });

   

  }

}
