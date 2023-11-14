package com.example.nail.service.combo;


import com.example.nail.domain.Combo;
import com.example.nail.domain.ComboProduct;
import com.example.nail.domain.File;
import com.example.nail.domain.Product;
import com.example.nail.exception.ResourceNotFoundException;
import com.example.nail.repository.ComboProductRepository;
import com.example.nail.repository.ComboRepository;
import com.example.nail.repository.FileRepository;
import com.example.nail.service.combo.request.ComboEditRequest;
import com.example.nail.service.combo.request.ComboSaveRequest;
import com.example.nail.service.combo.response.ComboEditResponse;
import com.example.nail.service.combo.response.ComboListResponse;
import com.example.nail.service.request.SelectOptionRequest;
import com.example.nail.util.AppMessage;
import com.example.nail.util.AppUtil;
import lombok.AllArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@AllArgsConstructor
@Service
@Transactional

public class ComboService {
    private ComboRepository comboRepository;
    private FileRepository fileRepository;
    private ComboProductRepository comboProductRepository;
    public Page<ComboListResponse> findAllComboList(String search,Pageable pageable, BigDecimal min, BigDecimal max ){
        return comboRepository.searchAllByService(search,pageable,min,max)
                .map(combo -> ComboListResponse.builder()
                        .id(combo.getId())
                        .name(combo.getName())
                        .description(combo.getDescription())
                        .price(combo.getPrice())
                        .poster(String.valueOf(combo.getPosterCombo().getFileUrl()))
                        .images(String.valueOf(combo.getImageCombo()))
                        .products(combo.getComboProducts()
                                .stream()
                                .map(comboProduct -> comboProduct.getProduct().getName())
                                .collect(Collectors.joining(", ")))
                        .build());
    }
    public Combo create(ComboSaveRequest comboSaveRequest){
        Combo combo = AppUtil.mapper.map(comboSaveRequest, Combo.class);
        File poster = fileRepository.findById(comboSaveRequest.getPoster().getId()).get();
        combo.setPosterCombo(poster);
        combo.setDeleted(false);
        var images = fileRepository.findAllById(
                comboSaveRequest.getImages()
                        .stream().map(SelectOptionRequest::getId).toList());
        for (var image:images) {
            image.setCombo(combo);
        }
        comboProductRepository.saveAll(
            comboSaveRequest.getIdProducts()
                    .stream()
                    .map(id -> new ComboProduct(combo,new Product(Long.valueOf(id))))
                    .collect(Collectors.toList()));
        fileRepository.saveAll(images);
        return comboRepository.save(combo);
    }
    public Combo findById(Long id){
        return comboRepository.findById(id).orElseThrow(() -> new ResourceNotFoundException
                (String.format(AppMessage.ID_NOT_FOUND, "Combo", id)));
    }
    public ComboEditResponse showEdit(Long id){
        var combo = findById(id);
        var comboResponse = AppUtil.mapper.map(combo,ComboEditResponse.class);
        comboResponse.setPoster(combo.getPosterCombo().getFileUrl());
        comboResponse.setIdPoster(combo.getPosterCombo().getId());
        List<String> images = combo.getImageCombo()
                .stream().map(File::getFileUrl).toList();
        List<String> idImages = combo.getImageCombo()
                .stream().map(File::getId).toList();
        comboResponse.setImages(images);
        comboResponse.setIdImages(idImages);
        comboResponse.setProductsId(combo.getComboProducts()
                .stream().map(comboProduct -> comboProduct.getProduct().getId())
                .collect(Collectors.toList())
        );
        return comboResponse;
    }
    public void update(ComboEditRequest comboEditRequest, Long id){
        var comboDB = findById(id);
        comboDB.setName(comboEditRequest.getName());
        comboDB.setPrice(new BigDecimal(comboEditRequest.getPrice()));
        comboDB.setDescription(comboEditRequest.getDescription());
        if(comboEditRequest.getPoster()!= null && comboEditRequest.getPoster().getId()!= null){
            comboDB.setPosterCombo(File.builder().id(comboEditRequest.getPoster().getId()).build());
        }
//        Xét toàn bộ combo_id ở file về null trước khi thêm lại
        comboRepository.save(comboDB);
        comboDB.getImageCombo().forEach(e->{e.setCombo(null);
                fileRepository.save(e);
        });
        var images = fileRepository.findAllById(comboEditRequest.getImages()
                .stream().map(SelectOptionRequest::getId)
                .collect(Collectors.toList())
        );
        for (var image : images){
            image.setCombo(comboDB);
        }
        fileRepository.saveAll(images);
//        xóa comboProduct cũ rồi làm lại cái mới
        comboProductRepository.deleteAllById(comboDB.getComboProducts()
                .stream().map(ComboProduct::getId)
                .collect(Collectors.toList())
        );
        var comboProducts = new ArrayList<ComboProduct>();
        for (String idProducts: comboEditRequest.getIdProducts()) {
            Product product=new Product(Long.parseLong(idProducts));
            comboProducts.add(new ComboProduct(comboDB,product));
        }
        comboProductRepository.saveAll(comboProducts);
    }
    public void deleteById(Long id){
        Combo combo = findById(id);
        combo.setDeleted(true);
        comboRepository.save(combo);
    }
}
