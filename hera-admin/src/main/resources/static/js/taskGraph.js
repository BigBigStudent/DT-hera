function keypath(type) {
    graphType = type;
    var node = $("#item")[0].value;
    if (node == "")
        return;
    var url = base_url + "/scheduleCenter/getJobImpactOrProgress";
    var data = {jobId: node, type: type};

    var success = function (data) {
        // Create a new directed com.dfire.graph
        if (data.success == false) {
            alert("不存在该任务节点");
            return;
        }
        initDate(data);

        // Set up the edges
        svg = d3.select("svg");
        inner = svg.select("g");

        // Set up zoom support
        zoom = d3.behavior.zoom().on("zoom", function () {
            inner.attr("transform", "translate(" + d3.event.translate + ")" +
                "scale(" + d3.event.scale + ")");
        });
        svg.call(zoom);

        redraw();
        // expandNextNode(1);
        zoom
            .translate([($('svg').width() - g.graph().width * initialScale) / 2, 20])
            .scale(initialScale)
            .event(svg);
        //svg.attr('height', g.com.dfire.graph().height * initialScale + 40);
    }

    jQuery.ajax({
        type: 'POST',
        url: url,
        data: data,
        success: success
        //dataType: 'json'
    });
}
function keypath1(type) {
    //alert("taskGraph_item : "+$("#item")[0].value)
    $('#expandAll').removeClass('active').addClass('disabled');

    graphType = type;
    let node = $("#item")[0].value;
    if (node == "")
        return;
    let url = base_url + "/scheduleCenter/getJobImpactOrProgress";
    let data = {jobId: node, type: type};

    let success = function (data) {
        // Create a new directed com.dfire.graph
        if (data.success == false) {
            alert("不存在该任务节点");
            return;
        }
        //alert("data :" + data)
        initDate(data);

        // Set up the edges
        svg = d3.select("svg");
        //alert("svg :" + svg)
        inner = svg.select("g");
        //alert("inner :" + inner)
        // Set up zoom support
        zoom = d3.behavior.zoom().on("zoom", function () {
            inner.attr("transform", "translate(" + d3.event.translate + ")" +
                "scale(" + d3.event.scale + ")");
        });
        //alert("zoom :" + zoom);
        //alert("d3.event.translate :" + d3.event.translate);
        //alert("d3.event.scale :" + d3.event.scale);
        svg.call(zoom);


        redraw();


        // expandNextNode(1);
        zoom
            .translate([($('svg').width() - g.graph().width * initialScale) / 2, 20])
            .scale(initialScale)
            .event(svg);
        //svg.attr('height', g.com.dfire.graph().height * initialScale + 40);


        $('#expandAll').removeClass('disabled').addClass('active');

        expandNextNode(len);
    }
    jQuery.ajax({
        type: 'POST',
        url: url,
        data: data,
        success: success
        //dataType: 'json'
    });

}
function initDate(data) {
    edges = data.data.edges;
    //alert("edges :" + edges);
    headNode = data.data.headNode;
    //alert("headNode :" + headNode);
    len = edges.length;
    //alert("len :" + len);
    currIndex = 0;
    g = new dagreD3.graphlib.Graph().setGraph({});
    //alert("g :" + g);
    g.setNode(headNode.nodeName, {label: headNode.nodeName, style: "fill: #bd16ff" + ";" + headNode.remark})
    //alert("g :" + g);
    var nodeName;

    for (var i = 0; i < len; i++) {
        nodeName = edges[i].nodeA.nodeName;
        //alert("nodeName :" + nodeName);
        if (nodeIndex[nodeName] == null || nodeIndex[nodeName] == undefined || nodeIndex[nodeName] == 0) {
            nodeIndex[nodeName] = i + 1;
            //alert("nodeIndex[nodeName] :" + nodeIndex[nodeName]);
        }
    }
}

