import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatSliderModule } from '@angular/material/slider';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import * as d3 from 'd3';

@Component({
  selector: 'app-id5',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatSliderModule,
    MatCardModule,
    MatButtonModule
  ],
  templateUrl: './id5.html',
  styleUrls: ['./id5.css']
})
export class Id5 implements OnInit {
  // LBG Parameters
  numPoints = 50;
  numCentroids = 4;
  
  // Data & State
  points: {x: number, y: number}[] = [];
  centroids: {x: number, y: number}[] = [];
  clusters: {x: number, y: number}[][] = [];
  
  @ViewChild('chart', { static: true }) chartContainer!: ElementRef;
  private svg: any;
  private width = 600;
  private height = 400;
  private xScale: any;
  private yScale: any;

  ngOnInit() {
    this.initChart();
    this.generateData();
  }

  initChart() {
    this.svg = d3.select(this.chartContainer.nativeElement)
      .append('svg')
      .attr('width', this.width)
      .attr('height', this.height)
      .style('background', '#f9f9f9')
      .style('border-radius', '4px');

    this.xScale = d3.scaleLinear().domain([0, 100]).range([20, this.width - 20]);
    this.yScale = d3.scaleLinear().domain([0, 100]).range([this.height - 20, 20]);
  }

  generateData() {
    // Generate random 2D points
    this.points = Array.from({ length: this.numPoints }, () => ({
      x: Math.random() * 100,
      y: Math.random() * 100
    }));
    
    // Reset centroids logic (Simple random initialization for demo)
    this.centroids = Array.from({ length: this.numCentroids }, () => ({
      x: Math.random() * 100,
      y: Math.random() * 100
    }));

    this.updateChart();
  }

  runLbgStep() {
    // 1. Assign points to nearest centroid
    this.clusters = Array.from({ length: this.numCentroids }, () => []);
    
    this.points.forEach(p => {
      let minDist = Infinity;
      let clusterIndex = 0;
      
      this.centroids.forEach((c, i) => {
        const dist = Math.sqrt((p.x - c.x) ** 2 + (p.y - c.y) ** 2);
        if (dist < minDist) {
          minDist = dist;
          clusterIndex = i;
        }
      });
      this.clusters[clusterIndex].push(p);
    });

    // 2. Update centroids
    this.centroids = this.clusters.map((cluster, i) => {
      if (cluster.length === 0) return this.centroids[i]; // Keep old if empty
      const sumX = d3.sum(cluster, d => d.x);
      const sumY = d3.sum(cluster, d => d.y);
      return { x: sumX / cluster.length, y: sumY / cluster.length };
    });

    this.updateChart();
  }

  updateChart() {
    this.svg.selectAll('*').remove(); // Clear canvas

    
    // Draw Links (optional visual: line from point to centroid)
    this.clusters.forEach((cluster, i) => {
      const centroid = this.centroids[i];
      this.svg.selectAll(`.link-${i}`)
        .data(cluster)
        .enter()
        .append('line')
        .attr('x1', (d: any) => this.xScale(d.x))
        .attr('y1', (d: any) => this.yScale(d.y))
        .attr('x2', this.xScale(centroid.x))
        .attr('y2', this.yScale(centroid.y))
        .attr('stroke', d3.schemeCategory10[i % 10])
        .attr('stroke-width', 1)
        .attr('opacity', 0.3);
    });

    // Draw Points
    this.svg.selectAll('circle.point')
      .data(this.points)
      .enter()
      .append('circle')
      .attr('cx', (d: any) => this.xScale(d.x))
      .attr('cy', (d: any) => this.yScale(d.y))
      .attr('r', 4)
      .attr('fill', '#555');

    // Draw Centroids
    this.svg.selectAll('circle.centroid')
      .data(this.centroids)
      .enter()
      .append('circle')
      .attr('cx', (d: any) => this.xScale(d.x))
      .attr('cy', (d: any) => this.yScale(d.y))
      .attr('r', 8)
      .attr('fill', (d: any, i: number) => d3.schemeCategory10[i % 10])
      .attr('stroke', '#000')
      .attr('stroke-width', 2);
  }
}