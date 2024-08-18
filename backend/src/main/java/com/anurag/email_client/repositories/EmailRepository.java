package com.anurag.email_client.repositories;

import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Repository;
import org.springframework.web.multipart.MultipartFile;

import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;

@Repository
public class EmailRepository {

	private final JavaMailSender javaMailSender;

	EmailRepository(JavaMailSender javaMailSender) {
		this.javaMailSender = javaMailSender;
	}

	public void sendEmail(String[] to, String subject, String text, boolean isHtml) {
		MimeMessage message = javaMailSender.createMimeMessage();
		MimeMessageHelper helper = new MimeMessageHelper(message);
		try {
			helper.setTo(to);
			helper.setSubject(subject);
			helper.setText(text, isHtml);
		} catch (MessagingException e) {
			e.printStackTrace();
		}
		javaMailSender.send(message);
	}

	public void sendEmailWithAttachment(String[] to, String subject, String text, boolean isHtml, MultipartFile file) {
		MimeMessage message = javaMailSender.createMimeMessage();
		MimeMessageHelper helper;

		try {
			helper = new MimeMessageHelper(message, true);
			helper.setTo(to);
			helper.setSubject(subject);
			helper.setText(text, isHtml);
			String filename = file.getOriginalFilename();
			if (filename != null) {
				helper.addAttachment(filename, file);
			} else {
				helper.addAttachment("Untitled", file);
			}
			
		} catch (MessagingException e) {
			e.printStackTrace();
		}

		javaMailSender.send(message);
	}

}
