import json
import os
import smtplib
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText
from email.mime.application import MIMEApplication
from typing import Dict, Any, List
from io import BytesIO
from reportlab.lib import colors
from reportlab.lib.pagesizes import A4
from reportlab.platypus import SimpleDocTemplate, Table, TableStyle, Paragraph, Spacer
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.units import cm
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
from reportlab.lib.enums import TA_CENTER, TA_LEFT

def handler(event: Dict[str, Any], context: Any) -> Dict[str, Any]:
    '''
    Business: Send order email with PDF attachment containing order details
    Args: event with httpMethod, body containing order data
    Returns: HTTP response with success/error status
    '''
    method: str = event.get('httpMethod', 'POST')
    
    if method == 'OPTIONS':
        return {
            'statusCode': 200,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'POST, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type',
                'Access-Control-Max-Age': '86400'
            },
            'body': '',
            'isBase64Encoded': False
        }
    
    if method != 'POST':
        return {
            'statusCode': 405,
            'headers': {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            'body': json.dumps({'error': 'Method not allowed'}),
            'isBase64Encoded': False
        }
    
    body_data = json.loads(event.get('body', '{}'))
    
    customer_name: str = body_data.get('customerName', '')
    customer_email: str = body_data.get('customerEmail', '')
    customer_phone: str = body_data.get('customerPhone', '')
    customer_address: str = body_data.get('customerAddress', '')
    items: List[Dict] = body_data.get('items', [])
    total_price: int = body_data.get('totalPrice', 0)
    delivery_cost: int = body_data.get('deliveryCost', 0)
    final_price: int = body_data.get('finalPrice', 0)
    
    smtp_host = os.environ.get('SMTP_HOST')
    smtp_port = int(os.environ.get('SMTP_PORT', '587'))
    smtp_user = os.environ.get('SMTP_USER')
    smtp_password = os.environ.get('SMTP_PASSWORD')
    recipient_email = os.environ.get('RECIPIENT_EMAIL')
    
    if not all([smtp_host, smtp_user, smtp_password, recipient_email]):
        return {
            'statusCode': 500,
            'headers': {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            'body': json.dumps({'error': 'Email configuration missing'}),
            'isBase64Encoded': False
        }
    
    pdf_buffer = BytesIO()
    doc = SimpleDocTemplate(pdf_buffer, pagesize=A4, rightMargin=2*cm, leftMargin=2*cm, topMargin=2*cm, bottomMargin=2*cm)
    
    story = []
    styles = getSampleStyleSheet()
    
    title_style = ParagraphStyle(
        'CustomTitle',
        parent=styles['Heading1'],
        fontSize=18,
        textColor=colors.HexColor('#22c55e'),
        spaceAfter=20,
        alignment=TA_CENTER
    )
    
    story.append(Paragraph('Новый заказ - КФХ Бракнис', title_style))
    story.append(Spacer(1, 0.5*cm))
    
    customer_data = [
        ['Имя:', customer_name],
        ['Email:', customer_email],
        ['Телефон:', customer_phone],
        ['Адрес доставки:', customer_address]
    ]
    
    customer_table = Table(customer_data, colWidths=[4*cm, 12*cm])
    customer_table.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (0, -1), colors.HexColor('#f0f9ff')),
        ('TEXTCOLOR', (0, 0), (-1, -1), colors.black),
        ('ALIGN', (0, 0), (0, -1), 'RIGHT'),
        ('ALIGN', (1, 0), (1, -1), 'LEFT'),
        ('FONTNAME', (0, 0), (0, -1), 'Helvetica-Bold'),
        ('FONTSIZE', (0, 0), (-1, -1), 10),
        ('BOTTOMPADDING', (0, 0), (-1, -1), 8),
        ('TOPPADDING', (0, 0), (-1, -1), 8),
        ('GRID', (0, 0), (-1, -1), 0.5, colors.grey)
    ]))
    
    story.append(customer_table)
    story.append(Spacer(1, 1*cm))
    
    story.append(Paragraph('Состав заказа:', styles['Heading2']))
    story.append(Spacer(1, 0.3*cm))
    
    items_data = [['№', 'Наименование', 'Цена', 'Кол-во', 'Сумма']]
    
    for idx, item in enumerate(items, 1):
        items_data.append([
            str(idx),
            item.get('name', ''),
            f"{item.get('price', 0)} ₽",
            str(item.get('quantity', 0)),
            f"{item.get('price', 0) * item.get('quantity', 0)} ₽"
        ])
    
    items_table = Table(items_data, colWidths=[1.5*cm, 7*cm, 2.5*cm, 2*cm, 3*cm])
    items_table.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (-1, 0), colors.HexColor('#22c55e')),
        ('TEXTCOLOR', (0, 0), (-1, 0), colors.white),
        ('ALIGN', (0, 0), (-1, -1), 'CENTER'),
        ('FONTNAME', (0, 0), (-1, 0), 'Helvetica-Bold'),
        ('FONTSIZE', (0, 0), (-1, 0), 11),
        ('FONTSIZE', (0, 1), (-1, -1), 10),
        ('BOTTOMPADDING', (0, 0), (-1, -1), 8),
        ('TOPPADDING', (0, 0), (-1, -1), 8),
        ('GRID', (0, 0), (-1, -1), 0.5, colors.grey),
        ('ROWBACKGROUNDS', (0, 1), (-1, -1), [colors.white, colors.HexColor('#f9fafb')])
    ]))
    
    story.append(items_table)
    story.append(Spacer(1, 0.5*cm))
    
    totals_data = [
        ['Товары:', f"{total_price} ₽"],
        ['Доставка:', f"{delivery_cost} ₽" if delivery_cost > 0 else 'Бесплатно'],
        ['ИТОГО:', f"{final_price} ₽"]
    ]
    
    totals_table = Table(totals_data, colWidths=[13*cm, 3*cm])
    totals_table.setStyle(TableStyle([
        ('ALIGN', (0, 0), (0, -1), 'RIGHT'),
        ('ALIGN', (1, 0), (1, -1), 'RIGHT'),
        ('FONTNAME', (0, -1), (-1, -1), 'Helvetica-Bold'),
        ('FONTSIZE', (0, -1), (-1, -1), 12),
        ('FONTSIZE', (0, 0), (-1, -2), 10),
        ('LINEABOVE', (0, -1), (-1, -1), 1, colors.black),
        ('TOPPADDING', (0, 0), (-1, -1), 6),
        ('BOTTOMPADDING', (0, 0), (-1, -1), 6)
    ]))
    
    story.append(totals_table)
    
    doc.build(story)
    pdf_bytes = pdf_buffer.getvalue()
    pdf_buffer.close()
    
    msg = MIMEMultipart()
    msg['From'] = smtp_user
    msg['To'] = recipient_email
    msg['Subject'] = f'Новый заказ от {customer_name}'
    
    body = f"""
    <html>
    <body style="font-family: Arial, sans-serif;">
        <h2 style="color: #22c55e;">Новый заказ с сайта КФХ Бракнис</h2>
        <p><strong>Клиент:</strong> {customer_name}</p>
        <p><strong>Email:</strong> {customer_email}</p>
        <p><strong>Телефон:</strong> {customer_phone}</p>
        <p><strong>Адрес:</strong> {customer_address}</p>
        <p><strong>Сумма заказа:</strong> {final_price} ₽</p>
        <hr>
        <p>Подробная информация о заказе во вложенном PDF файле.</p>
    </body>
    </html>
    """
    
    msg.attach(MIMEText(body, 'html', 'utf-8'))
    
    pdf_attachment = MIMEApplication(pdf_bytes, _subtype='pdf')
    pdf_attachment.add_header('Content-Disposition', 'attachment', filename=f'order_{customer_name}.pdf')
    msg.attach(pdf_attachment)
    
    with smtplib.SMTP(smtp_host, smtp_port) as server:
        server.starttls()
        server.login(smtp_user, smtp_password)
        server.send_message(msg)
    
    return {
        'statusCode': 200,
        'headers': {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*'
        },
        'body': json.dumps({'success': True, 'message': 'Order sent successfully'}),
        'isBase64Encoded': False
    }
