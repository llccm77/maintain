from django.shortcuts import render
from django.http import HttpResponse
from .models import Dormitory, Student, RepairOrder


def index(request):
    """首页视图 - 显示简单的统计信息"""
    # 简单的统计数据
    total_orders = RepairOrder.objects.count()
    pending_orders = RepairOrder.objects.filter(status='pending').count()
    completed_orders = RepairOrder.objects.filter(status='completed').count()
    total_students = Student.objects.count()
    total_dormitories = Dormitory.objects.count()
    
    # 最新的几个报修工单
    recent_orders = RepairOrder.objects.select_related(
        'student', 'dormitory'
    ).order_by('-created_at')[:5]
    
    # 返回简单的HTML页面
    html_content = f"""
    <!DOCTYPE html>
    <html>
    <head>
        <meta charset="utf-8">
        <title>宿舍维修管理系统</title>
        <style>
            body {{ font-family: Arial, sans-serif; margin: 40px; background-color: #f5f5f5; }}
            .container {{ max-width: 1200px; margin: 0 auto; background: white; padding: 30px; border-radius: 8px; box-shadow: 0 2px 10px rgba(0,0,0,0.1); }}
            h1 {{ color: #333; text-align: center; margin-bottom: 30px; }}
            .stats {{ display: flex; justify-content: space-around; margin-bottom: 40px; }}
            .stat-card {{ background: #007bff; color: white; padding: 20px; border-radius: 8px; text-align: center; min-width: 150px; }}
            .stat-number {{ font-size: 2em; font-weight: bold; }}
            .stat-label {{ margin-top: 5px; }}
            .admin-link {{ display: block; text-align: center; margin: 30px 0; }}
            .admin-link a {{ background: #28a745; color: white; padding: 15px 30px; text-decoration: none; border-radius: 5px; font-size: 1.2em; }}
            .admin-link a:hover {{ background: #218838; }}
            .recent-orders {{ margin-top: 30px; }}
            .recent-orders h2 {{ color: #333; border-bottom: 2px solid #007bff; padding-bottom: 10px; }}
            .order-item {{ background: #f8f9fa; margin: 10px 0; padding: 15px; border-radius: 5px; border-left: 4px solid #007bff; }}
        </style>
    </head>
    <body>
        <div class="container">
            <h1>宿舍维修管理系统</h1>
            
            <div class="stats">
                <div class="stat-card">
                    <div class="stat-number">{total_orders}</div>
                    <div class="stat-label">总报修数</div>
                </div>
                <div class="stat-card">
                    <div class="stat-number">{pending_orders}</div>
                    <div class="stat-label">待处理</div>
                </div>
                <div class="stat-card">
                    <div class="stat-number">{completed_orders}</div>
                    <div class="stat-label">已完成</div>
                </div>
                <div class="stat-card">
                    <div class="stat-number">{total_students}</div>
                    <div class="stat-label">学生数</div>
                </div>
                <div class="stat-card">
                    <div class="stat-number">{total_dormitories}</div>
                    <div class="stat-label">宿舍数</div>
                </div>
            </div>
            
            <div class="admin-link">
                <a href="/admin/">进入管理后台</a>
            </div>
            
            <div class="recent-orders">
                <h2>最新报修工单</h2>
    """
    
    if recent_orders:
        for order in recent_orders:
            html_content += f"""
                <div class="order-item">
                    <strong>{order.order_number}</strong> - {order.title}<br>
                    <small>报修人: {order.student.name} | 宿舍: {order.dormitory} | 状态: {order.get_status_display()} | {order.created_at.strftime('%Y-%m-%d %H:%M')}</small>
                </div>
            """
    else:
        html_content += "<p>暂无报修工单</p>"
    
    html_content += """
            </div>
        </div>
    </body>
    </html>
    """
    
    return HttpResponse(html_content)
