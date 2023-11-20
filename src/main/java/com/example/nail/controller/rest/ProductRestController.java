package com.example.nail.controller.rest;

import com.example.nail.service.product.ProductService;
import com.example.nail.service.product.request.ProductEditRequest;
import com.example.nail.service.product.request.ProductSaveRequest;
import com.example.nail.service.product.response.ProductEditResponse;
import com.example.nail.service.product.response.ProductListResponse;
import com.example.nail.util.AppUtil;
import jakarta.validation.Valid;
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
@RequestMapping("/api/products")
@AllArgsConstructor
public class ProductRestController {
    private final ProductService productService;

    @PostMapping
    public ResponseEntity<?> createProduct(@RequestBody ProductSaveRequest productSaveRequest , BindingResult bindingResult){
        new ProductSaveRequest().validate(productSaveRequest, bindingResult);

        if (bindingResult.hasFieldErrors()) {
            return AppUtil.mapErrorToResponse(bindingResult);
        }
        return new ResponseEntity<>(productService.createProduct(productSaveRequest), HttpStatus.CREATED);

    }
    @GetMapping
    public ResponseEntity<Page<ProductListResponse>> list(@PageableDefault(size = 1) Pageable pageable,
                                                          @RequestParam(defaultValue = "") String search,
                                                          @RequestParam(defaultValue = "1") BigDecimal min,
                                                          @RequestParam(defaultValue = "500000000000000000") BigDecimal max
    ) {
        return new ResponseEntity<>(productService.showListProduct(search,pageable, min,max), HttpStatus.OK);
    }
    @DeleteMapping("/{Id}")
    public ResponseEntity<String> deleteProduct(@PathVariable Long Id) {
        productService.deleteById(Id);
        return ResponseEntity.ok("Product deleted successfully");
    }
    @GetMapping("/{id}")
    public ResponseEntity<ProductEditResponse> find(@PathVariable Long id){
        return  new ResponseEntity<>(productService.findByIdProduct(id),HttpStatus.OK);
    }
    @PutMapping("/{id}")
    public ResponseEntity<?> update(@RequestBody  ProductEditRequest request , BindingResult bindingResult, @PathVariable Long id) throws Exception {
        new ProductEditRequest().validate(request, bindingResult);

        if (bindingResult.hasFieldErrors()) {
            return AppUtil.mapErrorToResponse(bindingResult);
        }
        productService.update(request,id);
        return ResponseEntity.noContent().build();
    }
}
