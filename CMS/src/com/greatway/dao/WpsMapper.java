package com.greatway.dao;

import java.math.BigInteger;
import java.util.List;

import org.apache.ibatis.annotations.Param;

import com.greatway.model.Wps;

public interface WpsMapper {
	List<Wps> findAll(@Param("parent")BigInteger parent,@Param("str")String str);
	void save(Wps wps);
	void update(Wps wps);
	int getUsernameCount(@Param("fwpsnum")String fwpsnum);
	Wps findById(BigInteger fid);
	void delete(BigInteger fid);
}
