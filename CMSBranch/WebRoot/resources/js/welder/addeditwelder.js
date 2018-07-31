$(function(){
	InsframeworkCombobox();
	$("#fm").form("disableValidation");
	$("#iid").combobox('setValue',$("#itemid").val());
})

var url = "";
var flag = 1;
function addWelder(){
	flag = 1;
	url = "welder/addWelder";
	save();
}

function editWelder(){
	flag = 2;
	url = "welder/editWelder";
	save();
}

//提交
function save(){
	var messager = "";
	var url2 = "";
	if(flag==1){
		messager = "新增成功！";
		url2 = url;
	}else{
		messager = "修改成功！";
		url2 = url;
	}
	$('#fm').form('submit', {
		url : url2,
		onSubmit : function() {
			return $(this).form('enableValidation').form('validate');
		},
		success : function(result) {
			if(result){
				var result = eval('(' + result + ')');
				if (!result.success) {
					$.messager.show( {
						title : 'Error',
						msg : result.errorMsg
					});
				}else{
					
					if(result.msg==null){
						$.messager.alert("提示", messager);
					}else{

						$.messager.alert("提示", messager);
						$('#dlg').dialog('close');
						$('#gatherTable').datagrid('reload');
						
					}
				}
			}
			
		},  
	    error : function(errorMsg) {  
	        alert("数据请求失败，请联系系统管理员!");  
	    } 
	});
}

//所属项目
function InsframeworkCombobox(){
	$.ajax({  
      type : "post",  
      async : false,
      url : "weldingMachine/getInsframeworkAll",  
      data : {},  
      dataType : "json", //返回数据形式为json  
      success : function(result) {  
          if (result) {
              var optionStr = '';
              for (var i = 0; i < result.ary.length; i++) {  
                  optionStr += "<option value=\"" + result.ary[i].id + "\" >"  
                          + result.ary[i].name + "</option>";
              }
              $("#iid").html(optionStr);
          }  
      },  
      error : function(errorMsg) {  
          alert("数据请求失败，请联系系统管理员!");  
      }  
	}); 
	$("#iid").combobox();
}

