package com.example.nail.service.bill.request;

import com.example.nail.service.request.SelectOptionRequest;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.util.StringUtils;
import org.springframework.validation.Errors;
import org.springframework.validation.Validator;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.Objects;

import static org.apache.commons.lang3.StringUtils.isNumeric;

@Data
@NoArgsConstructor
public class BillEditRequest implements Validator {
    private Long id;
    private String customerName;
    private String customerPhone;
    private String customerEmail;
    private String customerQuantity;
    private String appointmentTime;
    private List<String> idProducts;
    private List<String> idCombos;
    private SelectOptionRequest user;

    @Override
    public boolean supports(Class<?> clazz) {
        return false;
    }

    @Override
    public void validate(Object target, Errors errors) {
        BillEditRequest billEditRequest = (BillEditRequest) target;
        String customerName = billEditRequest.customerName;
        String customerPhone = billEditRequest.customerPhone;
        String customerEmail = billEditRequest.customerEmail;
        String customerQuantity = billEditRequest.customerQuantity;
        List<String> idProducts = billEditRequest.idProducts;
        List<String> idCombos = billEditRequest.idCombos;
        SelectOptionRequest user = billEditRequest.user;
        String  appointmentTime = billEditRequest.appointmentTime;

        if ((idProducts == null || idProducts.isEmpty()) && (idCombos == null || idCombos.isEmpty())) {
            errors.rejectValue("idProducts", "NotEmpty", "Cần chọn ít nhất một dịch vụ hoặc gói dịch vụ");
            errors.rejectValue("idCombos", "NotEmpty", "Cần chọn ít nhất một dịch vụ hoặc gói dịch vụ");
        }
        if (user == null || Objects.equals(user.getId(), "")) {
            if (StringUtils.isEmpty(customerName)) {
                errors.rejectValue("customerName", "NotEmpty", "Không được để trống nếu không có tài khoản user");
            } else if(!StringUtils.isEmpty(customerName)&& customerName.length() < 6){
                errors.rejectValue("customerName", "InvalidLength", "Tên khách hàng phải có ít nhất 6 ký tự");
            }

            if (StringUtils.isEmpty(customerPhone)) {
                errors.rejectValue("customerPhone", "NotEmpty", "Không được để trống nếu không có tài khoản user");
            }

            if (StringUtils.isEmpty(customerEmail)) {
                errors.rejectValue("customerEmail", "NotEmpty", "Không được để trống nếu không có tài khoản user");
            } else if (!StringUtils.isEmpty(customerEmail) && !customerEmail.matches("^\\S+@(gmail\\.com|yahoo\\.com|email\\.com|mailinator\\.com)$")) {
                errors.rejectValue("customerEmail", "InvalidFormat", "Email không hợp lệ");
            }
        } else {
            if (customerName.length() < 6 && customerName.length() >= 1){
                errors.rejectValue("customerName", "InvalidLength", "Tên khách hàng phải có ít nhất 6 ký tự hoặc để trống");
            }
            if (!StringUtils.isEmpty(customerEmail) &&  !customerEmail.matches("^\\S+@(gmail\\.com|yahoo\\.com|email\\.com|mailinator\\.com)$")) {
                errors.rejectValue("customerEmail", "InvalidFormat", "Email cần hợp lệ hoặc để trống");
            }
        }
        if (!isNumeric(customerQuantity)) {
            errors.rejectValue("customerQuantity", "InvalidFormat", "Số lượng khách hàng phải là một con số");
        } else {
            int quantity = Integer.parseInt(customerQuantity);
            if (quantity <= 0 || quantity > 15) {
                errors.rejectValue("customerQuantity", "InvalidRange", "Số lượng Khách hàng phải lớn hơn 0 và nhỏ hơn hoặc bằng 15");
            }
        }
        if (!StringUtils.isEmpty(appointmentTime)) {
            try {
                DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd'T'HH:mm");
                LocalDateTime appointmentDate = LocalDateTime.parse(appointmentTime, formatter);

                LocalDateTime currentDate = LocalDateTime.now();
                if (appointmentDate.isBefore(currentDate)) {
                    errors.rejectValue("appointmentTime", "InvalidAppointment", "Ngày hẹn không được trước ngày hiện tại");
                } else if (currentDate.plusDays(7).isBefore(appointmentDate)) {
                    errors.rejectValue("appointmentTime", "InvalidAppointment", "Ngày hẹn không được quá 7 ngày sau ngày hiện tại");
                }
            } catch (Exception e) {
                errors.rejectValue("appointmentTime", "InvalidFormat", "Định dạng ngày không hợp lệ");
            }
        } else {
            errors.rejectValue("appointmentTime", "InvalidAppointment", "Ngày hẹn không được để trống");

        }
    }
}

