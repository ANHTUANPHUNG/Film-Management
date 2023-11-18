package com.example.nail.service.bill;

import com.example.nail.domain.*;
import com.example.nail.domain.eNum.ELock;
import com.example.nail.domain.eNum.EPayment;
import com.example.nail.exception.ResourceNotFoundException;
import com.example.nail.repository.*;
import com.example.nail.service.bill.request.BillCreateRequest;
import com.example.nail.service.bill.request.BillEditRequest;
import com.example.nail.service.bill.response.BillEditResponse;
import com.example.nail.service.bill.response.BillListResponse;
import com.example.nail.service.combo.request.ComboEditRequest;
import com.example.nail.service.combo.request.ComboSaveRequest;
import com.example.nail.service.combo.response.ComboEditResponse;
import com.example.nail.service.request.SelectOptionRequest;
import com.example.nail.util.AppMessage;
import com.example.nail.util.AppUtil;
import jakarta.transaction.Transactional;
import lombok.AllArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
@AllArgsConstructor
@Transactional
public class BillService {

    private BillRepository billRepository;
    private ProductRepository productRepository;
    private ComboRepository comboRepository;
    private BillComboRepository billComboRepository;
    private BillProductRepository billProductRepository;
    private UserRepository userRepository;
    public Page<BillListResponse> findAll(String search, Pageable pageable){
        return billRepository.searchAllByBill(search,pageable)
                .map(b -> BillListResponse.builder()
                        .id(b.getId())
                        .customerName(b.getCustomerName())
                        .customerEmail(b.getCustomerEmail())
                        .customerPhone(b.getCustomerPhone())
                        .customerQuantity(b.getCustomerQuantity())
                        .price(b.getPrice())
                        .appointmentTime(String.valueOf(b.getAppointmentTime()))
                        .timeBook(b.getTimeBook())
                        .user(b.getUser().getName())
                        .ePayment(String.valueOf(b.getEPayment()))
                        .products(b.getBillProducts().stream()
                                .map(BillProduct::getProductName)
                                .collect(Collectors.joining(", ")))
                        .combos(b.getBillCombos().stream()
                                .map(BillCombo::getComboName)
                                .collect(Collectors.joining(", ")))
                        .build());
    }
    public Bill create(BillCreateRequest billCreateRequest){
        Bill bill = AppUtil.mapper.map(billCreateRequest, Bill.class);
        if(billCreateRequest.getUser() == null || billCreateRequest.getUser().getId().equals("")){
            bill.setUser(null);
        } else {
            User user = userRepository.findById(Long.valueOf(billCreateRequest.getUser().getId())).get();
            if(billCreateRequest.getCustomerName() == null || billCreateRequest.getCustomerName().equals("")){
                bill.setCustomerName(user.getName());
            }  if( billCreateRequest.getCustomerEmail() == null || billCreateRequest.getCustomerEmail().equals("")){
                bill.setCustomerEmail(user.getEmail());
            }  if(billCreateRequest.getCustomerPhone() == null || billCreateRequest.getCustomerPhone().equals("")) {
                bill.setCustomerPhone(user.getPhone());
            }
        }
        bill.setDeleted(false);
        bill.setEPayment(EPayment.UNPAID);
        bill.setTimeBook(LocalDateTime.now());
        Bill finalBill =billRepository.save(bill);
        List<Long> idProducts = billCreateRequest.getIdProducts().stream().map(Long::valueOf).toList();
        List<BillProduct> billProducts = billProductRepository.saveAll(productRepository.findAllById(idProducts).stream().map(product -> {
            var result =  new BillProduct(finalBill,product);
            result.setProductName(product.getName());
            result.setProductPrice(product.getPrice());
            return result;
        }).collect(Collectors.toList()));
        BigDecimal totalPriceBillProduct = BigDecimal.ZERO;
        for (BillProduct billProduct : billProducts) {
            totalPriceBillProduct = totalPriceBillProduct.add(billProduct.getProductPrice());
        }
        List<Long> idCombos = billCreateRequest.getIdCombos().stream().map(Long::valueOf).toList();
        List<BillCombo> billCombos = billComboRepository.saveAll(comboRepository.findAllById(idCombos).stream().map(combo -> {
            var result =  new BillCombo(finalBill,combo);
            result.setComboName(combo.getName());
            result.setComboPrice(combo.getPrice());
            return result;
        }).collect(Collectors.toList()));
        BigDecimal totalPriceBillCombo = BigDecimal.ZERO;
        for (BillCombo billCombo : billCombos) {
            totalPriceBillCombo = totalPriceBillCombo.add(billCombo.getComboPrice());
        }
        finalBill.setPrice(totalPriceBillProduct.add(totalPriceBillCombo));
        return billRepository.save(finalBill);
    }
    public Bill findById(Long id){
        return billRepository.findById(id).orElseThrow(() -> new ResourceNotFoundException
                (String.format(AppMessage.ID_NOT_FOUND, "Bill", id)));
    }
    public BillEditResponse showEdit(Long id){
        var bill = findById(id);
        var billEditResponse = AppUtil.mapper.map(bill,BillEditResponse.class);
        billEditResponse.setUsers(bill.getUser().getId());
        billEditResponse.setUserName(bill.getUser().getUserName());

        billEditResponse.setCombosId(bill.getBillCombos()
                .stream().map(billCombo -> billCombo.getCombo().getId())
                .collect(Collectors.toList()));
        billEditResponse.setProductsId(bill.getBillProducts()
                .stream().map(billProduct -> billProduct.getProduct().getId())
                .collect(Collectors.toList())
        );
        billEditResponse.setProductsPrice(bill.getBillProducts()
                .stream().map(BillProduct::getProductPrice)
                .collect(Collectors.toList())
        );
        billEditResponse.setCombosPrice(bill.getBillCombos()
                .stream().map(BillCombo::getComboPrice)
                .collect(Collectors.toList())
        );
        billEditResponse.setProductsName(bill.getBillProducts()
                .stream().map(BillProduct::getProductName)
                .collect(Collectors.toList()));
        billEditResponse.setCombosName(bill.getBillCombos()
                .stream().map(BillCombo::getComboName)
                .collect(Collectors.toList()));
        return billEditResponse;
    }
    public void update (BillEditRequest billEditRequest , Long id){
        var billDB = findById(id);
        billDB.setCustomerName(billEditRequest.getCustomerName());
        billDB.setCustomerPhone(billEditRequest.getCustomerPhone());
        billDB.setCustomerEmail(billEditRequest.getCustomerEmail());
        billDB.setCustomerQuantity(Long.valueOf(billEditRequest.getCustomerQuantity()));
        billDB.setTimeBook(LocalDateTime.now());
        billDB.setAppointmentTime(LocalDateTime.parse(billEditRequest.getAppointmentTime()));
        if(billEditRequest.getUser() == null || billEditRequest.getUser().getId().equals("")){
            billDB.setUser(null);
        } else {
            User user = userRepository.findById(Long.valueOf(billEditRequest.getUser().getId())).get();
            if(billEditRequest.getCustomerName() == null || billEditRequest.getCustomerName().equals("")){
                billDB.setCustomerName(user.getName());
            }  if( billEditRequest.getCustomerEmail() == null || billEditRequest.getCustomerEmail().equals("")){
                billDB.setCustomerEmail(user.getEmail());
            }  if(billEditRequest.getCustomerPhone() == null || billEditRequest.getCustomerPhone().equals("")) {
                billDB.setCustomerPhone(user.getPhone());
            }
            billDB.setUser(user);
        }
       var finalBill = billRepository.save(billDB);
        billProductRepository.deleteAllById(finalBill.getBillProducts()
                .stream().map(BillProduct::getId)
                .collect(Collectors.toList())
        );
        billComboRepository.deleteAllById(finalBill.getBillCombos()
                .stream().map(BillCombo::getId)
                .collect(Collectors.toList())
        );
        List<Long> idCombos = billEditRequest.getIdCombos().stream().map(Long::valueOf).toList();
        List<BillCombo> billCombos = billComboRepository.saveAll(comboRepository.findAllById(idCombos).stream().map(combo -> {
            var result =  new BillCombo(finalBill,combo);
            result.setComboName(combo.getName());
            result.setComboPrice(combo.getPrice());
            return result;
        }).collect(Collectors.toList()));
        BigDecimal totalPriceBillCombo = BigDecimal.ZERO;
        for (BillCombo billCombo : billCombos) {
            totalPriceBillCombo = totalPriceBillCombo.add(billCombo.getComboPrice());
        }

        List<Long> idProducts = billEditRequest.getIdProducts().stream().map(Long::valueOf).toList();
        List<BillProduct> billProducts = billProductRepository.saveAll(productRepository.findAllById(idProducts).stream().map(product -> {
            var result =  new BillProduct(finalBill,product);
            result.setProductName(product.getName());
            result.setProductPrice(product.getPrice());
            return result;
        }).collect(Collectors.toList()));
        BigDecimal totalPriceBillProduct = BigDecimal.ZERO;
        for (BillProduct billProduct : billProducts) {
            totalPriceBillProduct = totalPriceBillProduct.add(billProduct.getProductPrice());
        }
        finalBill.setPrice(totalPriceBillProduct.add(totalPriceBillCombo));
        billRepository.save(finalBill);
    }
    public void paidById(Long id){
        Bill bill = findById(id);
        bill.setEPayment(EPayment.PAID);
        billRepository.save(bill);
    }
    public void unpaidById(Long id){
        Bill bill = findById(id);
        bill.setEPayment(EPayment.UNPAID);
        billRepository.save(bill);
    }
    public void lockById(Long id){
        Bill bill = findById(id);
        bill.setDeleted(true);
        billRepository.save(bill);
    }
}
