package com.example.nail.service.auth;


import com.example.nail.domain.User;
import com.example.nail.domain.eNum.ELock;
import com.example.nail.domain.eNum.ERole;
import com.example.nail.domain.eNum.EType;
import com.example.nail.repository.UserRepository;
import com.example.nail.service.auth.request.RegisterRequest;
import com.example.nail.util.AppUtil;
import lombok.AllArgsConstructor;

import org.springframework.security.authentication.LockedException;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.validation.BindingResult;

import java.util.ArrayList;

@Service
@AllArgsConstructor
public class AuthService implements UserDetailsService {

    private final UserRepository userRepository;

    private final PasswordEncoder passwordEncoder;

    public void register(RegisterRequest request){
        var user = AppUtil.mapper.map(request, User.class);

        user.setERole(ERole.ROLE_USER);
        user.setPassword(passwordEncoder.encode(request.getPassWord()));
        user.setELock(ELock.UNLOCK);
        user.setType(EType.SILVER);
        user.setDeleted(false);
        userRepository.save(user);
    }

    public boolean checkNameOrPhoneOrEmail(RegisterRequest request, BindingResult result){
        boolean check = false;
        if(userRepository.existsByNameIgnoreCase(request.getName())){
            result.rejectValue("name", "name", "Tên người dùng đã tồn tại");
            check = true;
        }
        if(userRepository.existsByEmailIgnoreCase(request.getEmail())){
            result.rejectValue("email", "email", "Email đã tồn tại");
            check = true;
        }
        if(userRepository.existsByPhone(request.getPhone())){
            result.rejectValue("phone", "phone", "Số điện thoại đã tồn tại");
            check = true;
        }
        return check;
    }


    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        User user = userRepository.findByNameIgnoreCaseOrEmailIgnoreCaseOrPhone(username,username,username)
                .orElseThrow(() -> new UsernameNotFoundException("User not Exist") );
        if (user.getELock() == ELock.LOCK) {
            throw new LockedException("User account is locked");
        }

        var role = new ArrayList<SimpleGrantedAuthority>();
        role.add(new SimpleGrantedAuthority(user.getERole().toString()));

        return new org.springframework.security.core.userdetails.User(user.getName(), user.getPassword(), role);
    }
    // để làm 1. kiểm tra xem user có tồn tại trong hệ thông hay không và tìm bằng 3 field Username Email PhoneNumber
    // 2. Nếu có thì sẽ trả về User của .security.core.userdetails.User để nó lưu vô kho spring sercurity context holder
    // 3. nếu không thì trả ra message lỗi User not Exist
}