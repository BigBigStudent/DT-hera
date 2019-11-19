let nodes, edges, g, headNode, currIndex = 0, len, inner, initialScale = 0.75, zoom, nodeIndex = {}, graphType,
    codeMirror, themeSelect = $('#themeSelect'), zTree;
;

layui.use(['table'], function () {

        // 自己添加的HeraFile的id
        //let heraFileid;
        //————————

        let table = layui.table;
        $('#scheduleManage').addClass('active');
        let focusItem = null;
        let isGroup;
        let focusTree;
        let dependTreeObj;
        let selected;
        let triggerType;
        let allArea = [];
        let groupTaskTable, groupTaskType, focusId = -1;
        let inheritConfigCM, selfConfigCM;
        let editor = $('#editor');
        let setting = {
            view: {
                fontCss: getFontCss
            },
            data: {
                simpleData: {
                    enable: true,
                    idKey: "id",
                    pIdKey: "parent",
                    rootPId: 0
                }
            },
            edit: {
                drag: {
                    isCopy: false,
                    isMove: true,
                    prev: true,
                    next: true
                },
                enable: true

            },
            callback: {
                beforeDrag: beforeDrag,
                onClick: leftClick,
                beforeDrop: beforeDrop
            }
        };


        function refreshCm() {
            selfConfigCM.refresh();
            codeMirror.refresh();
            inheritConfigCM.refresh();
        }

        /**
         * 把当前选中的节点存入localStorage
         * 页面刷新后，会根据"defaultId"设置当前选中的节点
         * 避免页面刷新丢失
         * @param id    节点ID
         */
        function setCurrentId(id) {
            localStorage.setItem("defaultId", id);
        }

        /**
         * 设置当前默认选中的节点
         * @param id    节点ID
         */
        function setDefaultSelectNode(id) {
            //alert("setDefaultSelectNode  : "+id)
            if (localStorage.getItem("taskGroup") === 'all') {
                allJobTree();
            } else {
                myJobTree();
            }
            if (id === null || id === undefined) {
                id = localStorage.getItem("defaultId");
                //alert("localStorage.getItem(defaultId);" +id)
            }
            if (id !== undefined && id !== null) {
                if (id.indexOf('group') !== -1) {
                    let node = focusTree.getNodeByParam("parent", id);
                    expandParent(node, focusTree);
                    focusTree.selectNode(node);
                } else {
                    let node = focusTree.getNodeByParam("id", id);
                    expandParent(node, focusTree);
                    focusTree.selectNode(node);
                }
                leftClick();
            }
        }

        /**
         * 切换任务编辑状态
         * @param status
         */
        function changeEditStyle(status) {
            //默认 展示状态
            let val1 = "block", val2 = "none";
            //编辑状态
            if (status == 0) {
                val1 = "none";
                val2 = "block";
            }
            codeMirror.setOption("readOnly", status != 0);
            selfConfigCM.setOption("readOnly", status != 0);
            $('#jobMessage').css("display", val1);
            $('#jobMessageEdit').css("display", val2);
            $('#jobOperate').css("display", val1);
            $('#editOperator').css("display", val2);
            $('#groupMessage').css("display", "none");
            $('#groupMessageEdit').css("display", "none");

        }

        /**
         * 任务编辑事件
         */
        $('#jobOperate [name="edit"]').on('click', function () {

            //判断是否有权限进入编辑页面
            //editControllerWhoCanEnter()
            var CurrentUser = $("#getCurrentUser").text();
            //   alert("CurrentUser :" + CurrentUser)
            var newJobId = localStorage.getItem("defaultId");
            //alert("localStorage.getItem(defaultId) :" + newJobId);
            let hideFlag;
            $.ajax({
                url: base_url + "/scheduleCenter/findByTargetIdSelf",
                type: "post",
                data: {
                    id: newJobId
                },
                success: function (data) {
                    hideFlag = data;
                    if (hideFlag) {
                        alert("抱歉，您没有权限进入编辑页面")
                    } else {

                        //从这
                        //回显
                        formDataLoad("jobMsgEditForm", focusItem);
                        initVal(focusItem.configs, "jobMsgEditForm");
                        changeEditStyle(0);
                        setJobMessageEdit(focusItem.scheduleType === 0)
                        let areaId = $('#jobMessageEdit [name="areaId"]');
                        let areas = new Array();
                        focusItem.areaId.split(",").forEach(function (val) {
                            areas.push(val);
                        });
                        areaId.selectpicker('val', areas);
                        areaId.selectpicker('refresh');
                        //到这

                    }
                }
            })


        });

        /**
         * 查看任务日志
         */
        $('#jobOperate [name="runningLog"]').on('click', function () {

            $('#runningLogDetailTable').bootstrapTable("destroy");
            let tableObject = new JobLogTable(focusId);
            tableObject.init();

            $('#jobLog').modal('show');

        });

        $('#jobOperate [name="addAdmin"]').on('click', function () {
            addAdmin();
        });


        $('#groupOperate [name="addAdmin"]').on('click', function () {
            addAdmin();
        });

        function addAdmin() {
            // alert("00-- jobId: focusId  " + focusId)
            // alert("00-- type: isGroup " + isGroup)
            $.ajax({
                url: base_url + "/scheduleCenter/getJobOperator",
                type: "get",
                data: {
                    jobId: focusId,
                    type: isGroup
                },
                success: function (data) {
                    if (data.success) {
                        let html = '';
                        //alert("data.data['getCurrentUser'] : "+data.data['getCurrentUser']);
                        data.data['allUser'].forEach(function (val) {
                            //     alert("11--val.name : " + val.name)
                            html = html + '<option value= "' + val.name + '">' + val.name + '</option>';
                        });
                        $('#userList').empty();
                        $('#userList').append(html);
                        let admins = new Array();
                        data.data['admin'].forEach(function (val) {
                            admins.push(val.uid);
                            //alert("val.uid : "+val.uid)
                        });
                        $('#userList').selectpicker('val', admins);
                        $('#userList').selectpicker('refresh');
                        $('#addAdminModal').modal('show');
                    } else {
                        alert(data.message);
                    }
                }
            });
        }

        $('#addAdminModal [name="submit"]').on('click', function () {
            let uids = $('#userList').val();
            $.ajax({
                url: base_url + "/scheduleCenter/updatePermission",
                type: "post",
                data: {
                    uIdS: JSON.stringify(uids),
                    id: focusId,
                    type: isGroup
                },
                success: function (data) {
                    layer.msg(data.message);
                    window.setTimeout(leftClick, 100);
                    leftClick()
                }
            })
        });


        $('#jobOperate [name="jobDag"]').on('click', function () {
            $('#jobDagModal').modal('show');
            $('#item').val($('#jobMessage [name="id"]').val());
            keypath(0);
        });

        $("#groupOperate [name='addGroup']").on('click', function () {
            $('#addGroupModal [name="groupName"]').val("");
            $('#addGroupModal [name="groupType"]').val("0");
            $('#addGroupModal').modal('show');
        });

        $('#addGroupModal [name="addBtn"]').on('click', function () {
            $.ajax({
                url: base_url + "/scheduleCenter/addGroup.do",
                type: "post",
                data: {
                    name: $('#addGroupModal [name="groupName"]').val(),
                    directory: $('#addGroupModal [name="groupType"]').val(),
                    parentId: focusId
                },
                success: function (data) {
                    $('#addGroupModal').modal('hide');
                    if (data.success == true) {
                        setCurrentId(data.message);
                        location.reload(false);
                    } else {
                        alert(data.message);
                    }
                }
            })
        });

        /**
         * 版本生成
         */
        $('#jobOperate [name="version"]').on('click', function () {

            $.ajax({
                url: base_url + "/scheduleCenter/generateVersion",
                data: {
                    jobId: focusId
                },
                type: "post",
                success: function (res) {
                    layer.msg(res);
                },
                error: function (err) {
                    layer.msg(err);
                }
            })
        });
        /**
         * 任务开启关闭按钮
         */
        $('#jobOperate [name="switch"]').on('click', function () {
            changeSwitch(focusId, focusItem.auto === "开启" ? 0 : 1);
        });


        /**
         * 任务失效按钮
         */
        $('#jobOperate [name="invalid"]').on('click', function () {
            //回显
            changeSwitch(focusId, 2);
        });

        function changeSwitch(id, status) {
            $.ajax({
                url: base_url + "/scheduleCenter/updateSwitch",
                data: {
                    id: id,
                    status: status
                },
                type: "post",
                success: function (data) {
                    if (data.success === false) {
                        layer.msg(data.message);
                    } else {
                        layer.msg(data.message);
                        leftClick();
                    }
                }
            })
        }

        /**
         * 任务监控按钮
         */
        $('#jobOperate [name="monitor"]').on('click', function () {

            /* alert("scheduleCenter.js 305行 focusItem.focus ： " + focusItem.focus);
             alert("scheduleCenter.js 306行 focusId ： " + focusId);*/
            // focusItem.focus="true";

            if (focusItem.focus) {
                $.ajax({
                    url: base_url + "/scheduleCenter/delMonitor",
                    data: {
                        id: focusId
                    },
                    type: "post",
                    success: function (data) {
                        leftClick();
                        if (data.success == false) {
                            alert(data.message);
                        }
                    }
                })
            } else {
                $.ajax({
                    url: base_url + "/scheduleCenter/addMonitor",
                    data: {
                        id: focusId
                    },
                    type: "post",
                    success: function (data) {
                        leftClick();
                        if (data.success == false) {
                            alert(data.message);
                        }
                    }
                })
            }

        });


        /**
         * 主动添加关注者
         */
        $('#jobOperate [name="AddMonitor"]').on('click', function () {
            AddMonitor()
        });


        function AddMonitor() {

            $.ajax({
                url: base_url + "/scheduleCenter/getJobOperator",
                type: "get",
                data: {
                    jobId: focusId,
                    type: isGroup
                },
                success: function (data) {
                    if (data.success) {
                        let html = '';
                        data.data['allUser'].forEach(function (val) {
                            html = html + '<option value= "' + val.name + '">' + val.name + '</option>';
                        });
                        $('#userListMonitor').empty();
                        $('#userListMonitor').append(html);
                        let monitors = new Array();
                        var names = data.data['monitor'];

                        if (names !== null && names.length > 0) {
                            var name = names.split(",");
                            name.forEach(function (val) {
                                monitors.push(val);
                            });
                        }
                        $('#userListMonitor').selectpicker('val', monitors);
                        $('#userListMonitor').selectpicker('refresh');
                        $('#AddMonitorModal').modal('show');
                    } else {
                        alert(data.message);
                    }
                }
            });
        }

        $('#AddMonitorModal [name="submit"]').on('click', function () {

            let userListMonitor = $('#userListMonitor').val();
            //alert("submit userListMonitor :"+userListMonitor)
            //alert("focusId :"+focusId)

            $.ajax({
                url: base_url + "/scheduleCenter/addMonitorByOwner",
                data: {
                    names: JSON.stringify(userListMonitor),
                    id: focusId
                },
                type: "post",
                success: function (data) {
                    leftClick();
                    if (data.success == false) {
                        alert(data.message);
                    }
                }
            })
        });

        /**
         * 添加任务按钮的初始化操作
         */
        $('#groupOperate [name="addJob"]').on('click', function () {
            $('#addJobModal .modal-title').text(focusItem.name + "下新建任务");
            $('#addJobModal [name="jobName"]').val("");
            $('#addJobModal [name="jobType"]').val("MapReduce");
            $('#addJobModal').modal('show');
        });
        /**
         * 确认添加任务
         */

        $('#addJobModal [name="addBtn"]').on('click', function () {
            let name = $('#addJobModal [name="jobName"]').val();
            let type = $('#addJobModal [name="jobType"]').val();
            if (name == undefined || name == null || name.trim() == "") {
                alert("任务名不能为空");
                return;
            }
            $.ajax({
                url: base_url + "/scheduleCenter/addJob.do",
                type: "post",
                data: {
                    name: name,
                    runType: type,
                    parentId: focusId
                },
                success: function (data) {
                    if (data.success == true) {
                        //将新产生的任务id
                        setCurrentId(data.message)
                        location.reload(false);
                        //自动关注任务
                        autoAddMonitorSelf(data.message);
                        //自动添加管理员
                        //alert("开始加管理员")
                        autoAddAdminSelf(data.message);
                        //alert("加管理员完成")
                    } else {
                        alert(data.message);
                    }
                }
            })

        });

        //自动关注任务
        function autoAddMonitorSelf(newJobId) {
            $.ajax({
                url: base_url + "/scheduleCenter/addMonitor",
                data: {
                    id: newJobId
                },
                type: "post",
                success: function (data) {
                    //leftClick();
                    //alert(data.message);
                    if (data.success == false) {
                        //alert("435")
                        //alert(data.message);
                        //alert("437")
                    }
                }
            })
        }


        //自动添加管理员
        function autoAddAdminSelf(newJobId) {

            var uids = $("#getCurrentUser").text();
            //alert("55 uids  :" + uids)
            //alert("55 id: focusId :" + newJobId)
            //alert("55 type: isGroup :" + isGroup)
            /* let uids2 = $('#userList').val();
             alert("55-- uids2 : " + uids2);*/
            $.ajax({
                url: base_url + "/scheduleCenter/updatePermissionSelf",
                type: "post",
                data: {
                    uIdS: uids,
                    id: newJobId,
                    type: false
                },
                success: function (data) {
                    //       layer.msg(data.message);
                    //       window.setTimeout(leftClick, 100);
                }
            })
        }


        /**
         * 选择框事件 动态设置编辑区
         */
        $('#jobMessageEdit [name="scheduleType"]').change(function () {
            let status = $(this).val();
            //定时调度
            if (status == 0) {
                setJobMessageEdit(true);
            } else if (status == 1) {//依赖调度
                setJobMessageEdit(false);
            }
        })

        $('#keyWords').on('keydown', function (e) {
            //alert("1 :" + e.keyCode)
            if (e.keyCode == '13') {
                //alert("值 :" + $.trim($(this).val()))
                //alert("length :" + $('#keyWords').val().length);
                //searchNodeLazy($.trim($(this).val()), focusTree, "keyWords", false);
                if ($('#keyWords').val().length > 0) {
                    //alert($.trim($(this).val()) + "--" + focusTree + "--" + "keyWords" + "--" + "false")
                    searchNodeLazy($.trim($(this).val()), focusTree, "keyWords", false);
                } else {
                    //搜索框里为空，页面刷新
                    location.reload(false);
                }
            }
        });


        $('#dependKeyWords').on('keydown', function (e) {
            if (e.keyCode == '13') {
                searchNodeLazy($.trim($(this).val()), dependTreeObj, "dependKeyWords", false);
            }
        });
        let timeoutId;

        function searchNodeLazy(key, tree, keyId, first) {
            let searchInfo = $('#searchInfo');
            let deSearchInfo = $('#deSearchInfo');
            let isDepen = tree === $.fn.zTree.getZTreeObj("jobTree") || tree === $.fn.zTree.getZTreeObj('allTree');
            if (key == null || key === "" || key === undefined) {
                return;
            }
            if (isDepen) {
                searchInfo.show();
                searchInfo.text('查找中，请稍候...');
            } else {
                deSearchInfo.show();
                deSearchInfo.text('查找中，请稍候...');
            }

            if (timeoutId) {
                clearTimeout(timeoutId);
            }
            timeoutId = setTimeout(function () {
                search(key); //lazy load ztreeFilter function
                $('#' + keyId).focus();
            }, 50);

            function search(key) {
                //alert("key :"+key)
                let keys, length;
                if (key !== null && key !== "" && key !== undefined) {
                    keys = key.split(" ");
                    length = keys.length;
                    let nodeShow = tree.getNodesByFilter(filterNodes);

                    //alert("nodeShow :"+nodeShow)

                    if (nodeShow && nodeShow.length > 0) {
                        nodeShow.forEach(function (node) {
                            expandParent(node, tree);
                        });
                        if (isDepen) {
                            searchInfo.hide();
                        } else {
                            deSearchInfo.hide();
                        }
                        tree.refresh();
                    } else {
                        if (isDepen) {
                            searchInfo.text('未找到该节点');
                        } else {
                            deSearchInfo.text('未找到该节点');
                        }
                        layer.msg("如果是新加节点，请刷新网页后再搜索一次哟");
                    }
                }

                function filterNodes(node) {

                    //alert("Object.keys(node) : "+Object.keys(node))
                    // alert( "node.jobDescription :" +node.jobDescription )
                    for (let i = 0; i < length; i++) {
                        //id搜索
                        if (!isNaN(keys[i])) {
                            //alert("id搜索 " + node.jobId +" : "+keys[i] +" : "+length)
                            if (node.jobId == keys[i]) {
                                if (isDepen) {
                                    tree.checkNode(node, true, true, false);
                                    node.isParent ? node.highlight = 1 : node.highlight = 2;
                                    tree.showNode(node);
                                    if (i === 0) {
                                        tree.selectNode(node);
                                    }
                                } else {
                                    if (!node.isParent) {
                                        node.highlight = 2;
                                        tree.showNode(node);
                                        if (node.name === '0-1. tmp_tab(1218)' && node.checked === false) {
                                            console.log('start node unchecked');
                                        }
                                        if (first) tree.checkNode(node, true, true, false);
                                    }
                                }
                                return true;
                            }
                        }

                        {//name搜索
                            //  alert("name搜索")
                            //  alert("node.jobName : "+node.jobName)
                            if (node.jobName.indexOf(keys[i]) != -1) {
                                if (isDepen) {
                                    node.isParent ? node.highlight = 1 : node.highlight = 2;
                                    tree.showNode(node);
                                    tree.checkNode(node, true, true, false);
                                    if (i === 0) {
                                        tree.selectNode(node);
                                    }
                                } else {
                                    if (!node.isParent) {
                                        node.highlight = 2;
                                        tree.showNode(node);
                                        if (first) tree.checkNode(node, true, true, false);
                                    }
                                }
                                return true;
                            }
                        }

                        {//descript搜索
                            //  alert("descript搜索")
                            if (node.jobDescription !== null && node.jobDescription.indexOf(keys[i]) != -1) {
                                if (isDepen) {
                                    node.isParent ? node.highlight = 1 : node.highlight = 2;
                                    tree.showNode(node);
                                    tree.checkNode(node, true, true, false);
                                    if (i === 0) {
                                        tree.selectNode(node);
                                    }
                                } else {
                                    if (!node.isParent) {
                                        node.highlight = 2;
                                        tree.showNode(node);
                                        if (first) tree.checkNode(node, true, true, false);
                                    }
                                }
                                return true;
                            }
                        }

                        {//用户搜索
                            //    alert("用户搜索")
                            if (node.owner !== null && node.owner.indexOf(keys[i]) != -1) {
                                if (isDepen) {
                                    node.isParent ? node.highlight = 1 : node.highlight = 2;
                                    tree.showNode(node);
                                    tree.checkNode(node, true, true, false);
                                    if (i === 0) {
                                        tree.selectNode(node);
                                    }
                                } else {
                                    if (!node.isParent) {
                                        node.highlight = 2;
                                        tree.showNode(node);
                                        if (first) tree.checkNode(node, true, true, false);
                                    }
                                }
                                return true;
                            }
                        }

                    }

                    if (node.checked && !node.isParent) {
                        tree.checkNode(node, false, true, false);
                    }
                    if (!first) {
                        tree.hideNode(node);
                    }
                    node.highlight = 0;
                    return false;
                }

                /*  function filterNodesSelf(node) {
                 for (let i = 0; i < length; i++) {
                 //id搜索
                 if (!isNaN(keys[i])) {
                 if (isDepen) {
                 tree.checkNode(node, true, true, false);
                 node.isParent ? node.highlight = 1 : node.highlight = 2;
                 tree.showNode(node);
                 if (i === 0) {
                 tree.selectNode(node);
                 }
                 } else {
                 if (!node.isParent) {
                 node.highlight = 2;
                 tree.showNode(node);
                 if (node.name === '0-1. tmp_tab(1218)' && node.checked === false) {
                 console.log('start node unchecked');
                 }
                 if (first) tree.checkNode(node, true, true, false);
                 }
                 }
                 return true;
                 }
                 }

                 if (node.checked && !node.isParent) {
                 tree.checkNode(node, false, true, false);
                 }
                 if (!first) {
                 tree.hideNode(node);
                 }
                 node.highlight = 0;
                 return false;
                 }*/

            }
        }

        //todo 获取首页标识


        /* function searchNodeLazySelf(key, tree, keyId, first) {
         let searchInfo = $('#searchInfo');
         let deSearchInfo = $('#deSearchInfo');
         let isDepen = tree === $.fn.zTree.getZTreeObj('allTree');
         if (key == null || key === "" || key === undefined) {
         // return;
         }
         //isDepen=false;
         //alert("isDepen : "+isDepen)
         if (isDepen) {
         searchInfo.show();
         searchInfo.text('查找中，请稍候...');
         } else {
         deSearchInfo.show();
         deSearchInfo.text('查找中，请稍候...');
         }

         if (timeoutId) {
         clearTimeout(timeoutId);
         }
         timeoutId = setTimeout(function () {
         searchSelf(key); //lazy load ztreeFilter function
         $('#' + keyId).focus();
         }, 50);

         function searchSelf(key) {
         let keys, length;
         // if (key !== null && key !== "" && key !== undefined) {
         //keys = key.split(" ");
         // length = keys.length;
         // let nodeShow = tree.getNodesByFilter(filterNodesSelf);
         let nodeShow = tree.getNodes();
         if (nodeShow && nodeShow.length > 0) {
         nodeShow.forEach(function (node) {
         expandParent(node, tree);
         });
         if (isDepen) {
         searchInfo.hide();
         } else {
         deSearchInfo.hide();
         }
         tree.refresh();
         } else {
         if (isDepen) {
         searchInfo.text('未找到该节点');
         } else {
         deSearchInfo.text('未找到该节点');
         }
         layer.msg("如果是新加节点，请刷新网页后再搜索一次哟");
         }
         // }

         function filterNodesSelf(node) {
         for (let i = 0; i < length; i++) {
         //id搜索
         if (!isNaN(keys[i])) {
         //alert("id搜索 " + node.jobId +" : "+keys[i] +" : "+length)
         if (node.jobId == keys[i]) {
         if (isDepen) {
         tree.checkNode(node, true, true, false);
         node.isParent ? node.highlight = 1 : node.highlight = 2;
         tree.showNode(node);
         if (i === 0) {
         tree.selectNode(node);
         }
         } else {
         if (!node.isParent) {
         node.highlight = 2;
         tree.showNode(node);
         if (node.name === '0-1. tmp_tab(1218)' && node.checked === false) {
         console.log('start node unchecked');
         }
         if (first) tree.checkNode(node, true, true, false);
         }
         }
         return true;
         }
         } else {//name搜索
         return true;
         }
         }

         if (node.checked && !node.isParent) {
         tree.checkNode(node, false, true, false);
         }
         if (!first) {
         tree.hideNode(node);
         }
         node.highlight = 0;
         return true;
         }

         }
         }*/

        function expandParent(node, obj) {
            if (node) {
                let path = node.getPath();
                if (path && path.length > 0) {
                    for (let i = 0; i < path.length - 1; i++) {
                        obj.showNode(path[i]);
                        obj.expandNode(path[i], true);
                    }
                }
            }
        }

        /**
         * 动态变化任务编辑界面
         * @param val
         */
        function setJobMessageEdit(val) {
            let status1 = "block", status2 = "none";
            if (!val) {
                status1 = "none";
                status2 = "block";
            }
            $("#jobMessageEdit [name='cronExpression']").parent().parent().css("display", status1);
            $("#jobMessageEdit [name='dependencies']").parent().parent().css("display", status2);
            $("#jobMessageEdit [name='heraDependencyCycle']").parent().parent().css("display", status2);
        }

        /**
         * 编辑返回
         */
        $('#editOperator [name="back"]').on('click', function () {

            $("#responseResult").html("");
            leftClick();
        });
        /**
         * 上传文件
         */
        $('#editOperator [name="upload"]').on('click', function () {
            uploadFile();
        });
        $('#editOperator [name="upload"]').on('click', function () {
            closeUploadFile();
        });
        $('#editOperator [name="editUploadFile"]').on('click', function () {
            $("#editUploadFile").modal('show');
        });
        $('#overwriteScript').on('click', function () {
            //     alert("overwriteScript start ...");
            //     var ReScript = $("#responseResult").text;
            //     alert("ReScript: "+ReScript)
            var responseResultVal = $("#responseResult").html()
            //    alert("responseResultVal: "+responseResultVal)
            /*脚本填充*/
            //    var st81 = responseResultVal.toString().replace("/<br\/>/g", "\n");
            var st81 = responseResultVal.toString().replace(/<br>/g, "\n").replace(/<br\/>/g, "\n").replace(/<\/br>/g, "\n");
            //    alert("st81: "+st81)
            codeMirror.setValue(st81)
            //    alert($("#responseResult").html());
            //   $("#responseResult").html("");
            //   $("#responseResult").html("");
            //   alert("overwriteScript stop ...");
        });
        /* 自己编写的脚本生成逻辑*/
        $('#create-script-btn1').on('click', function () {
            //alert("自己编写的脚本生成逻辑");
            let selfScript = $("#edit-script-content").val();
            var name = prompt("输入文件名。不要出现汉字，并确保正确的后缀名（.sh .sql 或者 .py）"); //在页面上弹出提示对话框
            if ((name == null || name == undefined || name == '')) {
                alert("文件名不能为空")
                return;
            }
            var index1 = name.lastIndexOf(".") + 1;
            var index2 = name.length;
            var suffix = name.substring(index1, index2);//后缀名
            var f = (suffix == 'sql') || (suffix == 'sh') || (suffix == 'py')
            if (!f) {
                alert("文件名后缀不正确,请确保正确的后缀名（.sh .sql 或者 .py）");
                return;
            }
            //上传编辑好的资源文件
            uploadEditScriptToFile(name, selfScript);
            //上传编辑好的资源文件

        });

        //编辑好的文本生成hdfs文件
        function uploadEditScriptToFile(name, selfScript) {
            $("#test-run-btn1-result").html("脚本生成中。。。");
            var str = selfScript;
            $.ajax({
                url: base_url + "/editUploadFile/return.do",
                type: "post",
                async: true,
                data: {
                    name: name,
                    selfScript: selfScript
                },
                success: function (data) {
                    //    alert(" return data : "+ data)
                    $("#test-run-btn1-result").html(data);
                }
            });
        }

        //新编辑生成的脚本覆盖开发界面脚本
        $('#overwrite-script-btn1').on('click', function () {
            //  $("#test-run-btn1-result").html();
            codeMirror.setValue($("#test-run-btn1-result").html());
        });

        /**
         * 保存按钮
         */
        $('#editOperator [name="save"]').on('click', function () {

            if (!isGroup) {
                //alert("---"+$('#jobMessageEdit form').serialize())
                $.ajax({
                    url: base_url + "/scheduleCenter/updateJobMessage.do",
                    data: $('#jobMessageEdit form').serialize() + "&selfConfigs=" + encodeURIComponent(selfConfigCM.getValue()) +
                    "&script=" + encodeURIComponent(codeMirror.getValue()) +
                    "&id=" + focusId,
                    type: "post",
                    success: function (data) {
                        if (data.success == false) {
                            layer.msg(data.message)
                        } else {
                            leftClick();
                        }
                    }
                });
            } else {
                $.ajax({
                    url: base_url + "/scheduleCenter/updateGroupMessage.do",
                    data: $('#groupMessageEdit form').serialize() + "&selfConfigs=" + encodeURIComponent(selfConfigCM.getValue()) +
                    "&resource=" + "&groupId=" + focusId,
                    type: "post",
                    success: function (data) {
                        if (data.success == false) {
                            layer.msg(data.message);
                        } else {
                            leftClick();
                        }
                    }
                });
            }
        });
        //组编辑
        $('#groupOperate [name="edit"]').on('click', function () {
            formDataLoad("groupMessageEdit form", focusItem);
            changeGroupStyle(0);
        });
        //删除
        $('[name="delete"]').on('click', function () {
            layer.confirm("确认删除 :" + focusItem.name + "?", {
                icon: 0,
                skin: 'msg-class',
                btn: ['确定', '取消'],
                anim: 0
            }, function (index, layero) {
                $.ajax({
                    url: base_url + "/scheduleCenter/deleteJob.do",
                    data: {
                        id: focusId,
                        isGroup: isGroup
                    },
                    type: "post",
                    success: function (data) {
                        layer.msg(data.message);
                        if (data.success == true) {
                            let parent = selected.getParentNode();
                            focusTree.removeNode(selected);
                            expandParent(parent, focusTree);
                            focusTree.selectNode(parent);
                            leftClick();
                        }
                    }
                });
                layer.close(index)
            }, function (index) {
                layer.close(index)
            });
        });

        function changeGroupStyle(status) {
            let status1 = "none", status2 = "block";
            if (status != 0) {
                status1 = "block";
                status2 = "none";
            }
            selfConfigCM.setOption("readOnly", status != 0);
            $('#groupMessage').css("display", status1);
            $('#groupOperate').css("display", status1);
            $('#groupMessageEdit').css("display", status2);
            $('#editOperator').css("display", status2);
            $("#config").css("display", "block");
        }

        function initVal(configs, dom) {
            let val, userConfigs = "";
            //首先过滤内置配置信息 然后拼接用户配置信息
            for (let key in configs) {
                val = configs[key];
                if (key === "roll.back.times") {
                    let backTimes = $("#" + dom + " [name='rollBackTimes']");
                    if (dom == "jobMessage") {
                        backTimes.val(val);
                    } else {
                        backTimes.val(val);
                    }
                } else if (key === "roll.back.wait.time") {
                    let waitTime = $("#" + dom + " [name='rollBackWaitTime']");
                    if (dom == "jobMessage") {
                        waitTime.val(val);
                    } else {
                        waitTime.val(val);
                    }
                } else if (key === "run.priority.level") {
                    let level = $("#" + dom + " [name='runPriorityLevel']");
                    if (dom == "jobMessage") {
                        level.val(val == 1 ? "low" : val == 2 ? "medium" : "high");
                    } else {
                        level.val(val);
                    }
                } else if (key === "zeus.dependency.cycle" || key === "hera.dependency.cycle") {
                    let cycle = $("#" + dom + " [name='heraDependencyCycle']");
                    if (dom == "jobMessage") {
                        cycle.val(val);
                    } else {
                        cycle.val(val);
                    }
                } else {
                    userConfigs = userConfigs + key + "=" + val + "\n";
                }
            }
            if (focusItem.cronExpression == null || focusItem.cronExpression == undefined || focusItem.cronExpression == "") {
                $('#jobMessageEdit [name="cronExpression"]').val("0 0 3 * * ?");
            }
            return userConfigs;
        }

        //搜索结果节点颜色改变
        function getFontCss(treeId, treeNode) {
            if (treeNode.highlight === 1) {
                return {
                    color: "#37a64d",
                    "font-weight": "bold"
                };
            } else if (treeNode.highlight === 2) {
                return {
                    color: "#A60000",
                    "font-weight": "bold"
                };
            } else {
                return {
                    color: "rgba(0, 0, 0, 0.65)",
                    "font-weight": "normal"
                };
            }
        }

        function beforeDrop(treeId, treeNodes, targetNode, moveType) {
            let node = treeNodes[0];

            //inner
            if (moveType === 'inner') {
                if (targetNode.directory === node.directory && node.directory === null) {
                    layer.msg("任务无法放到任务节点内");
                    return false;
                }

                if (targetNode.directory === null || (targetNode.directory === 1 && node.directory === 0)) {
                    layer.msg("大节点无法放在小节点内");
                    return false;
                }

                return moveNode(node, targetNode.id);
            } else {
                if (targetNode.directory !== node.directory) {
                    layer.msg("两个节点的级别不同，无法移动");
                    return false;
                }
                return moveNode(node, targetNode.parent);
            }
        }

        function moveNode(node, parent) {
            let res = false;
            $.ajax({
                url: base_url + '/scheduleCenter/moveNode',
                data: {
                    id: node.id,
                    parent: parent,
                    lastParent: node.parent
                },
                async: false,
                success: function (data) {
                    res = data.success;
                }
            });
            if (res) {
                layer.msg("移动节点[" + node.name + "]成功");
            } else {
                layer.msg("移动节点[" + node.id + "]失败");
            }
            return res;
        }

        function beforeDrag(treeId, treeNodes) {
            if (treeNodes.length > 1) {
                layer.msg("不允许同时拖动多个任务");
                return false;
            }
            let check = false;
            $.ajax({
                url: base_url + '/scheduleCenter/check',
                data: {
                    id: treeNodes[0].id
                },
                async: false,
                success: function (data) {
                    check = data.data;
                }
            });
            if (!check) {
                layer.msg("抱歉，无权限移动该任务");
            }
            return check;
        }

        //   let outJobIdSelf;
        function leftClick() {
            //alert("leftClick() start")
            $("#test-run-btn1-result").html("")
            $("#edit-script-content").html("")

            selected = focusTree.getSelectedNodes()[0];
            changeOverview(true);
            if (selected) {
                let id = selected.id;
                let dir = selected.directory;
                focusId = id;
                setCurrentId(focusId);
                //如果点击的是任务节点
                if (dir == null || dir == undefined) {
                    //alert("点击的是任务节点");
                    isGroup = false;
                    $.ajax({
                        url: base_url + "/scheduleCenter/getJobMessage.do",
                        type: "get",
                        async: false,
                        data: {
                            jobId: id
                        },
                        success: function (data) {
                            focusItem = data;
                            if (data.runType == "Shell") {
                                codeMirror.setOption("mode", "text/x-sh");
                            } else {
                                codeMirror.setOption("mode", "text/x-hive");
                            }
                            if (data.script != null) {
                                codeMirror.setValue(data.script);
                            } else {
                                codeMirror.setValue('');
                            }
                            let isShow = data.scheduleType === 0;
                            $('#dependencies').css("display", isShow ? "none" : "");
                            $('#heraDependencyCycle').css("display", isShow ? "none" : "");
                            $('#cronExpression').css("display", isShow ? "" : "none");
                            //alert("data :"+data.runType)
                            formDataLoad("jobMessage form", data);
                            $("#jobMessage [name='scheduleType']").val(isShow ? "定时调度" : "依赖调度");
                            selfConfigCM.setValue(initVal(data.configs, "jobMessage"));
                            $('#jobMessage [name="auto"]').removeClass("label-primary")
                                .removeClass("label-default").removeClass("label-info")
                                .addClass(data.auto === "开启" ? "label-primary" : data.auto === "失效" ? "label-info" : "label-default");


                            $('#jobMessage [name="repeatRun"]').removeClass("label-primary")
                                .removeClass("label-default").addClass(data.repeatRun === 1 ? "label-primary" : "label-default").val(data.repeatRun === 1 ? "是" : "否");

                            $('#jobOperate [name="monitor"]').text(data.focus ? "取消关注" : "关注该任务");

                            let areas = '';
                            $.each(data.areaId.split(","), function (index, id) {
                                if (index === 0) {
                                    areas = allArea[id];
                                } else {
                                    areas = areas + "," + allArea[id];
                                }
                            });

                            $('#jobMessage [name="area"]').val(areas);
                            inheritConfigCM.setValue(parseJson(data.inheritConfig));

                            //隐藏脚本框和编辑按钮
                            hideSomethings()
                        }
                    });
                } else { //如果点击的是组节点

                    // alert("点击的是组节点");
                    isGroup = true;
                    $.ajax({
                        url: base_url + "/scheduleCenter/getGroupMessage.do",
                        type: "get",
                        async: false,
                        data: {
                            groupId: id
                        },
                        success: function (data) {
                            focusItem = data;
                            formDataLoad("groupMessage form", data);
                            inheritConfigCM.setValue(parseJson(data.inheritConfig));
                            selfConfigCM.setValue(parseJson(data.configs));
                        }
                    });
                }

                changeEditStyle(1);
                //组管理
                if (dir != undefined && dir != null) {
                    //设置操作菜单
                    $("#groupOperate").attr("style", "display:block");
                    $("#jobOperate").attr("style", "display:none");
                    let jobDisabled;
                    //设置按钮不可用
                    $("#groupOperate [name='addJob']").attr("disabled", jobDisabled = dir == 0);
                    $("#groupOperate [name='addGroup']").attr("disabled", !jobDisabled);
                    //设置任务相关信息不显示
                    $("#script").css("display", "none");
                    $("#jobMessage").css("display", "none");
                    $("#groupMessage").css("display", "block");
                } else { //任务管理
                    $("#groupOperate").css("display", "none");
                    $("#groupMessage").css("display", "none");
                    $("#jobOperate").css("display", "block");
                    $("#script").css("display", "block");
                }
                $("#config").css("display", "block");
                $("#inheritConfig").css("display", "block");
                refreshCm();
            }


        }

        //隐藏脚本框和编辑按钮
        function hideSomethings() {
            //document.getElementById("config").style.display = "block";
            document.getElementById("scriptdivs").style.display = "block";
            //document.getElementById("inheritConfig").style.display = "block";

            var CurrentUser = $("#getCurrentUser").text();
            //alert("CurrentUser :" + CurrentUser)
            var newJobId = localStorage.getItem("defaultId");
            //alert("localStorage.getItem(defaultId) :" + newJobId);
            let hideFlag;
            $.ajax({
                url: base_url + "/scheduleCenter/findByTargetIdSelf",
                type: "post",
                data: {
                    id: newJobId
                },
                success: function (data) {
                    hideFlag = data;
                    if (hideFlag) {
                        document.getElementById("scriptdivs").style.display = "none";
                        //document.getElementById("config").style.display = "none";
                        //document.getElementById("scriptdivs").style.display = "none";
                        //document.getElementById("inheritConfig").style.display = "none";
                        //$('#jobOperate [name="edit"]').attr("style", "display:none;")
                    }
                }
            })
        }


        function parseJson(obj) {
            let res = "";
            for (let x in obj) {
                res = res + x + "=" + obj[x] + "\n";
            }
            return res;
        }

        $("#manual").click(function () {
            triggerType = 1;
            setAction();
        });

        $("#manualRecovery").click(function () {
            triggerType = 2;
            setAction();
        });

        function sleep(numberMillis) {
            var now = new Date();
            var exitTime = now.getTime() + numberMillis;
            while (true) {
                now = new Date();
                if (now.getTime() > exitTime)
                    return;
            }
        }

        /* $("#manualForceRecovery").click(function () {
         //alert("focusId :"+focusId);
         //let jobId;
         $.ajax({
         url: base_url + "/scheduleCenter/manualForce.do",
         type: "get",
         data: {
         jobId: focusId
         },
         success: function (res) {
         if (res.success === true) {
         layer.msg('执行成功');
         } else {
         layer.msg(res.message)
         }
         },
         error: function (err) {
         layer.msg(err);
         }
         });
         });*/


        // 强制恢复
        $("#manualForceRecovery").click(function () {
            $.ajax({
                url: base_url + "/scheduleCenter/manualForceRecovery.do",
                async: true,
                type: 'get',
                //async:false,
                data: {
                    taskId: focusId
                },
                success: function (data) {
                    if (data.success) {
                        //  alert("强制恢复开始:" + data.message + " : " + data.data);
                        if (data.data.indexOf(",")) {
                            //alert("多个任务" + data.data);
                            if (!confirm("确认执行以下任务?\n" + data.data.replace(/,/g, '\n'))) {
                                // alert("取消了")//alert("确认了")
                                return;
                            } else {
                                var taskArray = data.data.split(",");
                                var flag = true;
                                for (j = 0, len = taskArray.length; j < len; j++) {
                                    //具体某个任务 taskArray[j]
                                    //alert("强制恢复" + taskArray[j] + "中")
                                    //window.setTimeout( layer.msg("强制恢复" + taskArray[j] + "中"), 0);
                                    //changeShowDiv(taskArray[j]);
                                    //window.setTimeout(changeShowDiv(taskArray[j]), 0);
                                    // $('.dp-model-alert').text("强制恢复"+taskArray[j]+"中").show();
                                    // $('.dp-model-alert').show().delay(10000).hide(1000);//1000 表示展示1秒后消失
                                    forceOneRun(taskArray[j])
                                    var status = forceRunGetStatusById(taskArray[j]);
                                    if (status.indexOf("success") > -1) {
                                        //alert(taskArray[j] + "恢复成功")
                                        //$('.dp-model-alert').hide()
                                    } else {
                                        //$('.dp-model-alert').hide()
                                        //layer.msg(taskArray[j] + "强制恢复失败，请检查该任务");
                                        alert(taskArray[j] + "强制恢复失败，请检查该任务")
                                        window.setTimeout(layer.msg(taskArray[j] + "强制恢复失败，请检查该任务"), 10);
                                        flag = false;
                                        break;
                                    }
                                    //   $('.dp-model-alert').hide()
                                }
                                if (flag) {
                                    layer.msg("强制恢复成功");
                                    alert("强制恢复成功");
                                }
                            }
                        } else {
                            if (!confirm("确认执行任务：" + data.data)) {
                                // alert("取消了")//alert("确认了")
                                return;
                            } else {
                                forceRun(data.data);
                                //alert("进入检查")
                                sleep(3000);
                                var status = forceRunGetStatusById(data.data);
                                // alert(" status :" + status)
                                while (status.indexOf("running") > -1) {
                                    sleep(2000);
                                    status = forceRunGetStatusById(data.data);
                                }
                                if (status.indexOf("success") > -1) {
                                    alert(data.data + "恢复成功")
                                } else {
                                    alert(data.data + "恢复失败，请检查该任务")
                                }
                            }
                        }
                    } else {
                        alert(data.message + "\n" + data.data)
                        layer.msg("强制恢复失败");
                    }
                }
            })
        })


        /*        function changeShowDiv(taskId) {
         alert("修改")
         $('.dp-model-alert').text("强制恢复" + taskId + "中").show();
         alert("修改好了")
         }*/

        function forceRunGetStatusById(taskId) {
            var forceRunStatus;
            $.ajax({
                url: base_url + "/scheduleCenter/forceRunGetStatusById.do",
                type: "get",
                async: false,
                data: {
                    taskId: taskId,
                },
                success: function (data) {
                    //alert("forceRunStatus :" + data);
                    forceRunStatus = data;
                    //layer.msg(data);
                },
                error: function (data) {
                    layer.msg(data + " 获取状态失败");
                }
            });
            return forceRunStatus;
        }

        function forceOneRun(taskId) {

            //    if (!confirm("确认执行任务：" + taskId)) {
            //       alert("取消了")//alert("确认了")
            //      return;
            //   } else {
            forceRun(taskId);
            //alert("进入检查")
            sleep(3000);
            var status = forceRunGetStatusById(taskId);
            //alert(" status :" + status)
            while (status.indexOf("running") > -1) {
                sleep(2000);
                status = forceRunGetStatusById(taskId);
            }
            if (status.indexOf("success") > -1) {
                //alert(taskId + "恢复成功")
            } else {
                //alert(taskId + "恢复失败，请检查该任务")
            }
            // }
        }


        function forceRun(taskId) {
            $.ajax({
                url: base_url + "/scheduleCenter/manual.do",
                type: "get",
                data: {
                    actionId: taskId,
                    triggerType: 1
                },
                success: function (res) {
                    if (res.success === true) {
                        //  layer.msg('执行成功');
                    } else {
                        layer.msg(res.message)
                    }
                },
                error: function (err) {
                    layer.msg(err);
                }
            });
        }


        function initMachine() {
            $.ajax({
                url: base_url + '/homePage/getAllWorkInfo',
                type: 'get',
                success: function (data) {
                    //机器选择
                    for (var i in data) {
                        $('#machineList').append('<option value="' + i + '">' + i + '</option>');
                    }
                    info = data;
                    var machine = $('#machineList').val();
                    initInfo(data[machine]);
                }
            })
        }


        $("#myModal .add-btn").click(function () {

            //alert("triggerType:"+ triggerType);
            // alert("actionId :"+ $("#selectJobVersion").val());

            $.ajax({
                url: base_url + "/scheduleCenter/manual.do",
                type: "get",
                data: {
                    actionId: $("#selectJobVersion").val(),
                    triggerType: triggerType
                },
                success: function (res) {
                    if (res.success === true) {
                        layer.msg('执行成功');
                    } else {
                        layer.msg(res.message)
                    }
                },
                error: function (err) {
                    layer.msg(err);
                }
            });
            $('#myModal').modal('hide');
        });


        function getFormatDate() {
            var nowDate = new Date();
            var year = nowDate.getFullYear();
            var month = nowDate.getMonth() + 1 < 10 ? "0" + (nowDate.getMonth() + 1) : nowDate.getMonth() + 1;
            var date = nowDate.getDate() < 10 ? "0" + nowDate.getDate() : nowDate.getDate();
            var hour = nowDate.getHours() < 10 ? "0" + nowDate.getHours() : nowDate.getHours();
            var minute = nowDate.getMinutes() < 10 ? "0" + nowDate.getMinutes() : nowDate.getMinutes();
            // var second = nowDate.getSeconds()< 10 ? "0" + nowDate.getSeconds() : nowDate.getSeconds();
            return year + "" + month + "" + date + "" + hour + "" + minute;
        }

        function setAction() {
            //获得版本
            jQuery.ajax({
                url: base_url + "/scheduleCenter/getJobVersion.do",
                type: "get",
                data: {
                    jobId: focusId
                },
                success: function (data) {
                    if (data.success === false) {
                        alert(data.message);
                        return;
                    }
                    let jobVersion = "";
                    var flag = true;

                    data.forEach(function (action, index) {

                        if (action.status == "failed") {/*红*/
                            if (flag) {
                                jobVersion += '<option value="' + action.id + '"  style="color: #f9602c" selected>' + action.id + '</option>';
                                flag = false;
                            } else {
                                jobVersion += '<option value="' + action.id + '"  style="color: #f9602c" >' + action.id + '</option>';
                            }
                        } else if (action.status == "no") {/*黄*/
                            var at = action.id.substring(0, 12)
                            var lt = getFormatDate();
                            if (at <= lt && flag) {
                                jobVersion += '<option value="' + action.id + '" style="color: #F4C20B" selected>' + action.id + '</option>';
                                flag = false;
                            } else if (at <= lt && !flag) {
                                jobVersion += '<option value="' + action.id + '" style="color: #F4C20B">' + action.id + '</option>';
                            } else {
                                jobVersion += '<option value="' + action.id + '" >' + action.id + '</option>';
                            }
                        } else {/*绿*/
                            jobVersion += '<option value="' + action.id + '" style="color: #61CE3C">' + action.id + '</option>';
                        }
                    });
                    let jobVer = $('#selectJobVersion');
                    jobVer.empty();
                    jobVer.append(jobVersion);
                    jobVer.selectpicker('refresh');
                    $('#myModal').modal('show');
                }
            });
        }


        let zNodes;
        let firstAllTreeInit = true;
        let firstMyTreeInit = true;

        $(document).ready(function () {

                $.ajax({
                    url: base_url + "/scheduleCenter/getAllArea",
                    async: false,
                    type: "get",
                    success: function (data) {
                        let areaOption = '';
                        $.each(data.data, function (index, area) {
                            /* alert("area:"+area)*/
                            allArea[area.id] = area.name;
                            if (area.name == "中国") {
                                areaOption = areaOption + '<option value="' + area.id + '" selected>' + area.name + '</option>';
                            } else {
                                areaOption = areaOption + '<option value="' + area.id + '">' + area.name + '</option>';
                            }
                        });
                        let areas = $('#jobMessageEdit [name="areaId"]');
                        areas.empty();
                        areas.append(areaOption);
                        areas.selectpicker('refresh');
                    }
                });
                zNodes = getDataByPost(base_url + "/scheduleCenter/init.do");
                $('#allScheBtn').click(function (e) {
                    e.stopPropagation();
                    allJobTree();
                    localStorage.setItem("taskGroup", 'all');
                });

                $('#myScheBtn').click(function (e) {
                    e.stopPropagation();
                    myJobTree();
                    localStorage.setItem("taskGroup", 'mySelf');
                });
                $.each($(".content .row .height-self"), function (i, n) {
                    $(n).css("height", (screenHeight - 50) + "px");
                });

                let theme = localStorage.getItem("theme");
                if (theme == null) {
                    theme = 'default';
                }
                themeSelect.val(theme);
                codeMirror = CodeMirror.fromTextArea(editor[0], {
                    mode: "text/x-sh",
                    lineNumbers: true,
                    theme: theme,
                    readOnly: true,
                    matchBrackets: true,
                    smartIndent: true,
                    styleActiveLine: true,
                    styleSelectedText: true,
                    nonEmpty: true
                });

                codeMirror.on('keypress', function () {
                    if (!codeMirror.getOption('readOnly')) {
                        codeMirror.showHint({
                            completeSingle: false
                        });
                    }
                });

                selfConfigCM = CodeMirror.fromTextArea($('#config textarea')[0], {
                    mode: "text/x-sh",
                    theme: "base16-light",
                    readOnly: true,
                    matchBrackets: true,
                    smartIndent: true,
                    nonEmpty: true
                });
                inheritConfigCM = CodeMirror.fromTextArea($('#inheritConfig textarea')[0], {
                    mode: "text/x-sh",
                    theme: "base16-light",
                    readOnly: true,
                    matchBrackets: true,
                    smartIndent: true,
                    nonEmpty: true
                });

                codeMirror.setSize('auto', 'auto');
                inheritConfigCM.setSize('auto', 'auto');
                selfConfigCM.setSize('auto', 'auto');

                setDefaultSelectNode();
                getCurrentUserJobBySearch();

                $.ajax({
                    url: base_url + "/scheduleCenter/getHostGroupIds",
                    type: "get",
                    success: function (data) {
                        let hostGroup = $('#jobMessageEdit [name="hostGroupId"]');
                        let option = '';
                        data.forEach(function (val) {
                            option = option + '"<option value="' + val.id + '" >' + val.name + '</option>';
                        });
                        hostGroup.empty();
                        hostGroup.append(option);
                    }
                })
                $('#timeChange').focus(function (e) {
                    e.stopPropagation();
                    $('#timeModal').modal('toggle');
                    let para = $.trim($('#timeChange').val());
                    let arr = para.split(' ');
                    let min = arr[1];
                    let hour = arr[2];
                    let day = arr[3];
                    let month = arr[4];
                    let week = arr[5];
                    $('#inputMin').val(min);
                    $('#inputHour').val(hour);
                    $('#inputDay').val(day);
                    $('#inputMonth').val(month);
                    $('#inputWeek').val(week);
                });
                $('#saveTimeBtn').click(function (e) {
                    e.stopPropagation();
                    let min = $.trim($('#inputMin').val());
                    let hour = $.trim($('#inputHour').val());
                    let day = $.trim($('#inputDay').val());
                    let month = $.trim($('#inputMonth').val());
                    let week = $.trim($('#inputWeek').val());
                    let para = '0 ' + min + ' ' + hour + ' ' + day + ' ' + month + ' ' + week;
                    $('#timeChange').val(para);
                    $('#timeModal').modal('toggle');
                });

                //隐藏
                $('.hideBtn').click(function (e) {
                    e.stopPropagation();
                    $(this).parent().hide();
                })
                //隐藏树
                $('#hideTreeBtn').click(function (e) {
                    e.stopPropagation();
                    if ($(this).children().hasClass('fa-minus')) {
                        $('#treeCon').removeClass('col-md-3 col-sm-3 col-lg-3').addClass('col-md-1 col-sm-1 col-lg-1');
                        $(this).children().removeClass('fa-minus').addClass('fa-plus');
                        $('#infoCon').removeClass('col-md-8 col-sm-8 col-lg-8').addClass('col-md-10 col-sm-10 col-lg-10');
                        $('#showAllModal').removeClass('col-md-8 col-sm-8 col-lg-8').addClass('col-md-10 col-sm-10 col-lg-10');
                    } else {
                        $('#treeCon').removeClass('col-md-1 col-sm-1 col-lg-1').addClass('col-md-3 col-sm-3 col-lg-3');
                        $(this).children().removeClass('fa-plus').addClass('fa-minus');
                        $('#infoCon').removeClass('col-md-10 col-sm-10 col-lg-10').addClass('col-md-8 col-sm-8 col-lg-8');
                        $('#showAllModal').removeClass('col-md-10 col-sm-10 col-lg-10').addClass('col-md-8 col-sm-8 col-lg-8');

                    }
                })

                $('#nextNode').on("click", function () {
                    let expand = $('#expand').val();
                    if (expand == null || expand == undefined || expand == "") {
                        expand = 0;
                    }
                    expandNextNode(expand);

                });
                $('#expandAll').on("click", function () {
                    //alert("len : "+ len)
                    expandNextNode(len);
                });

            }
        )
        ;
        $('#biggerBtn').click(function (e) {
            e.stopPropagation();
            if ($(this).children().hasClass('fa-plus')) {
                $('#jobDagModalCon').addClass('bigger');
                $(this).children().removeClass('fa-plus').addClass('fa-minus');
            } else {
                $('#jobDagModalCon').removeClass('bigger');
                $(this).children().removeClass('fa-minus').addClass('fa-plus');
            }
        })
        $("#dependJob").bind('click', function () {
            $("#selectDepend").modal('show');
            $('#dependKeyWords').val($(this).val().split(',').join(' '));
            //定时调度
            let setting = {
                view: {
                    fontCss: getFontCss
                },
                check: {
                    enable: true
                },
                data: {
                    simpleData: {
                        enable: true,
                        idKey: "id",
                        pIdKey: "parent",
                        rootPId: 0
                    }
                }
            };
            $.fn.zTree.init($("#dependTree"), setting, zNodes.allJob);
            dependTreeObj = $.fn.zTree.getZTreeObj("dependTree");
            searchNodeLazy($(this).val().split(',').join(' '), dependTreeObj, "dependKeyWords", true);
            $("#chooseDepend").bind('click', function () {
                let nodes = dependTreeObj.getCheckedNodes(true);
                let ids = new Array();
                for (let i = 0; i < nodes.length; i++) {
                    if (nodes[i]['isParent'] == false) {
                        ids.push(nodes[i]['id']);
                    }
                }
                $("#dependJob").val(ids.join(","));
                $("#selectDepend").modal('hide');
            });
            setJobMessageEdit(false);
        });
        $('#showAllModal').modal('hide');


        function allJobTree() {
            $('#jobTree').hide();
            $('#allTree').show();
            $('#allScheBtn').parent().addClass('active');
            $('#myScheBtn').parent().removeClass('active');

            if (firstAllTreeInit) {
                firstAllTreeInit = false;
                $.fn.zTree.init($("#allTree"), setting, zNodes.allJob);
            }
            focusTree = $.fn.zTree.getZTreeObj("allTree");
        }

        function myJobTree() {
            $('#jobTree').show();
            //$('#allTree').show();
            $('#allTree').hide();
            $('#myScheBtn').parent().addClass('active');
            $('#allScheBtn').parent().removeClass('active');
            if (firstMyTreeInit) {
                firstMyTreeInit = false;
                $.fn.zTree.init($("#jobTree"), setting, zNodes.myJob);
            }
            focusTree = $.fn.zTree.getZTreeObj("jobTree");
        }

        function changeOverview(type) {
            let overview = "", notShow = "none";
            if (type) {
                overview = "none";
                notShow = "";
            }
            $('#showAllModal').css("display", overview);
            $('#infoCon').css("display", notShow);
            $('#overviewOperator').css("display", overview);
            $('#groupOperate').css("display", notShow);
        }

        function getCurrentUserJobBySearch() {
            /**
             　　* @Description: TODO 首页点击搜索当前用户job
             　　* @param
             　　* @return
             　　* @throws
             　　* @author lenovo
             　　* @date 2019/11/11 13:20
             　　*/
            let url = base_url + "/scheduleCenter/getCurrentUser.do";
            let parameter;
            $.get(url, parameter, function (data) {
                let syFlagVal = $("#syFlag").val();
                if (syFlagVal == 1) {
                    searchNodeLazy(data, focusTree, "keyWords", false);
                }
                $("#syFlag").val("");
            });
        }

        $('#overviewOperator [name="back"]').click(function () {
            changeOverview(true);

        });
        $('#showAllBtn').click(function () {
            // 表格渲染
            groupTaskType = 0;
            reloadGroupTaskTable();

        });


        $('#groupOperate [name="showRunning"]').on('click', function () {
            groupTaskType = 1;
            reloadGroupTaskTable();
        });

        $('#overviewOperator [name="showRunning"]').on('click', function () {
            groupTaskType = 1;
            reloadGroupTaskTable();
        });

        $('#overviewOperator [name="showFaild"]').on('click', function () {
            groupTaskType = 2;
            reloadGroupTaskTable();
        });

        $('#groupOperate [name="showFaild"]').on('click', function () {
            groupTaskType = 2;
            reloadGroupTaskTable();
        });
        $('#closeAll').click(function (e) {
            $("#showAllModal").modal('hide');
        });

        function reloadGroupTaskTable() {
            changeOverview(false);
            if (!groupTaskTable) {
                groupTaskTable = table.render({
                    elem: '#allTable'                  //指定原始表格元素选择器（推荐id选择器）
                    , height: "full-100"
                    , cols: [[                  //标题栏
                        {field: 'actionId', title: 'ActionId', width: 151}
                        , {field: 'jobId', title: 'JobId', width: 70}
                        , {field: 'name', title: '任务名称', width: 125}
                        , {field: 'status', title: '执行状态', width: 105}
                        , {field: 'readyStatus', title: '依赖状态', width: 340}
                        , {field: 'lastResult', title: '上次执行结果', width: 125}
                    ]]
                    , id: 'dataCheck'
                    , url: base_url + '/scheduleCenter/getGroupTask'
                    , where: {
                        groupId: focusId,
                        type: groupTaskType
                    }
                    , method: 'get'
                    , page: true
                    , limits: [10, 30, 50]
                });
            } else {
                groupTaskTable.reload({
                    where: {
                        groupId: focusId,
                        type: groupTaskType
                    },
                    page: {
                        curr: 1 //重新从第 1 页开始
                    }
                });
            }

        }

    }
);

