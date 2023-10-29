package com.example.nail.service.file;

import com.cloudinary.Cloudinary;

import com.example.nail.domain.File;
import com.example.nail.repository.FileRepository;
import com.example.nail.util.UploadUtils;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;

@Service
@AllArgsConstructor
public class UploadFileService {

    private final Cloudinary cloudinary;

    private final FileRepository fileRepository;

    private final UploadUtils uploadUtils;

    public File saveAvatar(MultipartFile avatar) throws IOException {
        var file = new File();
        fileRepository.save(file);

        var uploadResult = cloudinary.uploader().upload(avatar.getBytes(), uploadUtils.buildImageUploadParams(file));

        String fileUrl = (String) uploadResult.get("secure_url");
        String fileFormat = (String) uploadResult.get("format");

        file.setFileName(file.getId() + "." + fileFormat);
        file.setFileUrl(fileUrl);
        file.setFileFolder(UploadUtils.IMAGE_UPLOAD_FOLDER);
        file.setCloudId(file.getFileFolder() + "/" + file.getId());
        fileRepository.save(file);
        return file;
    }

}