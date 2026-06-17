Promise.all([
    d3.json("../data/world.geojson"),
    d3.csv("../data/ch6_transfer_flow.csv")
]).then(([world, transfers]) => {

    console.log("chapter 6: Transfer Flow")
    console.log(world);
    console.log(transfers);

    const container = d3.select("#ch6")

    const width = container.node().clientWidth;
    const height = container.node().clientHeight;

    const margin = {
        top: 40,
        right: 40,
        bottom: 50,
        left: 60
    };

    const innerWidth = width - margin.left - margin.right;
    const innerHeight = height - margin.top - margin.bottom;

    const svg = container.append("svg")
                    .attr("viewBox", `0 0 ${width} ${height}`)
                    .attr("preserveAspectRatio", "xMidYMid meet")

    // Projection
    const projection = d3.geoMercator()
        .scale(140)
        .translate([width / 2, height / 1.5]);

    const path = d3.geoPath()
        .projection(projection);

    // Draw countries
    svg.selectAll("path")
        .data(world.features)
        .enter()
        .append("path")
        .attr("d", path)
        .style("fill", "#1F3A5F")
        .style("stroke", "rgba(255,255,255,0.1)");

    // Get unique countries from transfer data
    const countries = [...new Set(
        transfers.map(d => d.from_country)
    )];

console.log(countries)

    const countryCoords = {
        "England": [-1.2649062, 52.5310214],
        "Spain": [-4.8379791, 39.3260685],
        "Italy": [12.56417, 41.8739875,],
        "Germany": [10.4478313, 51.1638175],
        "France": [2.209666999999996, 46.232192999999995],
        "Netherlands": [5.6343227, 52.2434979],
        "Portugal": [-8.1353519, 39.6621648],
        "Russia": [97.7453061, 64.6863136],
        "Brazil": [-53.25, -14.0],
        "Qatar": [51.2295295, 25.3336984],
        "Togo": [1.0199765, 8.7800265],
        "Scotland": [ -4.251806, 57.149651],
        "Argentina": [-64.9672817, -34.9964963],
        "Denmark": [10.3333283, 55.670249],
        "United States": [-100.445882, 39.7837304],
        "Switzerland": [8.2319736, 46.7985624],
        "South Africa": [24.991639, -28.8166236],
        "Israel": [34.8594762, 30.8124247],
        "Ireland": [-7.9794599, 52.865196],
        "Australia": [134.755, -24.7761086],
        "Chile": [-71.3187697, -31.7613365],
        "Slovenia": [14.8153333, 46.1199444],
        "Türkiye": [35.2316631, 39.294076],
        "Latvia": [24.7537645, 56.8406494],
        "Bulgaria": [25.4856617, 42.6073975],
        "Slovakia": [19.4528646, 48.7411522],
        "Belgium": [4.6667145, 50.6402809],
        "Ukraine": [31.2718321, 49.4871968],
        "Norway": [8.7876653, 61.1529386],
        "Croatia": [15.6575209, 45.3658443],
        "Greece": [21.9877132, 38.9953683],
        "Sweden": [14.5208584, 59.6749712],
        "Serbia": [20.55144, 44.1534121],
        "Czech Republic": [15.3381061, 49.7439047],
        "Wales": [-3.73893, 52.2928116],
        "Cote d'Ivoire": [-5.5679458, 7.9897371],
        "Mexico": [-102.0077097, 23.6585116],
        "Egypt": [29.2675469, 26.2540493],
        "China": [104.999927, 35.000074],
        "Austria": [14.12456, 47.59397],
        "Poland": [19.134422, 52.215933],
        "Trinidad and Tobago": [-61.0840075, 10.7466905],
        "Hungary": [19.5060937, 47.1817585],
        "Japan": [139.2394179, 36.5748441],
        "Uruguay": [-56.0201525, -32.8755548],
        "Colombia": [-72.9088133, 4.099917],
        "Korea, South": [127.6961188, 36.638392],
        "Costa Rica": [-84.0739102, 10.2735633],
        "Romania": [24.6859225, 45.9852129],
        "Northern Ireland": [-6.9591554, 54.5859836],
        "Cyprus": [33.1451285, 34.9823018],
        "United Arab Emirates": [54.5, 23.75],
        "Venezuela": [-66.1109318, 8.0018709],
        "Paraguay": [-58.1693445, -23.3165935],
        "Finland": [25.9209164, 63.2467777],
        "Angola": [17.5691241, -11.8775768],
        "Honduras": [-86.0755145, 15.2572432],
        "Nigeria": [7.9999721, 9.6000359],
        "Ecuador": [-79.3666965, -1.3397668],
        "Saudi Arabia": [42.3528328, 25.6242618]
    };

transfers.forEach(d => {

    if (!countryCoords[d.from_country]) {
        console.log("Missing FROM:", d.from_country);
    }

    if (!countryCoords[d.to_country]) {
        console.log("Missing TO:", d.to_country);
    }

});


    const source = d => projection(countryCoords[d.from_country]);

    const target = d => projection(countryCoords[d.to_country]);

    // Draw straight lines between source and target countries
    // svg.selectAll(".flow")
    //     .data(transfers)
    //     .enter()
    //     .append("line")
    //     .attr("class", "flow")
    //     .attr("x1", d => projection(countryCoords[d.from_country])[0])
    //     .attr("y1", d => projection(countryCoords[d.from_country])[1])
    //     .attr("x2", d => projection(countryCoords[d.to_country])[0])
    //     .attr("y2", d => projection(countryCoords[d.to_country])[1])
    //     .style("stroke", "rgba(44,166,164,0.3)")
    //     .style("stroke-width", 1);

    // Draw curved lines between source and target countries    
    svg.selectAll(".flow")
        .data(transfers)
        .enter()
        .append("path")
        .attr("class", "flow")

        .attr("d", d => {

            const source = projection(
                countryCoords[d.from_country]
            );

            const target = projection(
                countryCoords[d.to_country]
            );

            // midpoint for curve
            const midX = (source[0] + target[0]) / 2;
            const midY = (source[1] + target[1]) / 2 - 80;

            return `
                M ${source[0]},${source[1]}
                Q ${midX},${midY}
                ${target[0]},${target[1]}
            `;
        })

        .style("fill", "none")
        .style("stroke", "rgba(44,166,164,0.3)")
        .style("stroke-width", 1.5);



});
