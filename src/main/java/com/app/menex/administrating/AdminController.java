package com.app.menex.administrating;

import com.app.menex.administrating.dtos.DashboardDetails;
import com.app.menex.administrating.dtos.OwnerDashboardDetails;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/admin")
public class AdminController {

    private final AdminService adminService;

    public AdminController(AdminService adminService) {
        this.adminService = adminService;
    }

    @PreAuthorize("hasRole('SUPER_ADMIN')")
    @GetMapping("/dashboard")
    public ResponseEntity<DashboardDetails> getDashboard(){
        DashboardDetails dt = adminService.getAdminDashboardDetails();
        return ResponseEntity.ok(dt);
    }

    @PreAuthorize("hasRole('RESTAURANT_OWNER')")
    @GetMapping("/owner-dashboard")
    public ResponseEntity<OwnerDashboardDetails> getOwnerDashboard(){
        OwnerDashboardDetails dt = adminService.getOwnerDashboardDetails();
        return ResponseEntity.ok(dt);
    }
}
