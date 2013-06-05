(function() {

    $.ajax({ url: '/project/nunjucks', type: 'json' }, render);

    function render(data) {
        var d = d3.select('.graph').append('svg')
            .attr('width', '700px')
            .attr('height', '600px');

        var g = d.append('g')
            .attr('transform', 'translate(50, 550)');

        // process the data

        var dates = Object.keys(data);
        var counts = [];
        dates.sort();
        
        dates.forEach(function(date) {
            counts.push(data[date]);
        });

        // get scales

        var start = moment(dates[0], 'YYYYMMDD').toDate();
        var end = moment(dates[dates.length - 1], 'YYYYMMDD').toDate();

        var x = d3.time.scale().domain([start, end]).range([0, 630]);
        var y = d3.scale.linear().domain([d3.min(counts), d3.max(counts)]).range([0, 500]);

        g.selectAll('.y-labels').data(y.ticks(10)).enter()
            .append('text')
            .attr('x', -30)
            .attr('y', function(d) {
                return -y(d);
            })
            .attr('dy', 5)
            .text(function(d) {
                return d == 0 ? '' : d.toString();
            });

        g.selectAll('.y-lines').data(y.ticks(10)).enter()
            .append('line')
            .attr('x1', 0)
            .attr('y1', function(d) {
                return -y(d);
            })
            .attr('x2', 650)
            .attr('y2', function(d) {
                return -y(d);
            })
            .style('stroke', '#f0f0f0')
            .style('stroke-width', 1);

        g.selectAll('.lines').data(counts).enter()
            .append('line')
            .attr('x1', function(d, i) {
                return x(moment(dates[i], 'YYYYMMDD').toDate());
            })
            .attr('y1', function(d) {
                return -y(0);
            })
            .attr('x2', function(d, i) {
                return x(moment(dates[i], 'YYYYMMDD').toDate());
            })
            .attr('y2', function(d) {
                return -y(d);
            })
            .style('stroke', '#6666f0')
            .style('stroke-width', 1);
    }
})();
