package com.example.nail.controller;

import com.example.nail.service.combo.ComboService;
import com.example.nail.service.product.ProductService;
import com.example.nail.service.user.UserService;
import lombok.AllArgsConstructor;
import lombok.Getter;
import org.springframework.boot.web.servlet.error.ErrorController;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.servlet.ModelAndView;

@Controller
@AllArgsConstructor
@RequestMapping(value="/")
public class HomeController  {
    private ProductService productService;
    private UserService userService;
    private ComboService comboService;

    @GetMapping("/dashboard")
    public ModelAndView dashboard(){
        return new ModelAndView("/dashboard");
    }
    @GetMapping("/product")
    private ModelAndView product(){
        return new ModelAndView("/product");
    }
    @GetMapping("/combo")
    private ModelAndView combo(){
        ModelAndView view = new ModelAndView("/combo");
        view.addObject("products", productService.findAll());
        return view;
    }
    @GetMapping("/user")
    private ModelAndView user(){
        return new ModelAndView("/user");
    }
    @GetMapping("/bill")
    private ModelAndView bill(){
        ModelAndView view = new ModelAndView("/bill");
        view.addObject("products", productService.findAll());
        view.addObject("combos", comboService.findAll());
        view.addObject("users", userService.findAll());
        return view;
    }
}
