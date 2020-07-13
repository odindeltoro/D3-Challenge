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
    bottom: 150,
    left: 150
  };

// Dimensions for chart
let width = svgWidth - margin.left - margin.right;
let height = svgHeight - margin.top - margin.bottom;

//Create an SVG wrapper, append an SVG group that will hold our chart, and shift the latter by left and top margins.
let svg = d3
  .select('#scatter')
  .append('svg')
  .attr('width', svgWidth)
  .attr('height', svgHeight);

let chartGroup = svg.append('g')
  .attr('transform', `translate(${margin.left}, ${margin.top})`);

// Initial params
let chosenXAxis = 'poverty';
let chosenYAxis = 'healthcare';

// Function used for updating x-scale var upon click on axis label
function xScale(journalismData, chosenXAxis) {
  // Create scales
  let xLinearScale = d3.scaleLinear()
    .domain([d3.min(journalismData, d => d[chosenXAxis]) * 0.8,
      d3.max(journalismData, d => d[chosenXAxis]) * 1.2
    ])
    .range([0, width]);

  return xLinearScale;

}

// Function used for updating y-scale var upon click on axis label
function yScale(journalismData, chosenYAxis) {
  // Create scales
  let yLinearScale = d3.scaleLinear()
    .domain([d3.min(journalismData, d => d[chosenYAxis]) * 0.8,
      d3.max(journalismData, d => d[chosenYAxis]) * 1.2
    ])
    .range([height,0]);

  return yLinearScale;

}

// Function used for updating xAxis var upon click on axis label
function renderXAxes(newXScale, xAxis) {
  let bottomAxis = d3.axisBottom(newXScale);

  xAxis.transition()
    .duration(1000)
    .call(bottomAxis);

  return xAxis;
}

// Function used for updating yAxis var upon click on axis label
function renderYAxes(newYScale, yAxis) {
  let leftAxis = d3.axisLeft(newYScale);

  yAxis.transition()
    .duration(1000)
    .call(leftAxis);

  return yAxis;
}

// Function used for updating circles group with a transition to new circles
function renderCircles(circlesGroup, newXScale, chosenXAxis, newYScale, chosenYAxis) {

  circlesGroup.transition()
    .duration(1000)
    .attr('cx', d => newXScale(d[chosenXAxis]))
    .attr('cy', d => newYScale(d[chosenYAxis]));

  return circlesGroup;
}

// Function used for updating state labels with a transition to new 
function renderText(textGroup, newXScale, chosenXAxis, newYScale, chosenYAxis) {

  textGroup.transition()
      .duration(1000)
      .attr('x', d => newXScale(d[chosenXAxis]))
      .attr('y', d => newYScale(d[chosenYAxis]))
      .attr('text-anchor', 'middle');

  return textGroup;
}

// Function used for updating circles group with new tooltip
function updateToolTip(chosenXAxis, chosenYAxis, circlesGroup, textGroup) {

// Choose xLabel to select
  if (chosenXAxis ==='poverty') {
    var xLabel = 'In Poverty (%):';
  }
  else if (chosenXAxis === 'age'){
    var xLabel = 'Age (Median):';
  }
  else {
    var xLabel = 'Household Income (Median):';
  }

// Choose yLabel to select
if (chosenYAxis ==='healthcare') {
  var yLabel = 'Lacks Healthcare (%):';
}
else if (chosenYAxis === 'smokes'){
  var yLabel = 'Smokes (%):';
}
else {
  var yLabel = 'Obese (%):';
}

// Initialize tooltip
  let toolTip = d3.tip()
    .attr('class', 'd3-tip')
    .html(function(d) {
      return (`<strong>${d.state}</strong><br>${xLabel} ${d[chosenXAxis]}<br>${yLabel} ${d[chosenYAxis]}`);
    });

// Create tooltip in the chart
  circlesGroup.call(toolTip);

// Create event listeners to display and hide the tooltip
  circlesGroup.on('mouseover', function(d) {
    toolTip.show(d,this);
  })
    // Create mouseout event
    .on('mouseout', function(d) {
      toolTip.hide(d);
    });

// Create text tooltip in the chart
  textGroup.call(toolTip);
  
// Create event listeners to display and hide the tooltip
  textGroup.on('mouseover', function(d) {
    toolTip.show(d, this);
  })
    // Create mouseout event
    .on('mouseout', function(d) {
      toolTip.hide(d);
    });

  return circlesGroup;
}

