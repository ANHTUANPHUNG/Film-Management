package com.example.nail.service.user.request;

import com.example.nail.domain.User;
import com.example.nail.service.request.SelectOptionRequest;
//import com.example.nail.service.user.UserService;
import com.example.nail.service.user.UserService;
import lombok.Data;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.springframework.validation.Errors;
import org.springframework.validation.Validator;

import java.time.LocalDate;
import java.time.Period;
import java.time.format.DateTimeParseException;
import java.util.List;

import static org.apache.commons.lang3.StringUtils.isNumeric;

@Getter
@Setter
@NoArgsConstructor
public class UserEditRequest implements Validator {
    private String id;

    private String name;

    private String email;

    private String userName;

    private String password;

    private String phone;

    private String dob;

    private SelectOptionRequest avatar;

    private UserService userService;
    @Override
    public boolean supports(Class<?> clazz) {
        return false;
    }

    @Override
    public void validate(Object target, Errors errors) {
        UserEditRequest userEditRequest = (UserEditRequest) target;
         User user =userService.findById(Long.valueOf(userEditRequest.getId()));
        String name = userEditRequest.name;
        String phone = userEditRequest.phone;
        String dobString = userEditRequest.dob;
        String email = userEditRequest.email;
        System.out.println(user);
        if (!user.getUserName().equals(userEditRequest.getUserName())) {
            errors.rejectValue("userName", "userName.notMatch", "UserName không được thay đổi.");
        }
        if (!user.getPassword().equals(userEditRequest.getPassword())) {
            errors.rejectValue("password", "password.notMatch", "Password không được thay đổi.");
        }
        if (!user.getEmail().equals(email)) {
            errors.rejectValue("email", "email.notMatch", "Email không được thay đổi.");
        }
        if ( name.length() < 6 ) {
            errors.rejectValue("name", "name.length", "Họ và tên phải chứa ít nhất 6 ký tự .");
        }
        if(phone.length() <1){
            errors.rejectValue("phone", "phone.length", "Số điện thoại không được để trống.");
        }
        if (dobString != null) {
            try {
                LocalDate dob = LocalDate.parse(dobString);
                if (calculateAge(dob) < 16) {
                    errors.rejectValue("dob", "dob.tooYoung", "Người dùng phải đủ 16 tuổi.");
                }
            } catch (DateTimeParseException e) {
                errors.rejectValue("dob", "dob.invalidFormat", "Định dạng ngày tháng năm sinh không hợp lệ.");
            }
        }

    }
    private int calculateAge(LocalDate dob) {
        LocalDate currentDate = LocalDate.now();
        return Period.between(dob, currentDate).getYears();
    }
}
