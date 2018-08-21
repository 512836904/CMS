package com.greatway.controller;

import java.math.BigInteger;
import java.util.ArrayList;
import java.util.List;

import javax.servlet.http.HttpServletRequest;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;

import com.greatway.dto.WeldDto;
import com.greatway.manager.InsframeworkManager;
import com.greatway.manager.LiveDataManager;
import com.greatway.manager.WelcomeManager;
import com.greatway.model.Insframework;
import com.greatway.model.Welcome;
import com.greatway.util.IsnullUtil;
import com.spring.model.MyUser;
import com.spring.model.User;
import com.spring.service.UserService;

import net.sf.json.JSONArray;
import net.sf.json.JSONObject;

@Controller
@RequestMapping(value = "/hierarchy", produces = { "text/json;charset=UTF-8" })
public class MainController {
	@Autowired
	private UserService user;
	
	@Autowired
	private WelcomeManager wm;
	
	@Autowired
	private LiveDataManager lm;
	
	@Autowired
	private InsframeworkManager im;
	
	
	IsnullUtil iutil = new IsnullUtil();
	
	/**
	 * 跳转index页面进行分层
	 * @return
	 */
	@RequestMapping("/goIndex")
	@ResponseBody
	public String goGather(HttpServletRequest request){
		String hierarchy = request.getSession().getServletContext().getInitParameter("hierarchy");
		request.setAttribute("hierarchy", hierarchy);
		JSONObject obj = new JSONObject();
		obj.put("hierarchy", hierarchy);
		return obj.toString();
	}
	
	/**
	 * 跳转焊工工作量排行
	 * @return
	 */
	@RequestMapping("/goWorkRank")
	public String goWorkRank(HttpServletRequest request){
		return "welcome/workrank";
	}
	
	/**
	 * 跳转焊接规范负荷率
	 * @return
	 */
	@RequestMapping("/goLoadrate")
	public String goLoadrate(HttpServletRequest request){
		return "welcome/loadrate";
	}
	
	/**
	 * 跳转班组设备利用率
	 * @return
	 */
	@RequestMapping("/goUseratio")
	public String goUseratio(HttpServletRequest request){
		return "welcome/useratio";
	}
	
	@RequestMapping("/getUserInsframework")
	@ResponseBody
	public String getUserInsframework(HttpServletRequest request){
		JSONObject obj = new JSONObject();
		Object object = SecurityContextHolder.getContext().getAuthentication().getPrincipal();
		if(object==null){
			obj.put("uname", "请登录");
			obj.put("insframework", "无");
			return obj.toString();
		}
		MyUser u = (MyUser)object;
		User list = user.getUserInsframework(new BigInteger(u.getId()+""));
		obj.put("id", u.getId());
		obj.put("uname", list.getUserName());
		obj.put("type", list.getType());
		obj.put("insframework", list.getInsname());
		return obj.toString();
	}
	
