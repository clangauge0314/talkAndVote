# app/core/email_utils.py

from aiosmtplib import send
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from jinja2 import Template
from app.core.config import Config  # 환경 변수 사용

from aiosmtplib import send
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from app.core.config import Config  # 환경 변수 사용

async def send_email(to_email: str, subject: str, html_content: str):
    message = MIMEMultipart()
    message["From"] = f"{Config.EMAIL_FROM_NAME} <{Config.EMAIL_FROM}>"
    message["To"] = to_email
    message["Subject"] = subject

    message.attach(MIMEText(html_content, "html"))

    await send(
        message,
        hostname=Config.SMTP_HOST,
        port=Config.SMTP_PORT,
        username=Config.SMTP_USER,
        password=Config.SMTP_PASSWORD,
        start_tls=False  # MailHog는 TLS를 사용하지 않음
    )

def generate_verification_email(to_email: str, token: str) -> str:
    template = Template("""
    <h1>이메일 인증</h1>
    <p>다음 링크를 클릭하여 이메일 인증을 완료하세요:</p>
    <a href="{{ frontend_url }}/verify-email?token={{ token }}">이메일 인증하기</a>
    """)
    return template.render(frontend_url=Config.BACKEND_URL, token=token)
