package com.example.nail.domain;

import com.example.nail.domain.eNum.ELock;
import com.example.nail.domain.eNum.ERole;
import com.example.nail.domain.eNum.EType;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDate;
import java.util.List;

@Getter
@Setter
@Entity
@NoArgsConstructor
@Table(name = "users")
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String userName;

    private String name;

    private String email;

    private String phone;

    private String password;

    private LocalDate dob;
    private Boolean deleted;

    @Enumerated(value = EnumType.STRING)
    private ELock eLock;

    @Enumerated(value = EnumType.STRING)
    private ERole eRole;

    @Enumerated(value = EnumType.STRING)
    private EType type;

    @ManyToOne
    private File avatar;

    @OneToMany(mappedBy = "user")
    private List<Bill> bills;
}
