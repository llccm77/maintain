from django.contrib import admin
from django.utils.html import format_html
from django.db.models import Count
from .models import Dormitory, RepairOrder


@admin.register(Dormitory)
class DormitoryAdmin(admin.ModelAdmin):
    list_display = ['display_dormitory_info', 'building_name', 'room_number', 'floor', 'display_repair_count']
    list_filter = ['building_name', 'floor']
    search_fields = ['building_name', 'room_number']
    ordering = ['building_name', 'floor', 'room_number']
    list_per_page = 25
    
    fieldsets = (
        ('📍 宿舍基本信息', {
            'fields': ('building_name', 'room_number', 'floor'),
            'description': '宿舍的基本位置和标识信息'
        }),
    )
    
    def display_dormitory_info(self, obj):
        """宿舍信息展示"""
        return format_html(
            '<div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); '
            'color: white; padding: 12px; border-radius: 10px; text-align: center; '
            'box-shadow: 0 4px 8px rgba(0,0,0,0.1);">'
            '<strong style="font-size: 16px;">{}-{}</strong><br/>'
            '<small style="opacity: 0.9;">[第{}楼]</small>'
            '</div>',
            obj.building_name, obj.room_number, obj.floor
        )
    display_dormitory_info.short_description = '🏠 宿舍信息'
    
    def display_repair_count(self, obj):
        """统计报修次数"""
        total_count = obj.repairorder_set.count()
        pending_count = obj.repairorder_set.filter(status='pending').count()
        
        if total_count == 0:
            return format_html(
                '<div style="background: #E8F5E8; color: #2E7D32; padding: 8px 12px; '
                'border-radius: 15px; text-align: center;">'
                '<i class="fa fa-check-circle"></i> 无报修'
                '</div>'
            )
        elif pending_count > 0:
            return format_html(
                '<div style="background: #FFEBEE; color: #C62828; padding: 8px 12px; '
                'border-radius: 15px; text-align: center;">'
                '<i class="fa fa-exclamation-circle"></i> {}个待处理<br/>'
                '<small>总计: {}次</small>'
                '</div>', pending_count, total_count
            )
        else:
            return format_html(
                '<div style="background: #FFF3E0; color: #F57C00; padding: 8px 12px; '
                'border-radius: 15px; text-align: center;">'
                '<i class="fa fa-history"></i> 已完成<br/>'
                '<small>总计: {}次</small>'
                '</div>', total_count
            )
    display_repair_count.short_description = '🔧 维修记录'
    
    def get_queryset(self, request):
        return super().get_queryset(request).prefetch_related('repairorder_set')


