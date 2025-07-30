import aiosmtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from app.core.config import settings


async def send_contact_notification(name: str, email: str, subject: str, message: str):
    """Send email notification when contact form is submitted"""
    
    # Create message
    msg = MIMEMultipart()
    msg['From'] = settings.FROM_EMAIL
    msg['To'] = settings.TO_EMAIL
    msg['Subject'] = f"Portfolio Contact: {subject}"
    
    # Create email body
    body = f"""
New contact form submission from your portfolio website:

Name: {name}
Email: {email}
Subject: {subject}

Message:
{message}

---
This email was sent automatically from your portfolio website.
    """
    
    msg.attach(MIMEText(body, 'plain'))
    
    # Send email
    try:
        await aiosmtplib.send(
            msg,
            hostname=settings.SMTP_HOST,
            port=settings.SMTP_PORT,
            start_tls=True,
            username=settings.SMTP_USER,
            password=settings.SMTP_PASSWORD,
        )
        return True
    except Exception as e:
        print(f"Failed to send email: {e}")
        return False


async def send_test_email():
    """Send a test email to verify configuration"""
    msg = MIMEText("This is a test email from your portfolio API.")
    msg['Subject'] = "Portfolio API Test Email"
    msg['From'] = settings.FROM_EMAIL
    msg['To'] = settings.TO_EMAIL
    
    try:
        await aiosmtplib.send(
            msg,
            hostname=settings.SMTP_HOST,
            port=settings.SMTP_PORT,
            start_tls=True,
            username=settings.SMTP_USER,
            password=settings.SMTP_PASSWORD,
        )
        return True
    except Exception as e:
        print(f"Failed to send test email: {e}")
        return False
