$(function(){
	weldedJunctionDatagrid();
});

function weldedJunctionDatagrid(){
	$("#weldedJunctionTable").datagrid( {
		fitColumns : true,
		height : $("#body").height(),
		width : $("#body").width(),
		idField : 'id',
		pageSize : 10,
		pageList : [ 10, 20, 30, 40, 50 ],
		url : "weldedjunction/getWeldedJunctionList",
		singleSelect : true,
		rownumbers : true,
		showPageList : false,
		columns : [ [ {
			field : 'id',
			title : '序号',
			width : 30,
			halign : "center",
			align : "left",
			hidden:true
		}, {
			field : 'weldedJunctionno',
			title : '编号',
			width : 50,
			halign : "center",
			align : "left"
		}, {
			field : 'serialNo',
			title : '序列号',
			width : 50,
			halign : "center",
			align : "left",
			hidden:true
		}, {
			field : 'pipelineNo',
			title : '管线号',
			width : 50,
			halign : "center",
			align : "left",
			hidden:true
		}, {
			field : 'roomNo',
			title : '房间号',
			width : 50,
			halign : "center",
			align : "left",
			hidden:true
		}, {
			field : 'roomNo',
			title : '房间号',
			width : 50,
			halign : "center",
			align : "left",
			hidden:true
		}, {
			field : 'itemid',
			title : '组织机构id',
			width : 50,
			halign : "center",
			align : "left",
			hidden:true
		}, {
			field : 'area',
			title : '区域',
			width : 50,
			halign : "center",
			align : "left",
			hidden:true
		}, {
			field : 'systems',
			title : '系统',
			width : 50,
			halign : "center",
			align : "left",
			hidden:true
		}, {
			field : 'children',
			title : '子项',
			width : 50,
			halign : "center",
			align : "left",
			hidden:true
		}, {
			field : 'externalDiameter',
			title : '上游外径',
			width : 50,
			halign : "center",
			align : "left"
		}, {
			field : 'nextexternaldiameter',
			title : '下游外径',
			width : 50,
			halign : "center",
			align : "left"
		}, {
			field : 'wallThickness',
			title : '上游壁厚',
			width : 50,
			halign : "center",
			align : "left"
		}, {
			field : 'nextwall_thickness',
			title : '下游璧厚',
			width : 50,
			halign : "center",
			align : "left"
		}, {
			field : 'material',
			title : '上游材质',
			width : 50,
			halign : "center",
			align : "left"
		}, {
			field : 'next_material',
			title : '下游材质',
			width : 50,
			halign : "center",
			align : "left"
		}, {
			field : 'dyne',
			title : '达因',
			width : 50,
			halign : "center",
			align : "left"
		}, {
			field : 'specification',
			title : '规格',
			width : 50,
			halign : "center",
			align : "left",
			hidden:true
		}, {
			field : 'maxElectricity',
			title : '电流上限',
			width : 50,
			halign : "center",
			align : "left"
		}, {
			field : 'minElectricity',
			title : '电流下限',
			width : 50,
			halign : "center",
			align : "left"
		}, {
			field : 'maxValtage',
			title : '电压上限',
			width : 50,
			halign : "center",
			align : "left"
		}, {
			field : 'minValtage',
			title : '电压下限',
			width : 50,
			halign : "center",
			align : "left"
		}, {
			field : 'itemname',
			title : '所属项目',
			width : 150,
			halign : "center",
			align : "left"
		}, {
			field : 'startTime',
			title : '开始时间',
			width : 50,
			halign : "center",
			align : "left",
			hidden:true
		}, {
			field : 'endTime',
			title : '完成时间',
			width : 50,
			halign : "center",
			align : "left",
			hidden:true
		}, {
			field : 'creatTime',
			title : '创建时间',
			width : 50,
			halign : "center",
			align : "left",
			hidden:true
		}, {
			field : 'updateTime',
			title : '修改时间',
			width : 50,
			halign : "center",
			align : "left",
			hidden:true
		}, {
			field : 'updatecount',
			title : '修改次数',
			width : 50,
			halign : "center",
			align : "left",
			hidden:true
		}, {
			field : 'valtage_unit',
			title : '电压单位',
			width : 50,
			halign : "center",
			align : "left",
			hidden:true
		}, {
			field : 'electricity_unit',
			title : '电流单位',
			width : 50,
			halign : "center",
			align : "left",
			hidden:true
		}, {
			field : 'edit',
			title : '编辑',
			width : 250,
			halign : "center",
			align : "left",
			formatter: function(value,row,index){
				var str = '<a id="edit" class="easyui-linkbutton" href="javascript:editWeldedjunction()"/>';
				str += '<a id="remove" class="easyui-linkbutton" href="javascript:removeWeldedjunction()"/>';
				str += '<a id="look" class="easyui-linkbutton" href="javascript:showMore()"/>';
				return str;
			}
		}] ],
		toolbar : '#disctionaryTable_btn',
		pagination : true,
		onLoadSuccess: function(data){
	        $("a[id='edit']").linkbutton({text:'修改',plain:true,iconCls:'icon-edit'});
	        $("a[id='remove']").linkbutton({text:'删除',plain:true,iconCls:'icon-remove'});
			$("a[id='look']").linkbutton({text:'查看更多',plain:true,iconCls:'icon-add'});
		}
	});
}


function showMore(){
	var row = $('#weldedJunctionTable').datagrid('getSelected');
	if (row) {
		$('#moredlg').window( {
			title : "查看更多",
			modal : true
		});
		$('#moredlg').window('open');
		$('#showfm').form('load', row);
	}
}

function closeshowmore(){
	$('#moredlg').window('close');
}

//监听窗口大小变化
window.onresize = function() {
	setTimeout(domresize, 500);
}

//改变表格高宽
function domresize() {
	$("#weldedJunctionTable").datagrid('resize', {
		height : $("#body").height(),
		width : $("#body").width()
	});
}