// Import data from the data.csv file
// Columns: id,state,abbr,poverty,povertyMoe,age,ageMoe,income,incomeMoe,healthcare,healthcareLow,healthcareHigh,obesity,obesityLow,obesityHigh,smokes,smokesLow and smokesHigh.
d3.csv('assets/data/data.csv').then(function(journalismData) {

    // Format selected data for analysis
    journalismData.forEach(d => {
        d.poverty = +d.poverty;
        d.healthcare = +d.healthcare;
        d.age = +d.age;
        d.smokes = +d.smokes;
        d.obesity = +d.obesity;
        d.income = +d.income;
      });

// Create scale functions
// Linear Scale for chosenXAxis
let xLinearScale = xScale(journalismData, chosenXAxis);

// Linear Scale for chosenYAxis  
let yLinearScale = yScale(journalismData, chosenYAxis);

// Create initial axis functions
let bottomAxis = d3.axisBottom(xLinearScale);
let leftAxis = d3.axisLeft(yLinearScale);

// Append axes to the chart
let xAxis = chartGroup.append('g')
      .classed('x-axis', true)
      .attr('transform', `translate(0, ${height})`)
      .call(bottomAxis);

let yAxis = chartGroup.append('g')
      .classed('y-axis', true)
      .call(leftAxis);

// Create initial circles
let circlesGroup = chartGroup.selectAll('.stateCircle')
        .data(journalismData)
        .enter()
        .append('circle')
        .attr('class','stateCircle')
        .attr('cx', d => xLinearScale(d[chosenXAxis]))
        .attr('cy', d => yLinearScale(d[chosenYAxis]))
        .attr('r', '15')
        .attr('fill', '#89bdd3')
        .attr('stroke-width', '2')
        .attr('stroke', '#e3e3e3');      

// Create initial text in data circles
let textGroup = chartGroup.selectAll('.stateText')
      // .exit()
      .data(journalismData)
      .enter()
      .append('text')
      .text(d => (d.abbr))
      .attr('class','stateText')
      .attr('x', d => xLinearScale(d[chosenXAxis]))
      .attr('y', d => yLinearScale(d[chosenYAxis]*.985))
      .attr('text-anchor','middle')
      .attr('font-family', 'sans-serif')
      .attr('font-size', '12px')
      .attr('fill', '#fff');

// Create x axes labels
let xLabelsGroup = chartGroup.append('g')
  .attr('transform', `translate(${width / 2}, ${height + margin.top + 15})`)
  .attr('font-family', 'sans-serif')
  .attr('font-size', '16px')
  .style('stroke','black');

let povertyLabel = xLabelsGroup.append('text')
    .classed('aText', true)
    .classed('active', true)
    .attr('x', 0)
    .attr('y', 20)
    .attr('value', 'poverty')
    .text('In Poverty (%)');

let ageLabel = xLabelsGroup.append('text')
    .classed('aText', true)
    .classed('inactive', true)
    .attr('x', 0)
    .attr('y', 40)
    .attr('value', 'age')
    .text('Age (Median)');      

let incomeLabel = xLabelsGroup.append('text')
    .classed('aText', true)
    .classed('inactive', true)
    .attr('x', 0)
    .attr('y', 60)
    .attr('value', 'income')
    .text('Household Income (Median)');  

// Create y axes labels      
let yLabelsGroup = chartGroup.append('g')
  .attr('transform',`translate(${0 - margin.left/4}, ${(height/2)})`)
  .attr('font-family', 'sans-serif')
  .attr('font-size', '16px')
  .style('stroke','black');

let healthcareLabel = yLabelsGroup.append('text')
    .classed('aText', true)
    .classed('active', true)
    .attr('dy', '1em')
    .attr('transform', 'rotate(-90)')
    .attr('x', 0)
    .attr('y', -20)
    .attr('value', 'healthcare')
    .text('Lacks Healthcare (%)');   
    
let smokesLabel = yLabelsGroup.append('text')
    .classed('aText', true)
    .classed('inactive', true)
    .attr('dy', '1em')
    .attr('transform', 'rotate(-90)')
    .attr('x', 0)
    .attr('y', -40)
    .attr('value', 'smokes')
    .text('Smokes (%)'); 

let obesityLabel = yLabelsGroup.append('text')
    .classed('aText', true)
    .classed('inactive', true)
    .attr('dy', '1em')
    .attr('transform', 'rotate(-90)')
    .attr('x', 0)
    .attr('y', -60)
    .attr('value', 'obesity')
    .text('Obese (%)'); 

// Update tooltip with data
circlesGroup = updateToolTip(chosenXAxis, chosenYAxis, circlesGroup, textGroup);

// Create event listeners for x axis labels
xLabelsGroup.selectAll('text')
    .on('click', function() {
      let value = d3.select(this).attr('value');
      if (value != chosenXAxis) {
        chosenXAxis = value;
        xLinearScale = xScale(journalismData, chosenXAxis);
        xAxis = renderXAxes(xLinearScale, xAxis);
        circlesGroup = renderCircles(circlesGroup, xLinearScale, chosenXAxis, yLinearScale, chosenYAxis);
        textGroup = renderText(textGroup, xLinearScale, chosenXAxis, yLinearScale, chosenYAxis);
        circlesGroup = updateToolTip(chosenXAxis, chosenYAxis, circlesGroup, textGroup);

// Selector for xAxis
        if (chosenXAxis === 'poverty') {
          povertyLabel.classed('active', true).classed('inactive', false);
          ageLabel.classed('active', false).classed('inactive', true);
          incomeLabel.classed('active', false).classed('inactive', true);
        }
        else if (chosenXAxis === 'age') {
          povertyLabel.classed('active', false).classed('inactive', true);
          ageLabel.classed('active', true).classed('inactive', false);
          incomeLabel.classed('active', false).classed('inactive', true); 
        }
        else {
          povertyLabel.classed('active', false).classed('inactive', true);
          ageLabel.classed('active', false).classed('inactive', true);
          incomeLabel.classed('active', true).classed('inactive', false); 
        }
      }
    });

// Create event listeners for y axis labels
yLabelsGroup.selectAll('text')
    .on('click', function() {
      let value = d3.select(this).attr('value');
      if (value != chosenYAxis) {
        chosenYAxis = value;
        yLinearScale = yScale(journalismData, chosenYAxis);
        yAxis = renderYAxes(yLinearScale, yAxis);
        circlesGroup = renderCircles(circlesGroup, xLinearScale, chosenXAxis, yLinearScale, chosenYAxis);
        textGroup = renderText(textGroup, xLinearScale, chosenXAxis, yLinearScale, chosenYAxis);
        circlesGroup = updateToolTip(chosenXAxis, chosenYAxis, circlesGroup, textGroup);

// Selector for yAxis
        if (chosenYAxis === 'healthcare') {
          healthcareLabel.classed('active', true).classed('inactive', false);
          smokesLabel.classed('active', false).classed('inactive', true);
          obesityLabel.classed('active', false).classed('inactive', true);
        }
        else if (chosenYAxis === 'smokes') {
          healthcareLabel.classed('active', false).classed('inactive', true);
          smokesLabel.classed('active', true).classed('inactive', false);
          obesityLabel.classed('active', false).classed('inactive', true); 
        }
        else {
          healthcareLabel.classed('active', false).classed('inactive', true);
          smokesLabel.classed('active', false).classed('inactive', true);
          obesityLabel.classed('active', true).classed('inactive', false); 
        }
      }
    });

}).catch(function(error) {
    console.log(error);
});
}
// When the browser loads, makeResponsive() is called.
makeResponsive();

// When the browser window is resized, makeResponsive() is called.
d3.select(window).on('resize', makeResponsive);
