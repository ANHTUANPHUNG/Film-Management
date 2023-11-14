package com.example.nail.controller.rest;

import com.example.nail.service.combo.ComboService;
import com.example.nail.service.combo.request.ComboEditRequest;
import com.example.nail.service.combo.request.ComboSaveRequest;
import com.example.nail.service.product.request.ProductEditRequest;
import com.example.nail.service.product.response.ProductEditResponse;
import com.example.nail.util.AppUtil;
import lombok.AllArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;

@RestController
@RequestMapping("/api/combos")
@AllArgsConstructor
public class ComboRestController {
    private ComboService comboService;
    @GetMapping
    public ResponseEntity<Page<?>> showCombo(@PageableDefault(size = 5) Pageable pageable,
                                             @RequestParam(defaultValue = "") String search,
                                             @RequestParam(defaultValue = "1") BigDecimal min,
                                             @RequestParam(defaultValue = "500000000000000000") BigDecimal max){
        return new ResponseEntity<>(comboService.findAllComboList(search,pageable,min,max), HttpStatus.OK);
    }
    @PostMapping
    public ResponseEntity<?> create(@RequestBody ComboSaveRequest comboSaveRequest, BindingResult bindingResult){
        comboSaveRequest.validate(comboSaveRequest,bindingResult);
        if(bindingResult.hasFieldErrors()){
            return AppUtil.mapErrorToResponse(bindingResult);
        }
        return new ResponseEntity<>(comboService.create(comboSaveRequest), HttpStatus.CREATED);
    }
    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteRoom(@PathVariable Long id) {
        comboService.deleteById(id);
        return ResponseEntity.ok("Package deleted successfully");
    }
    @GetMapping("/{id}")
    public ResponseEntity<?> find(@PathVariable Long id){
        return  new ResponseEntity<>(comboService.showEdit(id),HttpStatus.OK);
    }
    @PutMapping("/{id}")
    public ResponseEntity<?> update(@RequestBody ComboEditRequest comboEditRequest , BindingResult bindingResult, @PathVariable Long id) throws Exception {
        comboEditRequest.validate(comboEditRequest, bindingResult);

        if (bindingResult.hasFieldErrors()) {
            return AppUtil.mapErrorToResponse(bindingResult);
        }
        comboService.update(comboEditRequest,id);
        return ResponseEntity.noContent().build();
    }
}