function keypath(type) {

    //alert("keypath"+type +"len : "+ len)

    //alert("0");
    $('#expandAll').removeClass('active').addClass('disabled');
    //alert("0");

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
        //alert("1");
        initDate(data);
        //alert("1");
        // Set up the edges
        svg = d3.select("svg");
        inner = svg.select("g");

        // Set up zoom support
        zoom = d3.behavior.zoom().on("zoom", function () {
            inner.attr("transform", "translate(" + d3.event.translate + ")" +
                "scale(" + d3.event.scale + ")");
        });
        svg.call(zoom);

        //alert("2");
        redraw();
        //alert("2");

        // expandNextNode(1);
        zoom
            .translate([($('svg').width() - g.graph().width * initialScale) / 2, 20])
            .scale(initialScale)
            .event(svg);
        //svg.attr('height', g.com.dfire.graph().height * initialScale + 40);

        //alert("3");
        $('#expandAll').removeClass('disabled').addClass('active');
        //alert("3");

        //expandNextNode(len);
    }
    jQuery.ajax({
        type: 'POST',
        url: url,
        data: data,
        success: success
        //dataType: 'json'
    });
    //alert("4");
    //expandNextNode(len);
    //alert("4");
}

//$('#expandAll').onclick()


function keypath1(type) {
    // alert("item : "+$("#item")[0].value)
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
    headNode = data.data.headNode;
    len = edges.length;
    currIndex = 0;
    g = new dagreD3.graphlib.Graph().setGraph({});
    g.setNode(headNode.nodeName, {label: headNode.nodeName, style: "fill: #bd16ff" + ";" + headNode.remark})
    let nodeName;
    for (let i = 0; i < len; i++) {
        nodeName = edges[i].nodeA.nodeName;
        if (nodeIndex[nodeName] == null || nodeIndex[nodeName] == undefined || nodeIndex[nodeName] == 0) {
            nodeIndex[nodeName] = i + 1;
        }
    }
}


