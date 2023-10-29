package com.example.nail.controller.rest;



import com.example.nail.domain.File;
import com.example.nail.service.file.UploadFileService;
import lombok.AllArgsConstructor;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;

@RestController
@RequestMapping("/api/files")
@AllArgsConstructor
public class FileRestController {
    private final UploadFileService uploadFileService;

    @PostMapping
    public File upload(@RequestParam("avatar") MultipartFile avatar) throws IOException {
        return uploadFileService.saveAvatar(avatar);
    }
//    @PostMapping
//    public File upload1(@RequestParam("poster") MultipartFile poster,@RequestParam("image") MultipartFile image) throws IOException {
//        return uploadFileService.saveAvatar(avatar);
//    }
    @PostMapping("/images")
    public File uploadImage(@RequestParam("images") MultipartFile avatar) throws IOException {
        return uploadFileService.saveAvatar(avatar);
    }
    @PostMapping("/posters")
    public File uploadPost(@RequestParam("poster") MultipartFile avatar) throws IOException {
        return uploadFileService.saveAvatar(avatar);
    }
}