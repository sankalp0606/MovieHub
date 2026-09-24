package com.movieapp.backend;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
public class MovieBackendApplication {

	public static void main(String[] args) {


		System.setProperty("https.protocols", "TLSv1.2");
		System.setProperty("jdk.tls.client.protocols", "TLSv1.2");

		SpringApplication.run(MovieBackendApplication.class, args);
	}

}
