from django.urls import path
from . import views

app_name = 'dormitory_repair'

urlpatterns = [
    # 首页（通过 /api/ 访问）
    path('', views.index, name='index'),
    
    # API 路由
    path('health/', views.api_health_check, name='api_health_check'),
    path('system/info/', views.api_system_info, name='api_system_info'),
    
    # 认证相关API
    path('auth/login/', views.api_login, name='api_login'),
    path('auth/logout/', views.api_logout, name='api_logout'),
    path('auth/user/', views.api_current_user, name='api_current_user'),
    
    # 报修工单API
    path('repair-orders/', views.api_repair_orders, name='api_repair_orders'),
    path('repair-orders/<int:order_id>/', views.api_repair_order_detail, name='api_repair_order_detail'),
    
    # 学生管理API
    path('students/', views.api_students, name='api_students'),
    path('students/<int:student_id>/', views.api_student_detail, name='api_student_detail'),
    
    # 宿舍管理API
    path('dormitories/', views.api_dormitories, name='api_dormitories'),
    path('dormitories/<int:dormitory_id>/', views.api_dormitory_detail, name='api_dormitory_detail'),
]