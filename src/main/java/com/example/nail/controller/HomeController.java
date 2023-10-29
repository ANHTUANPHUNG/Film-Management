package com.example.nail.controller;

import lombok.AllArgsConstructor;
import lombok.Getter;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.servlet.ModelAndView;

@Controller
@AllArgsConstructor
@RequestMapping(value="/")
public class HomeController {
    @GetMapping("/dashboard")
    public ModelAndView dashboard(){
        return new ModelAndView("/dashboard");
    }
    @GetMapping("/product")
    private ModelAndView product(){
        return new ModelAndView("/product");
    }
}
