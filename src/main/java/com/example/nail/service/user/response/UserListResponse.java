package com.example.nail.service.user.response;

import lombok.Builder;
import lombok.Getter;
import lombok.Setter;
import org.springframework.validation.Errors;
import org.springframework.validation.Validator;

import java.math.BigDecimal;

@Getter
@Setter
@Builder
public class UserListResponse implements Validator {
    private Long id;
    private String name;
    private String userName;
    private String email;
    private String phone;
    private String dob;
    private String avatar;
    private String role;
    private String type;
    private String lock;

    @Override
    public boolean supports(Class<?> clazz) {
        return false;
    }

    @Override
    public void validate(Object target, Errors errors) {

    }
}
