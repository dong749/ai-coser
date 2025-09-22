package com.example.demo.controller;

import com.example.demo.common.BaseResponse;
import com.example.demo.common.ResultUtils;
import com.example.demo.model.entity.User;
import com.example.demo.service.UserService;
import jakarta.annotation.Resource;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/user")
public class UserController
{
    @Resource
    private UserService userService;

    @GetMapping("/get")
    public BaseResponse<List<User>> getUser()
    {
        return ResultUtils.success(userService.list());
    }
}
