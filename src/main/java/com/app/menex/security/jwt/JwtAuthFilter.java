package com.app.menex.security.jwt;

import io.jsonwebtoken.ExpiredJwtException;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.util.AntPathMatcher;
import org.springframework.web.filter.OncePerRequestFilter;
import org.springframework.web.util.WebUtils;

import java.io.IOException;
import java.util.List;

@RequiredArgsConstructor
@Component
public class JwtAuthFilter extends OncePerRequestFilter {

    private final JwtService jwtService;
    private final UserDetailsService userDetailsService;

    @Override
    protected void doFilterInternal
            (HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
            throws ServletException, IOException {
        String token = null;
        Cookie cookie = WebUtils.getCookie(request, "jwt");
        if (cookie != null) {
            token = cookie.getValue();
        }
        if (token != null) {
            try {
                String email = jwtService.getEmailFromToken(token);
                Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
                if (email != null && authentication == null) {
                    UserDetails userDetails = userDetailsService.loadUserByUsername(email);
                    if (jwtService.validateToken(token)) {
                        UsernamePasswordAuthenticationToken authenticationToken = new UsernamePasswordAuthenticationToken
                                (userDetails, null, userDetails.getAuthorities());
                        authenticationToken.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));
                        SecurityContextHolder.getContext().setAuthentication(authenticationToken);
                    }
                }
                filterChain.doFilter(request, response);
            } catch (ExpiredJwtException e) {
                response.setStatus(HttpStatus.UNAUTHORIZED.value());
                response.setContentType("application/json");
                response.getWriter().write("""
                        {
                          "message": "Your token is expired, please login again",
                          "status": 401
                        }
                    """);
                return;
            }
        } else  {
            filterChain.doFilter(request, response);
        }
    }

    private static final List<String> EXCLUDED_URLS = List.of(
            "/api/images/**",
            "/api/public/**",
            "/api/auth/verify",
            "/api/auth/resend-email",
            "/api/reset-password",
            "/api/verify-password-token",
            "/api/auth/reset-password",
            "/api/auth/login",
            "/api/auth/signup",
            "/api/webhooks/**",
            "/api/subscription/**"
    );

    private final AntPathMatcher pathMatcher = new AntPathMatcher();

    @Override
    protected boolean shouldNotFilter(HttpServletRequest request) throws ServletException {
        String path = request.getServletPath();
        // Tell the JWT filter to completely ignore any request to /api/public/**
        return EXCLUDED_URLS.stream().anyMatch(pattern -> pathMatcher.match(pattern, path));
    }
}
