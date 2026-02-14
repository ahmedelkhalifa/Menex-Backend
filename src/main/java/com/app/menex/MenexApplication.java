package com.app.menex;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableScheduling;

@SpringBootApplication
@EnableScheduling
public class MenexApplication {

    public static void main(String[] args) {
        SpringApplication.run(MenexApplication.class, args);
    }

}
