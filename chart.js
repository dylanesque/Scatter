async function chartName() {
  // 1. Access data
  const dataset = await d3.json(
    `https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/cyclist-data.json`
  );

  const minuteParser = d3.timeParse('%M:%S');
  const yearParser = d3.timeParse('%Y');
  const xAccessor = (d) => yearParser(d.Year);
  const yAccessor = (d) => minuteParser(d.Time);

  // 2. Create chart dimensions

  // This convention for determining width picks the smaller of the window width or height,
  // to ensure a square chart
  const width = d3.min([window.innerWidth * 0.9, window.innerHeight * 0.9]);
  let dimensions = {
    width: width,
    height: width,
    margin: {
      top: 10,
      right: 10,
      bottom: 50,
      left: 50,
    },
  };
  dimensions.boundedWidth =
    dimensions.width - dimensions.margin.left - dimensions.margin.right;
  dimensions.boundedHeight =
    dimensions.height - dimensions.margin.top - dimensions.margin.bottom;

  // 3. Draw canvas
  const wrapper = d3
    .select('#wrapper')
    .append('svg')
    .attr('width', dimensions.width)
    .attr('height', dimensions.height);

  const bounds = wrapper
    .append('g')
    .style(
      'transform',
      `translate(${dimensions.margin.left}px, ${dimensions.margin.top}px)`
    );

  // 4. Create scales
  const xScale = d3
    .scaleTime()
    .domain(d3.extent(dataset, xAccessor))
    .range([0, dimensions.boundedWidth]);

  const yScale = d3
    .scaleTime()
    .domain(d3.extent(dataset, yAccessor))
    .range([0, dimensions.boundedHeight]);

  // 5. Draw Data

  const dots = bounds
    .selectAll('circle')
    .data(dataset)
    .enter()
    .append('circle')
    .attr('class', 'dot')
    .attr('cx', (d) => xScale(xAccessor(d)))
    .attr('cy', (d) => yScale(yAccessor(d)))
    .attr('r', 4)
    .attr('fill', 'cornflowerblue');
  // 6. Draw Peripherals

  const xAxisGenerator = d3.axisBottom().scale(xScale);
  const xAxis = bounds
    .append('g')
    .call(xAxisGenerator)
    .attr('id', 'x-axis')
    .style('transform', `translateY(${dimensions.boundedHeight}px)`);

  const xAxisLabel = xAxis
    .append('text')
    .attr('x', dimensions.boundedWidth / 2)
    .attr('y', dimensions.margin.bottom - 10)
    .attr('fill', 'black')
    .style('font-size', '1.4em');

  const yAxisGenerator = d3.axisLeft().scale(yScale).ticks(12);

  const yAxis = bounds.append('g').attr('id', 'y-axis').call(yAxisGenerator);

  const yAxisLabel = yAxis
    .append('text')
    .attr('x', -dimensions.boundedHeight / 2)
    .attr('y', -dimensions.margin.left + 10)
    .attr('fill', 'black')
    .style('font-size', '1.4em')
    .text('Time In Minutes')
    .style('transform', 'rotate(-90deg)')
    .style('text-anchor', 'middle');

  // 7. Set up interactions
}

chartName();
