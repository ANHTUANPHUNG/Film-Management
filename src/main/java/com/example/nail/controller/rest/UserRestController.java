package com.example.nail.controller.rest;

import com.example.nail.service.combo.request.ComboEditRequest;
import com.example.nail.service.combo.request.ComboSaveRequest;
import com.example.nail.service.response.SelectOptionResponse;
import com.example.nail.service.user.UserService;
import com.example.nail.service.user.request.UserCreateRequest;
import com.example.nail.service.user.request.UserEditRequest;
import com.example.nail.util.AppUtil;
import lombok.AllArgsConstructor;
import lombok.Getter;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/users")
@AllArgsConstructor
public class UserRestController {
    private UserService userService;
    @GetMapping
    public ResponseEntity<?> findAll(@PageableDefault(size = 5) Pageable pageable,
                                     @RequestParam(defaultValue = "") String search){
        return new ResponseEntity<>(userService.findAllUser(search,pageable), HttpStatus.OK);
    }

    @PostMapping
    public ResponseEntity<?> create(@RequestBody UserCreateRequest userCreateRequest, BindingResult bindingResult){
        userCreateRequest.validate(userCreateRequest,bindingResult);
        if(bindingResult.hasFieldErrors()){
            return AppUtil.mapErrorToResponse(bindingResult);
        }
        return new ResponseEntity<>(userService.create(userCreateRequest), HttpStatus.CREATED);
    }
    @PatchMapping("/lock/{id}")
    public ResponseEntity<String> lockUser(@PathVariable Long id) {
        userService.lockById(id);
        return ResponseEntity.ok("ok");
    }
    @PatchMapping("/unlock/{id}")
    public ResponseEntity<String> unlockUser(@PathVariable Long id) {
        userService.unlockById(id);
        return ResponseEntity.ok("ok");
    }
    @PatchMapping("/admin/{id}")
    public ResponseEntity<String> roleUser(@PathVariable Long id) {
        userService.roleAdmin(id);
        return ResponseEntity.ok("ok");
    }
    @PatchMapping("/user/{id}")
    public ResponseEntity<String> roleAdmin(@PathVariable Long id) {
        userService.roleUser(id);
        return ResponseEntity.ok("ok");
    }
    @GetMapping("/{id}")
    public ResponseEntity<?> find(@PathVariable Long id){
        return  new ResponseEntity<>(userService.showEdit(id),HttpStatus.OK);
    }
    @PutMapping("/{id}")
    public ResponseEntity<?> update(@RequestBody UserEditRequest userEditRequest , BindingResult bindingResult, @PathVariable Long id) throws Exception {
        userEditRequest.setUserService(userService);

        userEditRequest.validate(userEditRequest, bindingResult);
        if (bindingResult.hasFieldErrors()) {
            return AppUtil.mapErrorToResponse(bindingResult);
        }
        userService.update(userEditRequest,id);
        return ResponseEntity.noContent().build();
    }

}