//重新加载界面
function redraw() {
    var render = new dagreD3.render();
    render(inner, g);

    $('.node').on("mousemove", function () {
        var nodeName = $(this).text();
        var str = g.node(nodeName).style || '';

        //  alert("str : "+str);
        //  if(str.indexOf("任务ID：96") >= 0){
        //
        //  if(str.indexOf("任务ID：96\n") >= 0){
        //      //alert("96")
        //      var node_g_id="node_g_"+(str.split('任务名称')[0].split('ID：')[1].replace(/\s*/g, ""))
        //      $("#"+node_g_id).css("color","red");
        /* $('#node_g_96').style.border="1px solid red";
         $('#node_g_96').style.backgroundColor="#ccc";*/
        // }
        $('#jobDetail').text(str.substring(str.indexOf(";") + 1));
    })

    $('.node').on("click", function () {


        var nodeName = $(this).text();
        var str = g.node(nodeName).style || '';
        //alert("str : " + str);
        var node_g_id = "node_g_" + (str.split('任务名称')[0].split('ID：')[1].replace(/\s*/g, ""))
        //$("#" + node_g_id).siblings().css("color", "");

        $(".label >g").css("color", "");//清除原有的样式
        $("#" + node_g_id).css("color", "#000033");//给点击的任务添加颜色
        //alert("str :" + str)

        if (str.indexOf("上游依赖：") >= 0) {
            //alert("进入")
            var up_node_g_ids = str.split('上游依赖：')[1].split('\n')[0].replace(/\s*/g, "")
            if(up_node_g_ids=="none"){
                //alert("无上游依赖")
            }else if(up_node_g_ids.indexOf(",")>0){
                //alert("上有依赖较多"+up_node_g_ids)
                var arr=new Array();
                arr=up_node_g_ids.split(',');
                for(var i=0;i<arr.length;i++) {
                    $("#" + "node_g_"+arr[i]).css("color", "red");//给上游的任务添加颜色
                }
            }else{
                //alert("上游依赖就一个"+up_node_g_ids)
                $("#" + "node_g_"+up_node_g_ids).css("color", "red");
            }
        }
        if (str.indexOf("下游依赖：") >= 0) {
            var down_node_g_id = str.split('下游依赖：')[1].split('\n')[0].replace(/\s*/g, "")
            //alert("down_node_g_id :" + down_node_g_id)
            if(down_node_g_id=="none"){
                //alert("无上游依赖")
            }else if(down_node_g_id.indexOf(",")>0){
                //alert("上有依赖较多"+up_node_g_ids)
                var arr1=new Array();
                arr1=down_node_g_id.split(',');
                for(var i=0;i<arr1.length;i++) {
                    $("#" + "node_g_"+arr1[i]).css("color", "#FFFF33");//给下游的任务添加颜色
                }
            }else{
                //alert("上游依赖就一个"+up_node_g_ids)
                $("#" + "node_g_"+down_node_g_id).css("color", "#FFFF33");
            }
        }

        var currNodeIndex = nodeIndex[nodeName];
        // if (currNodeIndex == 0 || currNodeIndex == undefined) {
        //    /* $('#jobDetail').text("此任务节点已全部展开^_^");*/
        //     return;
        // }

        --currNodeIndex;
        while (true) {
            var edge = edges[currNodeIndex];
            addEdgeToGraph(edge);
            if (++currNodeIndex >= len || edge.nodeA.nodeName != edges[currNodeIndex].nodeA.nodeName) {
                break;
            }
        }
        nodeIndex[nodeName] = 0;
        redraw();
    })
}

//根据状态获得颜色
function getColor(auto, status) {
    /*  任务ID：140
     任务名称:股票行情数据接入hive*/
    //alert("auto : " + auto)
    //alert("status : " + status)
    // var defaultId = localStorage.getItem("defaultId");
    // alert("defaultId : " + defaultId)

    //alert("item : " + $("#item").val())

    // 判断是否关闭，0表示关闭，特殊颜色显示
    //if (status.replace(/\s*/g, "").indexOf(("任务ID：" + localStorage.getItem("defaultId")).replace(/\s*/g, "")) >= 0) {

    //alert("id--  :"+status.split('任务名称')[0].split('ID：')[1].replace(/\s*/g, ""))


    if (status.split('任务名称')[0].split('ID：')[1].replace(/\s*/g, "") == $("#item").val().replace(/\s*/g, "")) {
        //alert("当前节点")
        return "fill: #00FFFF";
    } else if (auto == 0) {
        return "fill: #919191";//灰色
    } else if(auto == 2){
        return "fill: #919191";//灰色
    }
    else if (status.indexOf("success") >= 0) {
        //alert("success...") ;
        return "fill: #37b55a";//绿色
    } else if (status.indexOf("running") >= 0) {
        //alert("running...") ;
        return "fill: #f0ab4e";//黄色
    } else if(status.indexOf("failed") >= 0){//failed
        return "fill: #f77";//红色
    } else {
        //alert("其他...")
        return "fill: #66B3FF";//未运行显示蓝色
    }

}

function expandNextNode(nodeNum) {
    while (nodeNum > 0) {
        if (currIndex < len) {
            var edge = edges[currIndex];
            if (addEdgeToGraph(edge)) {
                nodeNum--;
            }
            currIndex++;
        } else {
            //alert("已经全部展示完毕！");
            //layer.msg("已经全部展示完毕！");
            break;
        }
    }
    redraw();
}
/** 绘制节点信息 */
function addEdgeToGraph(edge) {
    var target = edge.nodeA;
    var src = edge.nodeB;


    /*   var keys = Object.keys(edge);
     var keys1 = Object.keys(target);
     //Object.getOwnPropertyNames(edge);
     console.log("keys : " + keys);

     console.log("keys1 : " + keys1);
     console.log("target.remark : " + target.remark);
     console.log("target.auto : " + target.auto);
     console.log("target.nodeName : " + target.nodeName);*/

    if (g.node(src.nodeName) == undefined) {
        var srcRemarkColor = getColor(src.auto, src.remark);
        g.setNode(src.nodeName, {label: src.nodeName, style: srcRemarkColor + ";" + src.remark});
    }
    if (g.node(target.nodeName) == undefined) {
        var targetRemarkColor = getColor(target.auto, target.remark);
        g.setNode(target.nodeName, {label: target.nodeName, style: targetRemarkColor + ";" + target.remark});
    }
    if (nodeIndex[target.nodeName] == 0) {
        return false;
    }
    if (graphType == 0) {
        g.setEdge(src.nodeName, target.nodeName, {label: ""});
    } else {
        g.setEdge(target.nodeName, src.nodeName, {label: ""});
    }

    return true;
}