	@RequestMapping("/getHierarchy")
	@ResponseBody
	public String getHierarchy(HttpServletRequest request){
		JSONObject obj = new JSONObject();
		JSONArray ary1 = new JSONArray();
		JSONArray ary2 = new JSONArray();
		JSONObject json1 = new JSONObject();
		JSONObject json2 = new JSONObject();
		BigInteger uid = lm.getUserId(request);
		
		List<Insframework> insframework = im.getInsByUserid(uid);
		int types = insframework.get(0).getType();
		BigInteger insfid = insframework.get(0).getId();
		if(types==20){
			List<Insframework> company = im.getConmpany(null);
			for(Insframework i:company){
				json1.put("companyid", i.getId());
				json1.put("companyname", i.getName());
				ary1.add(json1);
				List<Insframework> caust = im.getCause(i.getId(), null);
				for(Insframework j:caust){
					json2.put("companyid", i.getId());
					json2.put("caustid", j.getId());
					json2.put("caustname", j.getName());
					ary2.add(json2);
				}
			}
		}else if(types==21){
			List<Insframework> caust = im.getCause(insfid, null);
			for(Insframework i:caust){
				json1.put("companyid", i.getId());
				json1.put("companyname", i.getName());
				ary1.add(json1);
				List<Insframework> item = im.getCause(i.getId(), null);
				for(Insframework j:item){
					json2.put("companyid", i.getId());
					json2.put("caustid", j.getId());
					json2.put("caustname", j.getName());
					ary2.add(json2);
				}
			}
		}else if(types==22){
			Insframework insf = im.getInsById(insfid);
			if(insf!=null){
				json1.put("companyid", insf.getId());
				json1.put("companyname", insf.getName());
				ary1.add(json1);
				List<Insframework> item = im.getCause(insf.getId(), null);
				for(Insframework j:item){
					json2.put("companyid", insf.getId());
					json2.put("caustid", j.getId());
					json2.put("caustname", j.getName());
					ary2.add(json2);
				}
			}
		}else if(types==23){
			Insframework insf = im.getInsById(insfid);
			if(insf!=null){
				json1.put("companyid", insf.getId());
				json1.put("companyname", insf.getName());
				ary1.add(json1);
				json2.put("companyid", insf.getId());
				json2.put("caustid", insf.getId());
				json2.put("caustname", insf.getName());
				ary2.add(json2);
			}
		}
		obj.put("ary1", ary1);
		obj.put("ary2", ary2);
		return obj.toString();
	}
	
	@RequestMapping("getWorkRank")
	@ResponseBody
	public String getWorkRank(HttpServletRequest request){
		JSONObject obj = new JSONObject();
		JSONArray ary = new JSONArray();
		JSONObject json = new JSONObject();
		try{
			WeldDto dto = new WeldDto();
			dto.setDtoTime1(request.getParameter("time1"));
			dto.setDtoTime2(request.getParameter("time2"));
			BigInteger uid = lm.getUserId(request);
			dto.setParent(im.getUserInsfId(uid));
			
			List<Welcome> list = wm.getWorkRank(dto);
			for(int i=0;i<list.size();i++){
				if(i==0){
					json.put("rownum", "第一名");
				}else{
					json.put("rownum", "最后一名");
				}
				json.put("welderno", list.get(i).getWelderno());
				json.put("name", list.get(i).getName());
				json.put("item", list.get(i).getInsname());
				json.put("hour", (double)Math.round(list.get(i).getHour()*100)/100);
				ary.add(json);
			}
			obj.put("rows", ary);
		}catch(Exception e){
			e.printStackTrace();
		}
		return obj.toString();
	}
	
