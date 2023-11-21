package com.example.nail.controller;

import com.example.nail.domain.User;
import com.example.nail.service.combo.ComboService;
import com.example.nail.service.product.ProductService;
import com.example.nail.service.user.UserService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.AllArgsConstructor;
import lombok.Getter;
import org.springframework.boot.web.servlet.error.ErrorController;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.web.authentication.logout.SecurityContextLogoutHandler;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.servlet.ModelAndView;

import java.util.Optional;

@Controller
@AllArgsConstructor
@RequestMapping(value="/")
public class HomeController  {
    private ProductService productService;
    private UserService userService;
    private ComboService comboService;
    private final ModelAndView modelAndView = new ModelAndView();

    @GetMapping("/dashboard")
    public ModelAndView dashboard(){

        modelAndView.setViewName("/dashboard");
        modelAndView.addObject("someKey", "someValue");
        return modelAndView;
    }
    @GetMapping("/index")
    public ModelAndView getHome() {
        modelAndView.setViewName("index");
        ModelAndView modelAndView = Login();
        modelAndView.addObject("someKey", "someValue");
        return modelAndView;
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
    public ModelAndView Login(){
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        ModelAndView modelAndView = new ModelAndView();
        if (authentication != null && authentication.isAuthenticated() && authentication.getPrincipal() instanceof UserDetails userDetails) {
            String username = userDetails.getUsername();

            // Tìm người dùng theo username
            Optional<User> user = userService.findByNameIgnoreCaseOrEmailIgnoreCaseOrPhone(username);

            if (user.isPresent()) {
                modelAndView.addObject("loggedIn", true);
                modelAndView.addObject("user", user.get());
            } else {
                modelAndView.addObject("loggedIn", false);
            }
        } else {
            modelAndView.addObject("loggedIn", false);
        }
        return modelAndView;
    }

    @GetMapping("/logout")
    public String logout(HttpServletRequest request, HttpServletResponse response) {

        SecurityContextLogoutHandler logoutHandler = new SecurityContextLogoutHandler();
        logoutHandler.logout(request, response, SecurityContextHolder.getContext().getAuthentication());

        return "redirect:/login?logout";
    }
}
