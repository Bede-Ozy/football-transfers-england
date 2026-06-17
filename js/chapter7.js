// Promise.all([
//     d3.csv("../data/ch7_valuation_explosion.csv")
// ]).then(([data]) => {
//     console.log("===========")
//     console.log(data)

//     console.log("RAW DATA", data)
//     const explosion = data.map(d => ({
//         period: d.period,
//         average_fee: +d.average_fee
//     }));

//     console.log("EXPLOSION", explosion)


//     const container = d3.select("#ch7")

//     const width = container.node().clientWidth;
//     const height = container.node().clientHeight;

//     const margin = {
//         top: 40,
//         right: 40,
//         bottom: 50,
//         left: 60
//     };

//     var innerWidth = width - margin.left -margin.right;
//     var innerHeight = height - margin.top - margin.bottom;

//     const svg = container.append("svg")
//                     .attr("viewBox", `0 0 ${width} ${height}`)
//                     .attr("preserveAspectRatio", "xMidYMid meet")

//     const g = svg.append("g")
//         .attr("transform", `translate(${width / 2}, ${height / 2})`);

//     const pre = explosion.find(d => d.period === "pre-tv").average_fee;

//     const post = explosion.find(d => d.period === "post-tv").average_fee;

//     const max = d3.max(explosion, d => d.average_fee);

//     const prePct = pre / max;
//     const postPct = post / max;


//     //BUILDING THE KPI
//     const radius = 110;

//     // Background ring
//     const arcBg = d3.arc()
//     .innerRadius(80)
//     .outerRadius(120)
//     .startAngle(0)
//     .endAngle(Math.PI * 2)


//     g.append("path")
//         .attr("d", arcBg)
//         .attr("fill", "#eee");

//     // Pre-TV arc
//     const arcPre = d3.arc()
//         .innerRadius(90)
//         .outerRadius(110)
//         .startAngle(0)
//         .endAngle(prePct * 2 * Math.PI)
//         .cornerRadius(10);

//     g.append("path")
//         .attr("d", arcPre)
//         .attr("fill", "#1F3A5F");

//     g.append("text")
//         .attr("text-anchor", "middle")
//         .attr("dy", "0.35em")
//         .style("font-size", "35px")
//         .style("font-weight", "bold")
//         .style("fill", "#eee")
//         .text(`£${d3.format(",.2f")(pre/1000000)}M`)
        
//     // Post-TV arc
//     // const arcPost = d3.arc()
//     //     .innerRadius(80)
//     //     .outerRadius(100)
//     //     .startAngle(0)
//     //     .endAngle(postPct * 2 * Math.PI)
//     //      .cornerRadius(10);

//     // g.append("path")
//     //     .attr("d", arcPost)
//     //     .attr("fill", "#FF6B6B")
//     //     .attr("transform", `rotate(${prePct * 360})`); // Rotate to start after pre-TV arc
// })

Promise.all([
    d3.csv("../data/ch7_valuation_explosion.csv")
]).then(([data]) => {

    const explosion = data.map(d => ({
        period: d.period,
        average_fee: +d.average_fee
    }));


    const pre = explosion.find(
        d => d.period === "pre-tv"
    ).average_fee;

    const post = explosion.find(
        d => d.period === "post-tv"
    ).average_fee;

    const growthPct =
        ((post - pre) / pre) * 100;


    const container = d3.select("#ch7");

    const width = container.node().clientWidth;
    const height = container.node().clientHeight;


    const svg = container.append("svg")
        .attr("viewBox", `0 0 ${width} ${height}`)
        .attr("preserveAspectRatio", "xMidYMid meet");


    // ==========================
    // Title
    // ==========================

    svg.append("text")
        .attr("x", width / 2)
        .attr("y", 80)
        .attr("text-anchor", "middle")
        .style("fill", "white")
        .style("font-size", "28px")
        .style("font-weight", "600")
        .text("Average Transfer Fee");


    // ==========================
    // PRE TV
    // ==========================

    svg.append("text")
        .attr("x", width / 2)
        .attr("y", height / 2 - 120)
        .attr("text-anchor", "middle")
        .style("fill", "var(--sub-color)")
        .style("font-size", "20px")
        .text("PRE-TV");


    svg.append("text")
        .attr("x", width / 2)
        .attr("y", height / 2 - 40)
        .attr("text-anchor", "middle")
        .style("fill", "white")
        .style("font-size", "70px")
        .style("font-weight", "bold")
        .text(`£${(pre / 1000000).toFixed(1)}M`);


    // ==========================
    // Arrow
    // ==========================

    svg.append("text")
        .attr("x", width / 2)
        .attr("y", height / 2 + 30)
        .attr("text-anchor", "middle")
        .style("fill", "var(--bright)")
        .style("font-size", "40px")
        .text("↓");


    // ==========================
    // POST TV
    // ==========================

    svg.append("text")
        .attr("x", width / 2)
        .attr("y", height / 2 + 70)
        .attr("text-anchor", "middle")
        .style("fill", "var(--sub-color)")
        .style("font-size", "20px")
        .text("POST-TV");


    svg.append("text")
        .attr("x", width / 2)
        .attr("y", height / 2 + 130)
        .attr("text-anchor", "middle")
        .style("fill", "white")
        .style("font-size", "70px")
        .style("font-weight", "bold")
        .text(`£${(post / 1000000).toFixed(1)}M`);


    // ==========================
    // Growth %
    // ==========================

    svg.append("text")
        .attr("x", width / 2)
        .attr("y", height - 50)
        .attr("text-anchor", "middle")
        .style("fill", "var(--bright)")
        .style("font-size", "40px")
        .style("font-weight", "bold")
        .text(`+${growthPct.toFixed(0)}%`);

});