	/**
	 * 跳转利用率报表
	 * @param request
	 * @return
	 */
	@RequestMapping("/getUseRatio")
	@ResponseBody
	public String getUseRatio(HttpServletRequest request){
		JSONObject obj = new JSONObject();
		JSONArray ary = new JSONArray();
		JSONObject json = new JSONObject();
		try{
			WeldDto dto = new WeldDto();
			dto.setDtoTime1(request.getParameter("time1"));
			dto.setDtoTime2(request.getParameter("time2"));
			BigInteger uid = lm.getUserId(request);
			dto.setParent(im.getUserInsfId(uid));
			List<Welcome> list = wm.getItemMachineCount(dto);
			List<Welcome> temp = new ArrayList<Welcome>();
			for(Welcome i:list){
				Welcome w = new Welcome();
				w.setInsname(i.getName());
				w.setTotal(i.getTotal());
				Welcome machine = wm.getWorkMachineCount(i.getId(), dto);
				w.setMachinenum(machine.getMachinenum());
				if(machine!=null){
					w.setHour((double)Math.round((double)machine.getMachinenum()/(double)i.getTotal()*100*100)/100);
				}else{
					w.setHour(0);
				}
				temp.add(w);
			}
			double max=0,min=0;
			int maxindex = -1,minindex = -1;
			for(int i=0;i<temp.size();i++){
				double tempmax = temp.get(i).getHour();
				double tempmin = temp.get(i).getHour();
				min = tempmin;
				if(tempmax > max){
					max = tempmax;
					maxindex = i;
				}
				if(tempmin < min){
					min = tempmin;
					minindex = i;
				}
			}
			if(!temp.isEmpty() && max==0){
				maxindex = 0;
			}
			if(!temp.isEmpty() && min==0){
				minindex = temp.size()-1;
			}
			
			if(!temp.isEmpty() && maxindex>=0 && minindex>=0){
				for(int i=0;i<2;i++){
					int index = 0;
					if(i==0){
						index = maxindex;
					}else{
						index = minindex;
					}
					json.put("itemname", temp.get(index).getInsname());//班组
					json.put("machinenum", temp.get(index).getTotal());//设备总数
					json.put("worknum", temp.get(index).getMachinenum());//工作设备数
					json.put("useratio", temp.get(index).getHour());//设备利用率
					ary.add(json);
				}
			}
		}catch(Exception e){
			e.printStackTrace();
		}
		obj.put("ary", ary);
		return obj.toString();
	}
	
	
	/**
	 * 符合率
	 * @param request
	 * @return
	 */
	@RequestMapping("/getLoadRate")
	@ResponseBody
	public String getLoadRate(HttpServletRequest request){
		JSONObject obj = new JSONObject();
		JSONArray ary = new JSONArray();
		JSONObject json = new JSONObject();
		try{
			WeldDto dto = new WeldDto();
			dto.setDtoTime1(request.getParameter("time1"));
			dto.setDtoTime2(request.getParameter("time2"));
			BigInteger uid = lm.getUserId(request);
			dto.setParent(im.getUserInsfId(uid));
			dto.setDay("day");
			List<Welcome> ilist = wm.getItemWeldTime(dto);
			List<Welcome> olist = wm.getItemOverProofTime(dto);
			List<Welcome> temp = new ArrayList<Welcome>();
			for(int i=0;i<ilist.size();i++){
				Welcome w = new Welcome();
				double num = 0;
				w.setInsname(ilist.get(i).getName());
				w.setElectricity((double)Math.round(ilist.get(i).getHour()*100)/100);
				for(int o=0;o<olist.size();o++){
					if(ilist.get(i).getId().equals(olist.get(o).getId())){
						w.setAirflow((double)Math.round((ilist.get(i).getHour()-olist.get(o).getHour())*100)/100);
						num = (double)Math.round(((ilist.get(i).getHour()-olist.get(o).getHour())/ilist.get(i).getHour())*100)/100;
					}
				}
				w.setHour(num);
				temp.add(w);
			}
			double max=0,min=0;
			int maxindex = -1,minindex = -1;
			for(int i=0;i<temp.size();i++){
				double tempmax = temp.get(i).getHour();
				double tempmin = temp.get(i).getHour();
				min = tempmin;
				if(tempmax > max){
					max = tempmax;
					maxindex = i;
				}
				if(tempmin < min){
					min = tempmin;
					minindex = i;
				}
			}
			if(!temp.isEmpty() && max==0){
				maxindex = 0;
			}
			if(!temp.isEmpty() && min==0){
				minindex = temp.size()-1;
			}
			if(!temp.isEmpty() && maxindex>=0 && minindex>=0){
				for(int i=0;i<2;i++){
					int index = 0;
					if(i==0){
						index = maxindex;
					}else{
						index = minindex;
					}
					json.put("itemname", temp.get(index).getInsname());//班组
					json.put("loadtime", temp.get(index).getElectricity());//焊接时长
					json.put("normaltime", temp.get(index).getAirflow());//正常焊接时长
					json.put("weldtime", temp.get(index).getHour()*100);//符合率
					ary.add(json);
				}
			}
		}catch(Exception e){
			e.printStackTrace();
		}
		obj.put("ary", ary);
		return obj.toString();
	}
}
