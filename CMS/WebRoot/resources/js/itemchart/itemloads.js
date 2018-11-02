$(function() {
	ItemtimeCombobox();
	ItemloadsDatagrid();
})
var chartStr = "";
$(document).ready(function() {
	showitemLoadsChart();
})
var otype = "";
function setParam() {
	var parent = $("#parent").val();
	var item = $("#item").combobox("getValue");
	otype = $("input[name='otype']:checked").val();
	var dtoTime1 = $("#dtoTime1").datetimebox('getValue');
	var dtoTime2 = $("#dtoTime2").datetimebox('getValue');
	chartStr = "?otype=" + otype + "&parent=" + parent + "&item=" + item + "&dtoTime1=" + dtoTime1 + "&dtoTime2=" + dtoTime2;
}

var array1 = new Array();
var array2 = new Array();
var Series = [];
function showitemLoadsChart() {
	//初始化echart实例
	charts = echarts.init(document.getElementById("itemLoadsChart"));
	//显示加载动画效果
	charts.showLoading({
		text : '稍等片刻,精彩马上呈现...',
		effect : 'whirling'
	});
	option = {
		title : {
			text : "" //焊接工艺超标统计
		},
		tooltip : {
			trigger : 'axis' //坐标轴触发，即是否跟随鼠标集中显示数据
		},
		legend : {
			data : array2,
			x: 'left',
			left: '50'
		},
		grid : {
			left : '50', //组件距离容器左边的距离
			right : '60',
			bottom : '20',
			containLaber : true //区域是否包含坐标轴刻度标签
		},
		toolbox : {
			feature : {
				dataView : {
					show : true,
					readOnly : false
				},
				magicType : {
					show : true,
					type : [ 'line', 'bar' ]
				},
				restore : {
					show : true
				},
				saveAsImage : {
					show : true
				} //保存为图片
			},
			right : '2%',
			top:'30'
		},
		xAxis : {
			type : 'category',
			data : array1,
			name: '日期'
		},
		yAxis : {
			type : 'value', //value:数值轴，category:类目轴，time:时间轴，log:对数轴
			axisLabel : {
				show : true,
				interval : 'auto',
				formatter : '{value}%'
			},
			show : true,
			name: '负荷率'
		},
		series : []
	}
	option.series = Series;
	//为echarts对象加载数据
	charts.setOption(option);
	//隐藏动画加载效果
	charts.hideLoading();
	$("#chartLoading").hide();
	//重定义图表宽度
	$("#itemLoadsChart").width("100%");
	if(array1.length>3 || array2.length>5){//array2：柱状图数量
		var width = array1.length * array2.length * 100;
		$("#itemLoadsChart").width($("#itemLoadsChart").width()+width);
	}
	echarts.init(document.getElementById('itemLoadsChart')).resize();
}

function ItemloadsDatagrid() {
	setParam();
	var dtoTime1 = $("#dtoTime1").datetimebox('getValue');
	var dtoTime2 = $("#dtoTime2").datetimebox('getValue');
	var column = new Array();
	$.ajax({
		type : "post",
		async : false,
		url : "itemChart/getItemLoads" + chartStr,
		data : {},
		dataType : "json", //返回数据形式为json  
		success : function(result) {
			if (result) {
				var width = $("#bodydiv").width() / result.rows.length;
				column.push({
					field : "weldTime",
					title : "时间跨度(年/月/周/日)",
					width : width,
					halign : "center",
					align : "center"
				});

				for (var i = 0; i < result.rows.length; i++) {
					array1.push(result.rows[i].weldTime);
				}
				for (var m = 0; m < result.arys.length; m++) {
					column.push({
						field : "loads",
						title : result.arys[m].name + "(负荷率)",
						width : width,
						halign : "center",
						align : "center",
						formatter : function(value, row, index) {
							return "<a href='junctionChart/goDetailLoads?itemid=" + row.itemid + "&otype=" + otype + "&weldtime=" + row.weldTime + "&dtoTime1=" + dtoTime1 + "&dtoTime2=" + dtoTime2 + "'>" + value + "%" + "</a>";
						}
					}, {
						field : "itemid",
						title : "项目id",
						width : width,
						halign : "center",
						align : "center",
						hidden : true
					});
					array2.push(result.arys[m].name);
					Series.push({
						name : result.arys[m].name,
						type : 'bar', //折线图
						barMaxWidth : 20, //柱状图最大宽度
						data : result.arys[m].num,
						label : {
							normal : {
								position : 'top',
								show : true, //显示每个折点的值
								formatter : '{c}%'
							}
						}
					});
				}
			}
		},
		error : function(errorMsg) {
			alert("请求数据失败啦,请联系系统管理员!");
		}
	});
	$("#itemLoadsTable").datagrid({
		fitColumns : true,
		height : $("#bodydiv").height() - $("#itemLoadsChart").height() - $("#itemLoads_btn").height() - 45,
		width : $("#bodydiv").width(),
		idField : 'id',
		pageSize : 10,
		pageList : [ 10, 20, 30, 40, 50 ],
		url : "itemChart/getItemLoads" + chartStr,
		singleSelect : true,
		rownumbers : true,
		showPageList : false,
		pagination : true,
		columns : [ column ]
	})
}

function ItemtimeCombobox() {
	var parent = $("#parent").val();
	$.ajax({
		type : "post",
		async : false,
		url : "itemChart/getAllItem?parent=" + parent,
		data : {},
		dataType : "json", //返回数据形式为json  
		success : function(result) {
			if (result) {
				var optionStr = '';
				for (var i = 0; i < result.ary.length; i++) {
					optionStr += "<option value=\"" + result.ary[i].id + "\" >"
						+ result.ary[i].name + "</option>";
				}
				$("#item").html(optionStr);
			}
		},
		error : function(errorMsg) {
			alert("数据请求失败，请联系系统管理员!");
		}
	});
	$("#item").combobox();
	if ($("#parent").val()) {
		$("#item").combobox('setValue', $("#parent").val());
	} else {
		var data = $("#item").combobox('getData');
		$("#item").combobox('select', data[0].value);
	}
}

function serachitemloads() {
	$("#parent").val("");
	$("#chartLoading").show();
	array1 = new Array();
	array2 = new Array();
	Series = [];
	chartStr = "";
	setTimeout(function() {
		ItemloadsDatagrid();
		showitemLoadsChart();
	}, 500);
}

//监听窗口大小变化
window.onresize = function() {
	setTimeout(domresize, 500);
}

//改变表格高宽
function domresize() {
	$("#itemLoadsTable").datagrid('resize', {
		height : $("#bodydiv").height() - $("#itemLoadsChart").height() - $("#itemLoads_btn").height() - 45,
		width : $("#bodydiv").width()
	});
	echarts.init(document.getElementById('itemLoadsChart')).resize();
}