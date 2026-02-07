package com.app.menex.administrating;

import com.app.menex.administrating.dtos.DashboardDetails;
import com.app.menex.administrating.dtos.OwnerDashboardDetails;
import com.app.menex.administrating.dtos.ViewsDetails;
import com.app.menex.administrating.dtos.ViewsPerRes;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.HashMap;

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

    @PreAuthorize("hasRole('RESTAURANT_OWNER')")
    @GetMapping("owner-dashboard/views")
    public ResponseEntity<ViewsDetails> getOwnerDashboardViews(){
        ViewsDetails vd = adminService.getViews();
        return ResponseEntity.ok(vd);
    }

    @PreAuthorize("hasRole('RESTAURANT_OWNER')")
    @GetMapping("owner-dashboard/restaurants")
    public ResponseEntity<HashMap<String, Long>> getRestaurants(){
        HashMap<String, Long> restaurantsDto = adminService.getRestaurants();
        return ResponseEntity.ok(restaurantsDto);
    }

    @PreAuthorize("hasRole('RESTAURANT_OWNER')")
    @GetMapping("owner-dashboard/views/{restaurantId}")
    public ResponseEntity<ViewsPerRes> getDetailedViews(@PathVariable Long restaurantId){
        ViewsPerRes views = adminService.getDetailedViews(restaurantId);
        return ResponseEntity.ok(views);
    }
}
