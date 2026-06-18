document.addEventListener('DOMContentLoaded', function() {

    var classCount = document.querySelectorAll('.myChartJSChart').length;
    classCount = Number(classCount);

    var storeIds = new Array();
    var ctx = new Array();
    for (var i = 0; i < classCount; i++){        
        storeIds.push(document.getElementsByClassName('myChartJSChart')[i].id);
        ctx.push(eval(storeIds[i]));
    }

    //On scroll, check if in view
    var check = new Array();

    document.addEventListener("scroll", (event) => { 

        const docViewTop = document.documentElement.scrollTop;
        const docViewBottom = docViewTop + window.innerHeight;
    
        for (let j = 0; j < ctx.length; j++) {
            const elem = document.getElementById(storeIds[j]);
            const rect = elem.getBoundingClientRect();
            const elemTop = rect.top + window.pageYOffset;
            const elemBottom = rect.bottom + window.pageYOffset;
    
            if (elemTop <= docViewBottom && elemBottom >= docViewTop) {
                if(!check.includes(storeIds[j])){
                    check.push(storeIds[j]);
                    buildChart(ctx[j]);
                }
            }
        }
    });

    function buildChart(name){
        makeChart(name[6], name[0], name[1], name[2], name[3], name[4], name[5]);
    }

    function makeChart(ctx, type, title, labels, data, colors, border){
        let dataSet = new Array();
        dataSet = data.split(',');

        let labelSet = new Array();
        labelSet = labels.split(',');

        let colorSet = new Array();
        colorSet = colors.split(',');

        let setBorder = border;

        const myChart = new Chart(ctx,{
            type: type,
            options: {
                maintainAspectRatio: true,
                responsive: true
            },
            data: {
                labels: labelSet,
                datasets: [{
                    label: title,
                    data: dataSet,
                    backgroundColor: colorSet,
                    borderColor: '#777',
                    borderWidth: setBorder
                }],
            }
        });
    }

});
