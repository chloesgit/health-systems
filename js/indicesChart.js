export const indicesChart = (data) => {
    /* Set the dimensions and margins of the graph */
    const width = 900, height = 400;
    const margins = {top: 50, right: 40, bottom: 120, left: 40};

    /* Create the SVG container */
    const svg = d3.select("#bar")
        .append("svg")
        .attr("viewBox", [0, 0, width, height]);

    /* Define x-axis, y-axis, and color scales
        Ref: https://observablehq.com/@d3/introduction-to-d3s-scales */
    const xScale = d3.scaleBand()
        .domain(data.map(d => d.country))
        .range([margins.left, width-margins.right])
        .paddingInner(0.2);
    const yScale = d3.scaleLinear()
        .domain([0, d3.max(data, d => d.haq)])
        .range([height-margins.bottom, margins.top])


    /* Working with Color: https://observablehq.com/@d3/working-with-color
        Color schemes: https://observablehq.com/@d3/color-schemes 
        d3-scale-chromatic: https://github.com/d3/d3-scale-chromatic */
    const countries = data.map(d => d.country);
    const areas = data.map(d => d.area);
    var color=d3.scaleOrdinal()
        .domain(areas)
        .range(d3.schemeTableau10); // work for less than 10 categories, if more, cycle
    

    // Legend creation
    var legend = d3.legendColor()
        .scale(color);
    const svg_legend = d3.select("#bar")
        .append("svg")
        .attr("viewBox", [0, 0, width, height]);

    svg_legend.append("g")
        .attr("transform", "translate(50,0)")
        .call(legend);

    svg.append("title")
        .attr("text-anchor", "middle")  
        .style("font-size", "16px")
        .text("HAQ score by country");
    /* Create the bar elements and append to the SVG group
        Ref: https://observablehq.com/@d3/bar-chart */
    const bar=svg.append("g")
        .attr("class", "bars")
        .selectAll("rect")
        .data(data)
        .join("rect")
        .attr("x", d => xScale(d.country))
        .attr("y", d => yScale(d.haq))
        .attr("width", xScale.bandwidth())
        .attr("height", d => yScale(0) - yScale(d.haq))
        .attr("fill", "lightgrey")
        .attr("fill", d => color(d.area))
        .call(legend)

    /* Add the tooltip when hover on the bar */
    bar.append("title").text(d => (d.country));

    /* Create the x and y axes and append them to the chart
        Ref: https://www.d3indepth.com/axes/ and https://github.com/d3/d3-axis */
    const xAxis = d3.axisBottom(xScale);
    const yAxis = d3.axisLeft(yScale);

    const xGroup = svg.append("g")
        .attr("transform",`translate(0, ${height-margins.bottom})`)
        .call(xAxis);

    xGroup.selectAll("text")
        .style("text-anchor","end")
        .attr("dx","-.8em")
        .attr("dy",".15em")
        .attr("transform",`rotate(-65)`);

    const yGroup = svg.append("g")
        .attr("transform",`translate(${margins.left},0)`)
        .call(yAxis);

    yGroup.selectAll("text")
        .style("text-anchor","end")
}

function Swatches(color, {
    columns = null,
    format,
    unknown: formatUnknown,
    swatchSize = 15,
    swatchWidth = swatchSize,
    swatchHeight = swatchSize,
    marginLeft = 0
  } = {}) {
    const id = `-swatches-${Math.random().toString(16).slice(2)}`;
    const unknown = formatUnknown == null ? undefined : color.unknown();
    const unknowns = unknown == null || unknown === d3.scaleImplicit ? [] : [unknown];
    const domain = color.domain().concat(unknowns);
    if (format === undefined) format = x => x === unknown ? formatUnknown : x;
  
    function entity(character) {
      return `&#${character.charCodeAt(0).toString()};`;
    }
  
    if (columns !== null) return `<div style="display: flex; align-items: center; margin-left: ${+marginLeft}px; min-height: 33px; font: 10px sans-serif;">
    <style>
  
  .${id}-item {
    break-inside: avoid;
    display: flex;
    align-items: center;
    padding-bottom: 1px;
  }
  
  .${id}-label {
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    max-width: calc(100% - ${+swatchWidth}px - 0.5em);
  }
  
  .${id}-swatch {
    width: ${+swatchWidth}px;
    height: ${+swatchHeight}px;
    margin: 0 0.5em 0 0;
  }
  
    </style>
    <div style=${{width: "100%", columns}}>${domain.map(value => {
      const label = `${format(value)}`;
      return `<div class=${id}-item>
        <div class=${id}-swatch style=${{background: color(value)}}></div>
        <div class=${id}-label title=${label}>${label}</div>
      </div>`;
    })}
    </div>
  </div>`;
  
    return `<div style="display: flex; align-items: center; min-height: 33px; margin-left: ${+marginLeft}px; font: 10px sans-serif;">
    <style>
  
  .${id} {
    display: inline-flex;
    align-items: center;
    margin-right: 1em;
  }
  
  .${id}::before {
    content: "";
    width: ${+swatchWidth}px;
    height: ${+swatchHeight}px;
    margin-right: 0.5em;
    background: var(--color);
  }
  
    </style>
    <div>${domain.map(value => `<span class="${id}" style="--color: ${color(value)}">${format(value)}</span>`)}</div>`;
  }