package com.anurag.email_client.services;

import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import com.anurag.email_client.repositories.EmailRepository;

@Service
public class EmailService {

	private final EmailRepository emailRepository;

	EmailService(EmailRepository emailRepository) {
		this.emailRepository = emailRepository;
	}

	public void sendEmail(String[] to, String subject, String text, boolean isHtml) {
		emailRepository.sendEmail(to, subject, text, isHtml);
	}

	public void sendEmailWithAttachment(String[] to, String subject, String text, boolean isHtml, MultipartFile file) {
		emailRepository.sendEmailWithAttachment(to, subject, text, isHtml, file);
	}

}
