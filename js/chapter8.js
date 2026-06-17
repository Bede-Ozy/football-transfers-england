Promise.all([
    d3.csv("../data/ch8a_positional_investment_pre_tv.csv"),
    d3.csv("../data/ch8b_positional_investment_post_tv.csv")
]).then(([prePositional, postPositional]) => {

    console.log("=========== chapter 8");

    const prePosition = prePositional.map(d => ({
        general_position: d.general_position,
        spend_millions: +d.spend_millions
    }));

    const postPosition = postPositional.map(d => ({
        general_position: d.general_position,
        spend_millions: +d.spend_millions
    }));

    console.log(prePosition);
    console.log(postPosition);

    // ==========================
    // Combine datasets
    // ==========================

    const combined = prePosition.map(pre => {

        const post = postPosition.find(
            d => d.general_position === pre.general_position
        );

        return {
            position: pre.general_position,
            pre: pre.spend_millions,
            post: post ? post.spend_millions : 0
        };

    });

    // ==========================
    // Sort by total spend
    // ==========================

    combined.sort(
        (a, b) => (b.pre + b.post) - (a.pre + a.post)
    );

    console.log("Combined");
    console.log(combined);

    // ==========================
    // SVG Setup
    // ==========================

    const container = d3.select("#ch8");

    const width = container.node().clientWidth;
    const height = container.node().clientHeight;

    const margin = {
        top: 50,
        right: 100,
        bottom: 50,
        left: 180
    };

    const innerWidth =
        width -
        margin.left -
        margin.right;

    const innerHeight =
        height -
        margin.top -
        margin.bottom;

    const svg = container.append("svg")
        .attr(
            "viewBox",
            `0 0 ${width} ${height}`
        )
        .attr(
            "preserveAspectRatio",
            "xMidYMid meet"
        );

    const chart = svg.append("g")
        .attr(
            "transform",
            `translate(${margin.left},${margin.top})`
        );

    // ==========================
    // Scales
    // ==========================

    const xScale = d3.scaleLinear()
        .domain([
            0,
            d3.max(
                combined,
                d => d.pre + d.post
            )
        ])
        .nice()
        .range([0, innerWidth]);

    const yScale = d3.scaleBand()
        .domain(
            combined.map(
                d => d.position
            )
        )
        .range([0, innerHeight])
        .padding(0.25);

    // ==========================
    // Axes
    // ==========================

    const xAxis = d3.axisBottom(xScale);

    const yAxis = d3.axisLeft(yScale);

    chart.append("g")
        .attr("class", "x-axis")
        .attr(
            "transform",
            `translate(0,${innerHeight})`
        )
        .call(xAxis);

    chart.append("g")
        .attr("class", "y-axis")
        .call(yAxis);

    // ==========================
    // Pre-TV Bars
    // ==========================

    chart.selectAll(".pre-bar")
        .data(combined)
        .enter()
        .append("rect")
        .attr("class", "pre-bar")
        .attr("x", 0)
        .attr(
            "y",
            d => yScale(d.position)
        )
        .attr(
            "height",
            yScale.bandwidth()
        )
        .attr(
            "width",
            d => xScale(d.pre)
        )
        .attr(
            "fill",
            "var(--data-color)"
        );

    // ==========================
    // Post-TV Bars
    // ==========================

    chart.selectAll(".post-bar")
        .data(combined)
        .enter()
        .append("rect")
        .attr("class", "post-bar")
        .attr(
            "x",
            d => xScale(d.pre)
        )
        .attr(
            "y",
            d => yScale(d.position)
        )
        .attr(
            "height",
            yScale.bandwidth()
        )
        .attr(
            "width",
            d => xScale(d.post)
        )
        .attr(
            "fill",
            "var(--bright)"
        );

    // ==========================
    // Total Labels
    // ==========================

    chart.selectAll(".total-label")
        .data(combined)
        .enter()
        .append("text")
        .attr(
            "class",
            "total-label"
        )
        .attr(
            "x",
            d => xScale(d.pre + d.post) + 8
        )
        .attr(
            "y",
            d =>
                yScale(d.position) +
                yScale.bandwidth() / 2
        )
        .attr("dy", "0.35em")
        .style("fill", "white")
        .style("font-size", "12px")
        .text(
            d =>
            `£${Math.round(
                d.pre + d.post
            )/1000}B`
        );

    // ==========================
    // Legend
    // ==========================

    const legend = svg.append("g")
        .attr(
            "transform",
            `translate(${width - 180}, 30)`
        );

    legend.append("rect")
        .attr("width", 14)
        .attr("height", 14)
        .attr("fill", "var(--data-color)");

    legend.append("text")
        .attr("x", 22)
        .attr("y", 11)
        .style("fill", "white")
        .style("font-size", "12px")
        .text("Pre-TV");

    legend.append("rect")
        .attr("x", 90)
        .attr("width", 14)
        .attr("height", 14)
        .attr("fill", "var(--bright)");

    legend.append("text")
        .attr("x", 112)
        .attr("y", 11)
        .style("fill", "white")
        .style("font-size", "12px")
        .text("Post-TV");

    // ==========================
    // Title
    // ==========================

    svg.append("text")
        .attr("x", width / 2)
        .attr("y", 25)
        .attr("text-anchor", "middle")
        .style("fill", "white")
        .style("font-size", "20px")
        .style("font-weight", "bold")
        .text("Investment by Position");

});