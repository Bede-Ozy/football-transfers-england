Promise.all([
    d3.csv("../data/ch4_pre_tv_spend.csv"),
    d3.csv("../data/ch5_post_tv_spend.csv")
]).then(([preData, postData]) => {

    const pre_tv = preData.map(d => ({
        season_start: +d.season_start,
        spend_millions: +d.spend_millions,
        type: "pre"
    }));

    const post_tv = postData.map(d => ({
        season_start: +d.season_start,
        spend_millions: +d.spend_millions,
        type: "post"
    }));

    const container = d3.select("#ch4");

    const width = container.node().clientWidth;
    const height = container.node().clientHeight;

    const margin = {
        top: 40,
        right: 40,
        bottom: 50,
        left: 80
    };

    const innerWidth = width - margin.left - margin.right;
    const innerHeight = height - margin.top - margin.bottom;

    const svg = container.append("svg")
        .attr("viewBox", `0 0 ${width} ${height}`)
        .attr("preserveAspectRatio", "xMidYMid meet");

    const chart = svg.append("g")
        .attr("transform", `translate(${margin.left}, ${margin.top})`);

    const allData = [...pre_tv, ...post_tv];

    const xScale = d3.scaleLinear()
        .domain(d3.extent(allData, d => d.season_start))
        .range([0, innerWidth]);

    const yScale = d3.scaleLinear()
        .domain([0, d3.max(allData, d => d.spend_millions)])
        .range([innerHeight, 0]);

    const xAxis = d3.axisBottom(xScale)
    const yAxis = d3.axisLeft(yScale).tickFormat(d => d < 1000 ? `£${d.toFixed(2)}M` : `£${(d/1000).toFixed(2)}B`)

    chart.append("g")
        .attr("class", "x-axis")
        .attr("transform", "translate(0, " + innerHeight + ")")
        .call(xAxis)

    chart.append("g")
        .attr("class", "y-axis")
        .call(yAxis)


    // Chart Title
    svg.append("text")
        .attr("x", width/2)
        .attr("y", 25)
        .attr("text-anchor","middle")
        .style("fill","white")
        .style("font-size","20px")
        .style("font-weight","bold")
        .text("Premier League Transfer Spending");
    
    const area = d3.area()
        .x(d => xScale(d.season_start))
        .y0(innerHeight)
        .y1(d => yScale(d.spend_millions))
        .curve(d3.curveMonotoneX)

    const line = d3.line()
        .x(d => xScale(d.season_start))
        .y(d => yScale(d.spend_millions))
        .curve(d3.curveMonotoneX);

    const preArea = chart.append("path")
        .datum(pre_tv)
        .attr("d", area)
        // .style("fill", "var(--sub-color)")
        .style("fill", "rgba(44,166,164,0.25)")
        .style("stroke", "var(--data-color)")
        .style("stroke-width", "none")
        // .style("opacity", "0.6")

    const postArea = chart.append("path")
        .datum(post_tv)
        .attr("d", area)
        .style("fill", "rgba(44,166,164,0.25)")
        .style("opacity", 0)
        .style("stroke-width", "none")

        ;

    const prePath = chart.append("path")
        .datum(pre_tv)
        .attr("d", line)
        .style("stroke", "var(--data-color)")
        .style("stroke-width", "2px")
        .style("fill", "none");

    const postPath = chart.append("path")
        .datum(post_tv)
        .attr("d", line)
        .style("stroke", "var(--data-color)")
        .style("stroke-width", "2px")
        .style("fill", "none")
        .style("opacity", 0);

    
    // ========= Tooltip Line Tracer
    const tracer = chart.append("line")
        .style("stroke", "white")
        .style("stroke-width", 1)
        .style("stroke-dasharray", "4 4")
        .style("opacity", 0);

    // Reveal ToolTip Function
    function showTooltip(event, d) {
        d3.select(this)
            .style("opacity", 1)
            .attr("r", 7);

        tracer
            .style("opacity", 1)
            .attr("x1", xScale(d.season_start))
            .attr("x2", xScale(d.season_start))
            .attr("y1", yScale(d.spend_millions))
            .attr("y2", innerHeight);

        d3.select("#tooltip")
            .style("opacity", 1)
            .html(`
                <strong>${d.season_start}</strong><br>
                £${d.spend_millions < 1000 ? d.spend_millions.toFixed(2) + 'M': (d.spend_millions / 1000).toFixed(2) + 'B'}
            `)
            .style("left", (event.pageX + 15) + "px")
            .style("top", (event.pageY - 30) + "px");
    }

    function hideTooltip() {
        d3.select(this)
            .style("opacity", 0.6)
            .attr("r", 3);

        tracer.style("opacity", 0);

        d3.select("#tooltip")
            .style("opacity", 0);
    }


    // ========= Tooltip Circle locator

    const preDots = chart.selectAll(".pre-dot")
            .data(pre_tv)
            .enter()
            .append("circle")
            .attr("class", "pre-dot")
            .attr("cx", d => xScale(d.season_start))
            .attr("cy", d => yScale(d.spend_millions))
            .attr("r", 3)
            .style("fill", "var(--data-color)")
            .attr("stroke", "white")
            .attr("stroke-width", 1)
            .style("opacity", 0.6)
            .on("mouseover", showTooltip)
            .on("mouseout", hideTooltip);

    const postDots = chart.selectAll(".post-dot")
            .data(post_tv)
            .enter()
            .append("circle")
            .attr("class", "post-dot")
            .attr("cx", d => xScale(d.season_start))
            .attr("cy", d => yScale(d.spend_millions))
            .attr("r", 3)
            .style("fill", "var(--data-color)")
            .attr("stroke", "white")
            .attr("stroke-width", 1)
            .style("opacity", 0)
            .on("mouseover", showTooltip)
            .on("mouseout", hideTooltip);


    const annotations = chart.append("g")
    chart.append("line") 
        .attr("x1", xScale(2013)) 
        .attr("x2", xScale(2013))
        .attr("y1", 0)
        .attr("y2", innerHeight)
        .attr("stroke", "var(--data-color)")
        .attr("stroke-width", 1)
        .attr("stroke-dasharray", "4,4");

    // // d3.select("#page_label") 
    //     chart.append("text")
    //         .attr("x", xScale(2013) - 50)
    //         .attr("y", 20)
    //         .text("TV Boom Begins")
    //         .style("fill", "white")
    //         .style("font-size", "12px")
    //         .style("background-color", "black");

    d3.select("#page_label")
    .html("TV Boom Begins");

    window.chapter4 = {
        prePath,
        postPath,
        preArea,
        postArea,
        preDots,
        postDots
    };
        

});