@admin.register(RepairOrder)
class RepairOrderAdmin(admin.ModelAdmin):
    list_display = [
        'order_info', 'user_info', 'dormitory_info', 
        'fault_info', 'priority_display', 'status_display', 'time_info'
    ]
    list_filter = [
        'status', 'priority', 'fault_type', 
        'dormitory__building_name', 'created_at'
    ]
    search_fields = [
        'order_number', 'title', 'description', 
        'user__username', 'user__first_name', 'user__last_name'
    ]
    ordering = ['-created_at']
    list_select_related = ['user', 'dormitory', 'repair_worker']
    list_per_page = 20
    
    fieldsets = (
        ('📝 报修基本信息', {
            'fields': (
                'order_number', 'user', 'dormitory', 
                'fault_type', 'title', 'description'
            ),
            'description': '报修工单的基本信息和故障描述'
        }),
        ('🎨 工单状态管理', {
            'fields': ('priority', 'status'),
            'description': '设置工单的优先级和处理状态'
        }),
        ('🔧 维修信息', {
            'fields': (
                'repair_worker', 'repair_notes', 'completed_at'
            ),
            'description': '维修人员和维修说明'
        }),
        ('⭐ 评价信息', {
            'fields': ('rating', 'comment'),
            'classes': ('collapse',),
            'description': '用户对维修服务的评价'
        }),
        ('🕰 时间记录', {
            'fields': ('created_at', 'updated_at'),
            'classes': ('collapse',),
            'description': '工单的创建、更新和完成时间'
        }),
    )
    
    readonly_fields = ['order_number', 'created_at', 'updated_at']
    
    def order_info(self, obj):
        """工单信息展示"""
        return format_html(
            '<div style="background: linear-gradient(45deg, #FF6B6B, #4ECDC4); '
            'color: white; padding: 8px 12px; border-radius: 8px; text-align: center;">'
            '<strong>{}</strong><br/>'
            '<small>{}</small>'
            '</div>',
            obj.order_number,
            obj.title[:20] + '...' if len(obj.title) > 20 else obj.title
        )
    order_info.short_description = '📝 工单信息'
    
    def user_info(self, obj):
        """用户信息"""
        name = f"{obj.user.first_name} {obj.user.last_name}".strip() or obj.user.username
        return format_html(
            '<strong style="color: #1976D2;">{}</strong><br/>'
            '<small style="color: #666;">{}</small>',
            name,
            obj.user.username
        )
    user_info.short_description = '👤 报修用户'
    
    def dormitory_info(self, obj):
        """宿舍信息"""
        return format_html(
            '<div style="background: #E3F2FD; padding: 5px 8px; border-radius: 12px; text-align: center;">'
            '<strong style="color: #1565C0;">{}</strong><br/>'
            '<small style="color: #1976D2;">第{}楼</small>'
            '</div>',
            obj.dormitory,
            obj.dormitory.floor
        )
    dormitory_info.short_description = '🏠 故障宿舍'
    
    def fault_info(self, obj):
        """故障信息"""
        fault_colors = {
            'water': '#2196F3',
            'furniture': '#FF9800', 
            'door_window': '#4CAF50',
            'network': '#9C27B0',
            'other': '#607D8B'
        }
        color = fault_colors.get(obj.fault_type, '#607D8B')
        return format_html(
            '<span style="background: {}; color: white; padding: 3px 8px; '
            'border-radius: 12px; font-size: 12px; font-weight: bold;">{}</span>',
            color,
            obj.get_fault_type_display()
        )
    fault_info.short_description = '🔍 故障类型'
    
    def priority_display(self, obj):
        """优先级展示"""
        priority_colors = {
            'low': '#4CAF50',
            'medium': '#FF9800',
            'high': '#FF5722',
            'urgent': '#F44336'
        }
        color = priority_colors.get(obj.priority, '#607D8B')
        return format_html(
            '<span style="background: {}; color: white; padding: 3px 8px; '
            'border-radius: 8px; font-weight: bold;">{}</span>',
            color,
            obj.get_priority_display()
        )
    priority_display.short_description = '⚡ 优先级'
    
    def status_display(self, obj):
        """状态展示"""
        status_config = {
            'pending': ('#FF9800', '🕒'),
            'processing': ('#2196F3', '🔧'),
            'completed': ('#4CAF50', '✅'),
            'cancelled': ('#9E9E9E', '❌')
        }
        color, icon = status_config.get(obj.status, ('#607D8B', '📝'))
        return format_html(
            '<div style="text-align: center;">'
            '<div style="background: {}; color: white; padding: 5px 10px; '
            'border-radius: 15px; display: inline-block;">'
            '{} {}</div></div>',
            color, icon, obj.get_status_display()
        )
    status_display.short_description = '📊 工单状态'
    
    def time_info(self, obj):
        """时间信息"""
        return format_html(
            '<small style="color: #666;">'
            '📅 {}<br/>'
            '{}</small>',
            obj.created_at.strftime('%m-%d %H:%M'),
            '✅ 已完成' if obj.completed_at else '🕒 进行中'
        )
    time_info.short_description = '🕰 时间记录'
    
    def get_queryset(self, request):
        return super().get_queryset(request).select_related(
            'user', 'dormitory', 'repair_worker'
        )


# 自定义管理后台标题
admin.site.site_header = '宿舍维修管理系统'
admin.site.site_title = '宿舍维修管理'
admin.site.index_title = '欢迎使用宿舍维修管理系统'
