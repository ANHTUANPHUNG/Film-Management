package com.example.nail.service.user.request;

import com.example.nail.service.request.SelectOptionRequest;
//import com.example.nail.service.user.UserService;
import com.example.nail.service.user.UserService;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.validation.Errors;
import org.springframework.validation.Validator;

import java.util.List;

import static org.apache.commons.lang3.StringUtils.isNumeric;

@Data
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


    }
}
