package com.anurag.email_client.controllers;

import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.anurag.email_client.services.EmailService;

@CrossOrigin(origins = "http://localhost:3000")
@RestController
@RequestMapping("/api/v1/email/send")
public class EmailController {

	private final EmailService emailService;

	EmailController(EmailService emailService) {
		this.emailService = emailService;
	}

	@PostMapping()
	public void sendEmail(String[] to, String subject, String text, boolean isHtml) {
		emailService.sendEmail(to, subject, text, isHtml);
	}

	@PostMapping("/attachment")
	public void sendEmailWithAttachment(String[] to,
			String subject,
			String text,
			MultipartFile file,
			boolean isHtml) {
		emailService.sendEmailWithAttachment(to, subject, text, isHtml, file);
	}

}
