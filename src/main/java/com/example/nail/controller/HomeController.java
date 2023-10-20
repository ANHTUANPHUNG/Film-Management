package com.example.nail.controller;

import lombok.AllArgsConstructor;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.servlet.ModelAndView;

@Controller
@AllArgsConstructor
@RequestMapping(value="/home")
public class HomeController {
    @GetMapping
    public ModelAndView index(){
        ModelAndView view= new ModelAndView("/layout-home");
        return view;
    }
}
