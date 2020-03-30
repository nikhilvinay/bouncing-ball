import {
  Component,
  AfterContentInit,
  OnChanges,
  OnInit,
  OnDestroy
} from '@angular/core';
import * as d3 from 'd3';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements AfterContentInit {
  cx = -2;
  cy = -2;
  vx = 2;
  vy = 5;
  radius = 6;
  gravity = 0.2;
  damping = 0.85;
  traction = 0.8;
  paused = false;
  rect: any;
  ball: any;
  width = 400;
  height = 300;
  xCordinates = [];
  yCordinates = [];
  xyCordFinalData = [];
  svg: any;
  graphXAxis: any;
  graphYAxis: any;
  ngAfterContentInit() {
    this.rect = d3
      .select('svg')
      .insert('rect')
      .attr('x', 0)
      .attr('y', 0)
      .attr('width', this.width)
      .attr('height', this.height)
      .attr('fill', 'black');

    this.ball = d3
      .select('svg')
      .insert('circle')
      .attr('cx', this.cx)
      .attr('cy', this.cy)
      .attr('r', this.radius)
      .attr('fill', 'blue');

    this.xyCordFinalData.push({x: this.cx, y: this.cy});
    this.drawTheGraph();
  }

  onStartClick() {
    let intervalId = setInterval(() => {
      if (this.cx <= 393) {
        this.drawBall();
        this.xyCordFinalData.push({x: this.cx, y: this.cy});
        console.log({x: this.cx, y: this.cy});
        this.svg
        .append('g')
        .selectAll('dot')
        .data(this.xyCordFinalData)
        .enter()
        .append('circle')
        .attr('cx', (d) => this.graphXAxis( d.x))
        .attr('cy', (d) => this.graphYAxis( this.height - d.y))
        .attr('r', 5)
        .attr('fill', '#69b3a2');
      }
    }, 60);
  }

  drawBall() {
    this.ball.attr('cx', this.moveX()).attr('cy', this.moveY());
  }

  moveX() {
    if (this.cx + this.radius >= this.width) {
      this.vx = -this.vx * this.damping;
      this.cx = this.width - this.radius;
    } else if (this.cx - this.radius <= 0) {
      this.vx = -this.vx * this.damping;
      this.cx = this.radius;
    }
    this.cx +=  this.vx;
    this.xCordinates.push(this.cx);
    return this.cx;
  }

  moveY() {
    if (this.cy + this.radius >= this.height) {
      this.vy = -this.vy * this.damping;
      this.cy = this.height - this.radius;
      this.vx *= this.traction;
    } else if (this.cy - this.radius <= 0) {
      this.vy = -this.vy * this.damping;
      this.cy = this.radius;
    }
    this.vy += this.gravity;
    this.cy += this.vy;
    this.yCordinates.push(this.cy);
    return this.cy;
  }

  drawTheGraph() {
    const margin = { top: 20, right: 20, bottom: 40, left: 60 },
      width = 460 - margin.left - margin.right,
      height = 400 - margin.top - margin.bottom;

    // create svg element, respecting margins
    this.svg = d3
      .select('#my_dataviz')
      .append('svg')
      .attr('width', width + margin.left + margin.right + 100)
      .attr('height', height + margin.top + margin.bottom + 100)
      .append('g')
      .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');
    // Add X axis
    this.graphXAxis = d3
      .scaleLinear()
      .domain([0, 500])
      .range([0, this.width]);

    this.svg
      .append('g')
      .attr('transform', 'translate(0,' + height + ')')
      .call(d3.axisBottom(this.graphXAxis));

    // Add Y axis
    this.graphYAxis = d3
      .scaleLinear()
      .domain([0, 500])
      .range([height, 0]);
    this.svg.append('g').call(d3.axisLeft(this.graphYAxis));

    // Add X axis label:
    this.svg
      .append('text')
      .attr('text-anchor', 'end')
      .attr('x', width)
      .attr('y', height + margin.top + 20)
      .text('X cordinate');

    // Y axis label:
    this.svg
      .append('text')
      .attr('text-anchor', 'end')
      .attr('transform', 'rotate(-90)')
      .attr('y', -margin.left + 20)
      .attr('x', -margin.top)
      .text('Y cordinate');
  }
}