function expandNextNode(nodeNum) {
    while (nodeNum > 0) {
        if (currIndex < len) {
            let edge = edges[currIndex];
            if (addEdgeToGraph(edge)) {
                nodeNum--;
            }
            currIndex++;
        } else {
            layer.msg("已经全部展示完毕！");
            break;
        }
    }
    redraw();
}


let JobLogTable = function (jobId) {
    let parameter = {jobId: jobId};
    let actionRow;
    let oTableInit = new Object();
    let onExpand = -1;
    let table = $('#runningLogDetailTable');
    let timerHandler = null;

    function scheduleLog() {

        $.ajax({
            url: base_url + "/scheduleCenter/getLog.do",
            type: "get",
            data: {
                id: actionRow.id,
            },
            success: function (data) {
                if (data.status != 'running') {
                    window.clearInterval(timerHandler);
                }
                let logArea = $('#log_' + actionRow.id);
                logArea[0].innerHTML = data.log;
                logArea.scrollTop(logArea.prop("scrollHeight"), 200);
                actionRow.log = data.log;
                actionRow.status = data.status;
            }
        })
    }

    $('#jobLog').on('hide.bs.modal', function () {
        if (timerHandler != null) {
            window.clearInterval(timerHandler)
        }
    });

    $('#jobLog [name="refreshLog"]').on('click', function () {
        table.bootstrapTable('refresh');
        table.bootstrapTable('expandRow', onExpand);
    });

    oTableInit.init = function () {
        table.bootstrapTable({
            url: base_url + "/scheduleCenter/getJobHistory.do",
            queryParams: parameter,
            pagination: true,
            showPaginationSwitch: false,
            search: false,
            cache: false,
            pageNumber: 1,
            showRefresh: true,           //是否显示刷新按钮
            showPaginationSwitch: false,  //是否显示选择分页数按钮
            sidePagination: "server",
            queryParamsType: "limit",
            queryParams: function (params) {
                let tmp = {
                    pageSize: params.limit,
                    offset: params.offset,
                    jobId: jobId
                };
                return tmp;
            },
            pageList: [10, 25, 40, 60],
            columns: [
                {
                    field: "id",
                    title: "id",
                    width: "4%",
                    sortable: true
                }, {
                    field: "actionId",
                    title: "版本号",
                    width: "10%",
                    sortable: true
                }, {
                    field: "jobId",
                    title: "任务ID",
                    width: "6%",
                    sortable: true
                }, {
                    field: "executeHost",
                    title: "执行机器ip",
                    /* width: "8%",*/
                    sortable: true
                }, {
                    field: "status",
                    title: "执行状态",
                    /* width: "8%",*/
                    formatter: function (val) {
                        if (val === 'running') {
                            return '<a class="layui-btn layui-btn-xs" style="width: 100%;">' + val + '</a>';
                        }
                        if (val === 'success') {
                            return '<a class="layui-btn layui-btn-xs" style="width: 100%;background-color:#2f8f42" >' + val + '</a>';
                        }
                        if (val === 'wait') {
                            return '<a class="layui-btn layui-btn-xs layui-btn-warm" style="width: 100%;">' + val + '</a>';
                        }
                        return '<a class="layui-btn layui-btn-xs layui-btn-danger" style="width: 100%;" >' + val + '</a>'
                    },
                    sortable: true
                }, {
                    field: "operator",
                    title: "执行人",
                    width: "8%",
                    sortable: true
                }, {
                    field: "startTime",
                    title: "开始时间",
                    /* width: "12%"*/
                    sortable: true
                }, {
                    field: "endTime",
                    title: "结束时间",
                    /*  width: "12%"*/
                    sortable: true
                }, {
                    field: 'runTime',
                    title: '运行时间',
                    formatter: function (val) {
                        var longFloat = parseFloat(val);
                        if (longFloat >= 3600) {
                            var h = Math.floor(longFloat / 3600);
                            var m = Math.floor(longFloat % 3600 / 60);
                            var s = (longFloat % 60) == 0 ? "" : (longFloat % 60) + "秒";
                            if (m == 0 && s == 0) {
                                return h + '时';
                            } else {
                                return h + '时' + m + '分' + s;
                            }
                        } else if (3600 > longFloat && longFloat > 60) {
                            var mm = Math.floor(longFloat % 3600 / 60);
                            var ss = (longFloat % 60) == 0 ? "" : (longFloat % 60) + "秒";
                            return mm + '分' + ss;
                        } else if (longFloat <= 60) {
                            return longFloat + '秒';
                        } else {
                            return val;
                        }
                    },
                    sortable: true
                },

                {
                    field: "illustrate",
                    title: "说明",
                    /*width: "8%",*/
                    formatter: function (val) {
                        if (val == null) {
                            return val;
                        }
                        return '<label class="label label-default" style="width: 100%;" data-toggle="tooltip" title="' + val + '" >' + val.slice(0, 6) + '</label>';
                    },
                    sortable: true
                },
                {
                    field: "triggerType",
                    title: "触发类型",
                    /* width: "8%",*/
                    formatter: function (value, row) {
                        if (row['triggerType'] == 1) {
                            return "自动调度";
                        }
                        if (row['triggerType'] == 2) {
                            return "手动触发";
                        }
                        if (row['triggerType'] == 3) {
                            return "手动恢复";
                        }
                        return value;
                    },
                    sortable: true
                },
                {
                    field: "status",
                    title: "操作",
                    /*  width: "10%",*/
                    sortable: true,
                    formatter: function (index, row) {
                        let html = '<a href="javascript:cancelJob(\'' + row['id'] + '\',\'' + row['jobId'] + '\')">取消任务</a>';
                        if (row['status'] == 'running') {
                            return html;
                        }
                    }
                }
            ],
            detailView: true,
            detailFormatter: function (index, row) {
                let html = '<form role="form">' + '<div class="form-group" style="background: #2c4762;min-height:600px; overflow:scroll;  ">' + '<div class="form-control"  style="border:none; height:600px; word-break: break-all; word-wrap:break-word; white-space:pre-line;font-family:Microsoft YaHei" id="log_' + row.id + '">'
                    + '日志加载中。。' +
                    '</div>' + '<form role="form">' + '<div class="form-group">';
                return html;
            },
            onExpandRow: function (index, row) {
                actionRow = row;
                if (index != onExpand) {
                    table.bootstrapTable("collapseRow", onExpand);
                }
                onExpand = index;
                if (row.status == "running") {
                    scheduleLog();
                    timerHandler = window.setInterval(scheduleLog, 3000);
                } else {
                    scheduleLog();
                }
            },
            onCollapseRow: function (index, row) {
                window.clearInterval(timerHandler)
            }
        });
    };
    return oTableInit;
};


function selectTheme() {
    let theme = themeSelect.val();
    codeMirror.setOption("theme", theme);
    localStorage.setItem("theme", theme);
}

function cancelJob(historyId, jobId) {
    let url = base_url + "/scheduleCenter/cancelJob.do";
    let parameter = {historyId: historyId, jobId: jobId};
    $.get(url, parameter, function (data) {
        layer.msg(data);
        $('#jobLog [name="refreshLog"]').trigger('click');
    });
}

$('#showScriptSelf').on('click', function () {
    $('#scriptdivs').toggle();
})





