// Create a scatter plot between two of the data variables such as Healthcare vs. Poverty or Smokers vs. Age
// Include state abbreviations in the circles.
// Create and situate your axes and labels to the left and bottom of the chart.

// Review connection
// console.log('Connection Successful');

// Automatically resizes the chart
function makeResponsive() {

// If the SVG area isn't empty when the browser loads, remove it and replace it with a resized version of the chart
let svgArea = d3.select('body').select('svg');

// Clear svg is not empty
if (!svgArea.empty()) {
    svgArea.remove();
}

// Setup screen chart width and height
let svgWidth = window.innerWidth;
let svgHeight = window.innerHeight;

// Define margins to establish limits
let margin = {
    top: 20,
    right: 40,
    bottom: 50,
    left: 50
  };

// Dimensions for chart
let width = svgWidth - margin.left - margin.right;
let height = svgHeight - margin.top - margin.bottom;

//Create an SVG wrapper, append an SVG group that will hold our chart, and shift the latter by left and top margins.
let svg = d3
  .select('#scatter')
  .append('svg')
  .classed('chart',true)
  .attr('width', svgWidth)
  .attr('height', svgHeight);

let chartGroup = svg.append('g')
  .attr('transform', `translate(${margin.left}, ${margin.top})`);

// Import data from the data.csv file
// Columns: id,state,abbr,poverty,povertyMoe,age,ageMoe,income,incomeMoe,healthcare,healthcareLow,healthcareHigh,obesity,obesityLow,obesityHigh,smokes,smokesLow and smokesHigh.
d3.csv('assets/data/data.csv').then(function(journalismData) {

    // Format selected data for analysis Healthcare vs Poverty as integer
    journalismData.forEach(d => {
        d.poverty = +d.poverty;
        d.healthcare = +d.healthcare;
      });

        // Review imported data
// console.log(journalismData);

// Create scale functions
// Linear Scale for poverty
let xLinearScale = d3.scaleLinear()
    .domain(d3.extent(journalismData, d => d.poverty))
    .range([0, width]);

// Linear Scale for Healthcare    
let yLinearScale = d3.scaleLinear()
    .domain(d3.extent(journalismData, d => d.healthcare))
    .range([height, 0]);

// Create axis functions
let xAxis = d3.axisBottom(xLinearScale);
let yAxis = d3.axisLeft(yLinearScale);

// Append axes to the chart
chartGroup.append('g')
      .attr('transform', `translate(0, ${height})`)
      .call(xAxis);

chartGroup.append('g')
      .call(yAxis);

// Create circles
let circlesGroup = chartGroup.selectAll('circle')
        .data(journalismData)
        .enter()
        .append('circle')
        .attr('cx', d => xLinearScale(d.poverty))
        .attr('cy', d => yLinearScale(d.healthcare))
        .attr('r', '15')
        .attr('fill', '#89bdd3')
        .attr('stroke-width', '2')
        .attr('stroke', '#e3e3e3');      
// console.log(circlesGroup);

// Create text in data circles
let textGroup = chartGroup.selectAll('text')
      .exit()
      .data(journalismData)
      .enter()
      .append('text')
      .text(d => d.abbr)
      .attr('x', d => xLinearScale(d.poverty))
      .attr('y', d => yLinearScale(d.healthcare))
      .attr('text-anchor','middle')
      .attr('font-family', 'sans-serif')
      .attr('font-size', '12px')
      .attr('fill', '#fff');

// Create axes labels
chartGroup.append('text')
  .attr('transform', 'rotate(-90)')
  .attr('y', 0 - margin.left)
  .attr('x', 0 - (height / 2))
  .attr('dy', '1em')
  .attr('class', 'axisText')
  .attr('font-family', 'sans-serif')
  .attr('font-size', '16px')
  .style('stroke','black')
  .text('Lacks Healthcare (%)');

chartGroup.append('text')
  .attr('transform', `translate(${width / 2}, ${height + margin.top + 15})`)
  .attr('class', 'axisText')
  .attr('font-family', 'sans-serif')
  .attr('font-size', '16px')
  .style('stroke','black')
  .text('In Poverty (%)');

// Initialize tooltip
let toolTip = d3.tip()
        .attr('class', 'tooltip')
        .offset([80, -60])
        .html(function(d) {
          return (`Poverty: ${d.poverty} <br> Healthcare ${d.healthcare}`);
        });

// Create tooltip in the chart
chartGroup.call(toolTip);

// Create event listeners to display and hide the tooltip
circlesGroup.on('mouseover', function(d) { 
    toolTip.show(d, this);
})

.on('mouseout', function(d,i) { 
    toolTip.hide(d);
})

}).catch(function(error) {
    console.log(error);
});
}
// When the browser loads, makeResponsive() is called.
makeResponsive();

// When the browser window is resized, makeResponsive() is called.
d3.select(window).on('resize', makeResponsive);
