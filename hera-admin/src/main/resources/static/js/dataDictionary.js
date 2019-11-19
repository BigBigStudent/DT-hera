let nodes, edges, g, headNode, currIndex = 0, len, inner, initialScale = 0.75, zoom, nodeIndex = {}, graphType,
    codeMirror, themeSelect = $('#themeSelect'), zTree;
;

layui.use(['table', 'laydate'], function () {
        let metadataMonitor = $('#dataDictionary');
        metadataMonitor.parent().addClass('menu-open');
        metadataMonitor.parent().parent().addClass('menu-open');
        metadataMonitor.addClass('active');
        $('#bigdataMetadata').addClass('active');

        let table = layui.table, laydate = layui.laydate;
        let focusTree;
        let selected, parentNode;
        let tableName2, tableSchema;
        let formData;//form表单数据
        let setting = {
            view: {
                fontCss: getFontCss
            },
            check: {
                enable: true
            },
            callback: {
                onClick: leftClick,
            }

        };

        function getFontCss(treeId, treeNode) {
            /**
             　　* @Description: TODO 搜索结果节点颜色改变
             　　* @param
             　　* @return
             　　* @throws
             　　* @author lenovo
             　　* @date 2019/8/16 15:21
             　　*/
            if (treeNode.checked && treeNode.level) {
                return {
                    color: "#37a64d",
                    "font-weight": "bold"
                };
            } else {
                return {
                    color: "rgba(0, 0, 0, 0.65)",
                    "font-weight": "normal"
                };
            }
        }


        table.on('edit(tableForHive)', function (obj) {
            /**
             　　* @Description: TODO 表格编辑监听
             　　* @param
             　　* @return
             　　* @throws
             　　* @author lenovo
             　　* @date 2019/8/15 18:01
             　　*/
            layer.open({
                skin: 'wyd-class',
                content: '更新提示',
                btn: ['确认更新', '取消更新'],
                yes: function (index, layero) {
                    let cline = obj.data;
                    cline.tableSchema = tableSchema;
                    cline.tableName2 = tableName2;
                    //do somettableSchemahing
                    let json = parseToParam(cline);
                    //alert(json)
                    $.ajax({
                        url: base_url + "/bigdataMetadata/updateDictTable.do",
                        data: json,
                        type: "post",
                        success: function (data) {
                            if (data.success == false) {
                                layer.msg(data.message)
                            } else {
                                //leftClick();
                            }
                        }
                    });
                    layer.close(index); //如果设定了yes回调，需进行手工关闭
                },
                btn2: function (index, layero) {
                    layer.close(index)
                }
            });
        });


        function switchPage(a) {
            /**
             　　* @Description: TODO 编辑和展现页面切换
             　　* @param
             　　* @return
             　　* @throws
             　　* @author lenovo
             　　* @date 2019/8/14 17:17
             　　*/
            if (a == 0) {//展现页面
                $("#tableMessage").css("display", "")
                $("#tableField").css("display", "")
                $("#editTm").css("display", "none")
            } else {//编辑页面
                $("#tableMessage").css("display", "none")
                $("#tableField").css("display", "none")
                $("#editTm").css("display", "")
            }
        }

        function leftClick() {
            /**
             　　* @Description: TODO ztree点击回调事件
             　　* @param
             　　* @return
             　　* @throws
             　　* @author lenovo
             　　* @date 2019/8/14 14:08
             　　*/
            selected = focusTree.getSelectedNodes()[0];
            tableName2 = selected.name;
            if (selected) {
                let level = selected.level;
                if (level == 1) {//table节点
                    setCurrentId(selected.name)
                    switchPage(0)
                    parentNode = selected.getParentNode();
                    tableSchema = parentNode.name;
                    formDataVal(tableName2, tableSchema)
                    tableIns = table.render({
                        elem: '#tableForHive'
                        , height: "full"
                        , url: base_url + '/bigdataMetadata/selectDictTable'
                        , where: {
                            tableSchema: tableSchema,
                            tableName2: tableName2
                        }
                        , page: {
                            curr: 1
                            , limits: [10,20,30,50,100]
                        }
                        , cols: [[ //表头
                            {field: 'id', title: '序列', fixed: 'left', align: 'center', type: 'numbers'}
                            , {field: 'columnName', title: '字段名称', align: 'center', edit: 'text'}
                            , {field: 'columnType', title: '字段类型', align: 'center', edit: 'text'}
                            , {
                                field: 'columnComment', title: '字段注释', align: 'center', templet: function (d) {
                                    if (d.columnComment == null) {
                                        return ""
                                    } else {
                                        return d.columnComment
                                    }
                                }, edit: 'text'
                            }
                            , {
                                field: 'isNull', title: '是否允许为空', align: 'center', templet: function (d) {
                                    if (d.isNull == 1) {
                                        return "允许"
                                    } else if (d.isNull == 0) {
                                        return "不允许"
                                    } else {
                                        return d.isNull
                                    }
                                }, edit: 'text'
                            }
                            , {
                                field: 'columnStatus', title: '字段状态', align: 'center', templet: function (d) {
                                    if (d.columnStatus == 1) {
                                        return "可用"
                                    } else if (d.columnStatus == 0) {
                                        return "废弃"
                                    } else {
                                        return d.columnStatus
                                    }
                                }, edit: 'text'
                            }
                        ]]
                    });
                }
            }
        }


        /**
         * 把当前选中的节点存入localStorage
         * 页面刷新后，会根据"defaultId"设置当前选中的节点
         * 避免页面刷新丢失
         * @param id    节点ID
         */
        function setCurrentId(id) {
            localStorage.setItem("dataDict_node", id);
        }

        $('#keyWords').on('keydown', function (e) {
            if (e.keyCode == '13') {
                if ($('#keyWords').val().length > 0) {
                    searchNodeLazy($.trim($(this).val()), focusTree, "keyWords", false);
                } else {
                    //需处理
                    location.reload(false);
                }
            }
        });
        let timeoutId;

        function searchNodeLazy(key, tree, keyId, first) {
            /**
             　　* @Description: TODO ztree查询功能
             　　* @param
             　　* @return
             　　* @throws
             　　* @author lenovo
             　　* @date 2019/8/16 15:34
             　　*/
            //开始搜索重置check状态
            tree.checkAllNodes(false);
            tree.expandAll(false);
            let searchInfo = $('#searchInfo');
            let deSearchInfo = $('#deSearchInfo');
            let isDepen = tree === $.fn.zTree.getZTreeObj('allTree');
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
                searchKey(key); //lazy load ztreeFilter function
                $('#' + keyId).focus();
            }, 50);

            function searchKey(key) {

                function filter(node) {
                    if (node.level == 1 && node.isHidden) {
                        tree.showNode(node)
                    }
                    return (node.level == 1 &&
                        ((node.name.indexOf(key) > -1)
                            || (node.ds.indexOf(key) > -1)));
                }

                function filter2(node) {
                    return (node.level == 1 &&
                        ((node.name.indexOf(key) === -1)
                            && (node.ds.indexOf(key) === -1)));
                }

                if (key !== null && key !== "" && key !== undefined) {
                    let nodesByFilter = tree.getNodesByFilter(filter);
                    let nodesByFilter2 = tree.getNodesByFilter(filter2);
                    if (nodesByFilter.length > 0) {
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
                    for (var i = 0, l = nodesByFilter.length; i < l; i++) {
                        tree.checkNode(nodesByFilter[i], true);
                        tree.updateNode(nodesByFilter[i])
                        tree.expandNode(nodesByFilter[i].getParentNode(), true);
                        if (i === 0) {
                            tree.selectNode(nodesByFilter[i]);
                            leftClick();
                        }
                    }

                    for (var i = 0, l = nodesByFilter2.length; i < l; i++) {
                        tree.hideNode(nodesByFilter2[i])
                    }
                }
            }
        }


        function getDataByPost1(url, par) {
            var dataStore;
            $.ajax({
                type: "post",
                url: url,
                //async: false,
                data: par,
                success: function (data) {
                    dataStore = data;
                }
            });
            return dataStore;
        }

        function formDataVal(tableName2, tableSchema) {
            /**
             　　* @Description: TODO 刷新form数据
             　　* @param
             　　* @return
             　　* @throws
             　　* @author lenovo
             　　* @date 2019/8/14 15:28
             　　*/
            formData = getDataByGet(base_url + "/bigdataMetadata/selectDictTable.do", "tableName2=" + tableName2 + "&tableSchema=" + tableSchema);
            let tableName1 = formData.data[0].tableName1;
            // let tableName2 = formData.data[0].tableName2;
            let tableStatus = formData.data[0].tableStatus;
            let createTime = formData.data[0].createTime;
            let updateTime = formData.data[0].updateTime;
            let tbOwner = formData.data[0].tbOwner;
            let business = formData.data[0].business;
            $("[name='tableStatus']").val(tableStatus == null ? "" : tableStatus);
            $("[name='tableName1']").val(tableName1 == null ? "" : tableName1);
            $("[name='tableName2']").val(tableName2 == null ? "" : tableName2);
            $("[name='createTime']").val(createTime == null ? "" : createTime);
            $("[name='updateTime']").val(updateTime == null ? "" : updateTime);
            $("[name='tbOwner']").val(tbOwner == null ? "" : tbOwner);
            $("[name='business']").val(business == null ? "" : business);
        }

        function parseJson(obj) {
            let res = "";
            for (let x in obj) {
                res = res + x + "=" + obj[x] + "\n";
            }
            return res;
        }

        function parseToParam(obj) {
            let res = "";
            for (let x in obj) {
                res = res + x + "=" + obj[x] + "&";
            }
            return res;
        }


        let zNodes;
        let firstAllTreeInit = true;

        function initSelect(name) {
            allJobTree();
            if (name !== null && name !== "" && name !== undefined) {
                let nodeByParam = focusTree.getNodeByParam("name", name, null);
                focusTree.selectNode(nodeByParam)
                focusTree.expandNode(nodeByParam.getParentNode(), true);
                leftClick()
            }
        }

        $(document).ready(function () {
            zNodes = getDataByGet(base_url + "/bigdataMetadata/initForDict.do");
            $.each($(".content .row .height-self"), function (i, n) {
                $(n).css("height", (screenHeight - 50) + "px");
            });
            let name = localStorage.getItem("dataDict_node");
            initSelect(name)
            //编辑点击事件
            $("[name='edit']").click(function () {
                //编辑切换
                switchPage(1);
            });
            $("[name='back']").click(function () {
                switchPage(0);
            });
            $("[name='keep']").click(function () {
                layer.open({
                    skin: 'wyd-class',
                    content: '更新提示',
                    btn: ['确认更新', '取消更新'],
                    yes: function (index, layero) {
                        $.ajax({
                            url: base_url + "/bigdataMetadata/updateDictTable.do",
                            data: $('#editTm form').serialize() + "&tableSchema=" + tableSchema,
                            type: "post",
                            success: function (data) {
                                if (data.success == false) {
                                    layer.msg(data.message)
                                } else {
                                    //修改需要重新加载zNodes,重置ztree
                                    zNodes = getDataByGet(base_url + "/bigdataMetadata/initForDict.do");
                                    $.fn.zTree.init($("#allTree"), setting, zNodes);
                                    //刷新修改数据
                                    initSelect(tableName2);
                                }
                            }
                        });
                        layer.close(index);
                    },
                    btn2: function (index, layero) {
                        layer.close(index)
                    }
                });
            });
        });

        function allJobTree() {
            $('#allTree').show();
            $('#allScheBtn').parent().addClass('active');
            if (firstAllTreeInit) {
                firstAllTreeInit = false;
                $.fn.zTree.init($("#allTree"), setting, zNodes);
            }
            focusTree = $.fn.zTree.getZTreeObj("allTree");
        }
    }
);












