package com.example.nail.service.auth.request;

import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.validation.Errors;
import org.springframework.validation.Validator;

@Data
@NoArgsConstructor
public class RegisterRequest implements Validator {

    private String name;

    private String phone;

    private String passWord;

    private String email;

    @Override
    public boolean supports(Class<?> clazz) {
        return false;
    }

    @Override
    public void validate(Object target, Errors errors) {

    }
}
