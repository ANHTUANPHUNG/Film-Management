package com.example.nail.controller.rest;

//import com.example.nail.repository.billService;
import com.example.nail.service.bill.BillService;
import com.example.nail.service.bill.request.BillCreateRequest;
import com.example.nail.service.bill.request.BillEditRequest;
import com.example.nail.service.combo.ComboService;

import com.example.nail.service.combo.request.ComboEditRequest;
import com.example.nail.service.combo.request.ComboSaveRequest;
import com.example.nail.service.product.ProductService;
import com.example.nail.service.user.UserService;
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
@RequestMapping("/api/bills")
@AllArgsConstructor
public class BillRestController {
    private ComboService comboService;
    private UserService userService;
    private ProductService productService;
    private BillService billService;
    @GetMapping
    public ResponseEntity<Page<?>> findAll(@PageableDefault(size = 5) Pageable pageable,
                                           @RequestParam(defaultValue = "") String search){
        return new  ResponseEntity<>(billService.findAll(search,pageable),HttpStatus.OK);
    }
    @PostMapping
    public ResponseEntity<?> create(@RequestBody BillCreateRequest billCreateRequest, BindingResult bindingResult){
        billCreateRequest.validate(billCreateRequest,bindingResult);
        if(bindingResult.hasFieldErrors()){
            return AppUtil.mapErrorToResponse(bindingResult);
        }
        return new ResponseEntity<>(billService.create(billCreateRequest), HttpStatus.CREATED);
    }
    @PatchMapping("/paid/{id}")
    public ResponseEntity<String> paidBill(@PathVariable Long id) {
        billService.paidById(id);
        return ResponseEntity.ok("ok");
    }
    @PatchMapping("/unpaid/{id}")
    public ResponseEntity<String> unpaidBill(@PathVariable Long id) {
        billService.unpaidById(id);
        return ResponseEntity.ok("ok");
    }
    @PatchMapping("/lock/{id}")
    public ResponseEntity<String> lockUser(@PathVariable Long id) {
        billService.lockById(id);
        return ResponseEntity.ok("ok");
    }
    @GetMapping("/{id}")
    public ResponseEntity<?> find(@PathVariable Long id){
        return  new ResponseEntity<>(billService.showEdit(id),HttpStatus.OK);
    }
    @PutMapping("/{id}")
    public ResponseEntity<?> update(@RequestBody BillEditRequest billEditRequest , BindingResult bindingResult, @PathVariable Long id) throws Exception {
        billEditRequest.validate(billEditRequest, bindingResult);

        if (bindingResult.hasFieldErrors()) {
            return AppUtil.mapErrorToResponse(bindingResult);
        }
        billService.update(billEditRequest,id);
        return ResponseEntity.noContent().build();
    }
}
