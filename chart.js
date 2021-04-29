async function chartName() {
  // 1. Access data
  const dataset = await d3.json(
    `https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/cyclist-data.json`
  );

  const minuteParser = d3.timeParse('%M:%S');
  const xAccessor = (d) => d.Year;
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

  const legend = bounds
    .append('div')
    .attr('id', 'legend')
    .text('I am the legend');

  // 4. Create scales & tooltip
  const xScale = d3
    .scaleLinear()
    .domain(d3.extent(dataset, xAccessor))
    .range([0, dimensions.boundedWidth]);

  const yScale = d3
    .scaleTime()
    .domain(d3.extent(dataset, yAccessor))
    .range([0, dimensions.boundedHeight]);

  const tooltip = d3
    .select('body')
    .append('div')
    .attr('id', 'tooltip')
    .style('visibility', 'hidden');

  // 5. Draw Data

  const dots = bounds
    .selectAll('circle')
    .data(dataset)
    .enter()
    .append('circle')
    .attr('class', 'dot')
    .attr('data-xvalue', (d) => d.Year)
    .attr('data-yvalue', (d) => yAccessor(d))
    .attr('cx', (d) => xScale(xAccessor(d)))
    .attr('cy', (d) => yScale(yAccessor(d)))
    .attr('r', 4)
    .attr('fill', (d) => (d.Doping === '' ? 'green' : 'red'))
    .on('mouseover', onMouseOver)
    .on('mouseleave', onMouseLeave);

  function onMouseOver(d) {
    console.log(d.Time, typeof d.Time);
    tooltip.transition().duration(200).style('visibility', 'visible');
    tooltip
      .html('Year: ' + d.Year + '<br> Time: ' + d.Time)
      .style('left', d3.event.pageX + 'px')
      .style('top', d3.event.pageY - 28 + 'px')
      .attr('data-year', d.Year)
      .attr('data-yvalue', d.Time);
  }

  function onMouseLeave() {
    tooltip.transition().duration(200).style('visibility', 'hidden');
  }

  // 6. Draw Peripherals

  const xAxisGenerator = d3.axisBottom().scale(xScale).ticks(12, 'y');
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

  const yAxisGenerator = d3
    .axisLeft()
    .scale(yScale)
    .ticks(d3.timeSecond.every(15));

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
