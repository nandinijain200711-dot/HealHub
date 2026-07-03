import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from typing import List, Optional
from app.core.config import settings
import asyncio


async def send_email(
    to_email: str,
    subject: str,
    html_body: str,
    plain_body: Optional[str] = None
) -> bool:
    """
    Send email asynchronously
    
    Args:
        to_email: Recipient email address
        subject: Email subject
        html_body: Email body in HTML format
        plain_body: Email body in plain text format
    
    Returns:
        bool: True if successful, False otherwise
    """
    try:
        message = MIMEMultipart("alternative")
        message["Subject"] = subject
        message["From"] = f"{settings.SENDER_NAME} <{settings.SENDER_EMAIL}>"
        message["To"] = to_email
        
        # Add plain text part
        if plain_body:
            message.attach(MIMEText(plain_body, "plain"))
        
        # Add HTML part
        message.attach(MIMEText(html_body, "html"))
        
        # Send email in background to avoid blocking
        loop = asyncio.get_event_loop()
        await loop.run_in_executor(
            None,
            _send_smtp,
            message,
            to_email
        )
        
        return True
    except Exception as e:
        print(f"❌ Error sending email to {to_email}: {str(e)}")
        return False


def _send_smtp(message: MIMEMultipart, to_email: str):
    """Send email via SMTP (blocking operation)"""
    try:
        with smtplib.SMTP(settings.SMTP_SERVER, settings.SMTP_PORT) as server:
            server.starttls()
            server.login(settings.SMTP_USER, settings.SMTP_PASSWORD)
            server.send_message(message)
            print(f"✅ Email sent to {to_email}")
    except Exception as e:
        print(f"❌ SMTP Error: {str(e)}")
        raise


async def send_appointment_confirmation(
    user_email: str,
    user_name: str,
    appointment_date: str,
    appointment_time: str,
    reason: str,
    admin_email: str = None
) -> bool:
    """Send appointment confirmation email to user and admin"""
    
    # Email to user
    user_html = f"""
    <html>
        <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
            <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
                <h2 style="color: #0066cc;">Appointment Confirmed!</h2>
                <p>Dear <strong>{user_name}</strong>,</p>
                
                <p>Your appointment has been successfully booked. Here are the details:</p>
                
                <div style="background-color: #f5f5f5; padding: 15px; border-radius: 5px; margin: 20px 0;">
                    <p><strong>📅 Date:</strong> {appointment_date}</p>
                    <p><strong>⏰ Time:</strong> {appointment_time}</p>
                    <p><strong>🏥 Reason:</strong> {reason}</p>
                    <p><strong>📹 Join Video Call:</strong> <a href="{settings.GOOGLE_MEET_LINK}">{settings.GOOGLE_MEET_LINK}</a></p>
                </div>
                
                <p style="color: #666; font-size: 14px;">
                    <strong>Note:</strong> The meeting link is the same for all appointments. Please join 5 minutes before your scheduled time.
                </p>
                
                <p>If you need to reschedule or cancel, please reply to this email.</p>
                
                <p>Best regards,<br><strong>{settings.SENDER_NAME}</strong></p>
            </div>
        </body>
    </html>
    """
    
    user_text = f"""
    Appointment Confirmed!
    
    Dear {user_name},
    
    Your appointment has been successfully booked.
    
    Date: {appointment_date}
    Time: {appointment_time}
    Reason: {reason}
    Meet Link: {settings.GOOGLE_MEET_LINK}
    
    Best regards,
    {settings.SENDER_NAME}
    """
    
    user_result = await send_email(
        to_email=user_email,
        subject="Appointment Confirmation - HealHub",
        html_body=user_html,
        plain_body=user_text
    )
    
    # Email to admin
    if admin_email:
        admin_html = f"""
        <html>
            <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
                <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
                    <h2 style="color: #0066cc;">New Appointment Booking</h2>
                    
                    <div style="background-color: #f5f5f5; padding: 15px; border-radius: 5px; margin: 20px 0;">
                        <p><strong>Patient Name:</strong> {user_name}</p>
                        <p><strong>Email:</strong> {user_email}</p>
                        <p><strong>📅 Date:</strong> {appointment_date}</p>
                        <p><strong>⏰ Time:</strong> {appointment_time}</p>
                        <p><strong>Reason:</strong> {reason}</p>
                    </div>
                    
                    <p>Please review this appointment in your admin panel.</p>
                </div>
            </body>
        </html>
        """
        
        await send_email(
            to_email=admin_email,
            subject="New Appointment Booking - HealHub",
            html_body=admin_html
        )
    
    return user_result


async def send_welcome_email(user_email: str, user_name: str) -> bool:
    """Send welcome email to new user"""
    html_body = f"""
    <html>
        <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
            <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
                <h2 style="color: #0066cc;">Welcome to HealHub!</h2>
                <p>Dear <strong>{user_name}</strong>,</p>
                
                <p>Thank you for joining HealHub - Your AI-Powered Healthcare Platform.</p>
                
                <p>With HealHub, you can:</p>
                <ul>
                    <li>✅ Chat with our AI Health Assistant</li>
                    <li>✅ Get personalized health recommendations</li>
                    <li>✅ Book appointments with healthcare professionals</li>
                    <li>✅ Manage your health records</li>
                </ul>
                
                <p>Get started by exploring our AI Chatbot feature to discuss any health concerns.</p>
                
                <p style="color: #666; font-size: 14px;">
                    <strong>Disclaimer:</strong> HealHub's AI assistant provides general health information only and is not a substitute for professional medical advice.
                </p>
                
                <p>Best regards,<br><strong>{settings.SENDER_NAME}</strong></p>
            </div>
        </body>
    </html>
    """
    
    return await send_email(
        to_email=user_email,
        subject="Welcome to HealHub!",
        html_body=html_body
    )
