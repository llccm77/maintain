from django.urls import path
from . import views

app_name = 'dormitory_repair'

urlpatterns = [
    # 首页
    path('', views.index, name='index'),
    # 报修相关URL将在这里添加
]