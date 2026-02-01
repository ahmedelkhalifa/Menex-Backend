package com.app.menex.imageService;

import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.io.IOException;
import java.nio.file.AccessDeniedException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;

@RestController
@RequestMapping("api")
@RequiredArgsConstructor
public class ImageController {

    @Value("${app.upload.dir}")
    private String uploadDir;

    @GetMapping("images/**")
    public ResponseEntity<byte[]> getImage(HttpServletRequest request) throws IOException {
        String imagePath = request.getRequestURI().replace("/api/images/", "");

        // handle null or empty imagePath
        if (imagePath.equals("null") || imagePath.isEmpty()) {
            Path path = Paths.get("uploads/image-placeholder/200x200.png");
            byte[] bytes = Files.readAllBytes(path);
            return ResponseEntity.ok()
                    .contentType(MediaType.IMAGE_PNG)
                    .body(bytes);
        }

        Path base = Paths.get(uploadDir).normalize();
        Path resolved = base.resolve(imagePath).normalize();

        // security check
        if (!resolved.startsWith(base)) {
            throw new AccessDeniedException("Invalid path");
        }

        // check if file exists
        if (!Files.exists(resolved)) {
            return ResponseEntity.notFound().build(); // or return a default image
        }

        byte[] bytes = Files.readAllBytes(resolved);
        String contentType = Files.probeContentType(resolved);

        return ResponseEntity.ok()
                .contentType(MediaType.parseMediaType(contentType))
                .body(bytes);
    }
}
