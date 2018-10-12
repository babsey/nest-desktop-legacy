import { Component, OnInit, Input } from '@angular/core';

import * as d3 from 'd3';

@Component({
  selector: 'app-sketch',
  templateUrl: './sketch.component.html',
  styleUrls: ['./sketch.component.css']
})
export class SketchComponent implements OnInit {
  private color: any;

  constructor() {
    this.color = "red";
  }

  ngOnInit() {
    var self = this;
    console.log(self.color)

    d3.namespaces.custom = "https://d3js.org/namespace/custom";

    var width = 960,
        height = 800;

    // Add our "custom" sketch element to the body.
    var sketch = d3.select("app-sketch").append("custom:sketch")
        .attr("width", window.innerWidth)
        .attr("height", window.innerHeight)
        .call(custom);

    // On each mouse move, create a circle that increases in size and fades away.
    d3.select(window).on("mousemove", function() {
      sketch.append("custom:circle")
          .attr("x", d3.event.clientX)
          .attr("y", d3.event.clientY)
          .attr("radius", 0)
          .attr("strokeStyle", self.color)
        .transition()
          .duration(20000)
          .ease(Math.sqrt)
          .attr("radius", 2000)
          .attr("strokeStyle", "white")
          .remove();
    });

    function custom(selection) {
      selection.each(function() {
        var root = this,
            canvas = root.parentNode.appendChild(document.createElement("canvas")),
            context = canvas.getContext("2d");

        canvas.style.position = "fixed";
        canvas.style.top = root.offsetTop + "px";
        canvas.style.left = root.offsetLeft + "px";


        // It'd be nice to use DOM Mutation Events here instead.
        // However, they appear to arrive irregularly, causing choppy animation.
        d3.timer(redraw);

        // Clear the canvas and then iterate over child elements.
        function redraw() {
          canvas.width = root.getAttribute("width");
          canvas.height = root.getAttribute("height");
          for (var child = root.firstChild; child; child = child.nextSibling) draw(child);
        }

        // For now we only support circles with strokeStyle.
        // But you should imagine extending this to arbitrary shapes and groups!
        function draw(element) {
          switch (element.tagName) {
            case "circle": {
              context.strokeStyle = element.getAttribute("strokeStyle");
              context.beginPath();
              context.arc(element.getAttribute("x"), element.getAttribute("y"), element.getAttribute("radius"), 0, 2 * Math.PI);
              context.stroke();
              break;
            }
          }
        }
      });
    };

  }
}
