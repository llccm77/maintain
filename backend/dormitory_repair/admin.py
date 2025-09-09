from django.contrib import admin
from .models import Dormitory, Student, RepairOrder


from django.contrib import admin
from django.utils.html import format_html
from django.db.models import Count
from .models import Dormitory, Student, RepairOrder


@admin.register(Dormitory)
class DormitoryAdmin(admin.ModelAdmin):
    list_display = ['display_dormitory_info', 'building_name', 'room_number', 'floor', 'display_student_count', 'display_repair_count']
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
    
    def display_student_count(self, obj):
        """统计宿舍学生数量"""
        count = obj.student_set.count()
        if count == 0:
            return format_html(
                '<div style="background: #FFF3E0; color: #F57C00; padding: 8px 12px; '
                'border-radius: 20px; text-align: center; border: 2px solid #FFB74D;">'
                '<i class="fa fa-bed"></i> 空宿舍'
                '</div>'
            )
        elif count <= 2:
            return format_html(
                '<div style="background: #E8F5E8; color: #2E7D32; padding: 8px 12px; '
                'border-radius: 20px; text-align: center; border: 2px solid #66BB6A;">'
                '<i class="fa fa-users"></i> {} 人入住'
                '</div>', count
            )
        else:
            return format_html(
                '<div style="background: #FFEBEE; color: #C62828; padding: 8px 12px; '
                'border-radius: 20px; text-align: center; border: 2px solid #EF5350;">'
                '<i class="fa fa-exclamation-triangle"></i> {} 人（超员）'
                '</div>', count
            )
    display_student_count.short_description = '👥 入住状态'
    
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
        return super().get_queryset(request).prefetch_related('student_set', 'repairorder_set')


@admin.register(Student)
class StudentAdmin(admin.ModelAdmin):
    list_display = ['display_student_card', 'display_student_id', 'display_contact', 'display_dorm_assignment', 'display_repair_history']
    list_filter = ['dormitory__building_name', 'dormitory__floor']
    search_fields = ['name', 'student_id', 'phone', 'user__username', 'dormitory__building_name', 'dormitory__room_number']
    ordering = ['student_id']
    list_select_related = ['user', 'dormitory']
    list_per_page = 30
    
    fieldsets = (
        ('👤 学生基本信息', {
            'fields': ('user', 'student_id', 'name'),
            'description': '学生的基本身份和账户信息'
        }),
        ('📞 联系方式', {
            'fields': ('phone',),
            'description': '学生的联系电话'
        }),
        ('🏠 宿舍分配', {
            'fields': ('dormitory',),
            'description': '学生所在宿舍信息'
        }),
    )
    
    def display_student_card(self, obj):
        """学生卡片式展示"""
        avatar_colors = ['#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7', '#DDA0DD', '#98D8C8']
        color = avatar_colors[hash(obj.name) % len(avatar_colors)]
        
        return format_html(
            '<div style="display: flex; align-items: center; padding: 10px; '
            'background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%); '
            'border-radius: 12px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">'
            '<div style="width: 50px; height: 50px; background: {}; '
            'border-radius: 50%; display: flex; align-items: center; justify-content: center; '
            'color: white; font-weight: bold; font-size: 20px; margin-right: 15px; '
            'box-shadow: 0 2px 8px rgba(0,0,0,0.2);">{}</div>'
            '<div>'
            '<div style="font-size: 16px; font-weight: bold; color: #2c3e50; margin-bottom: 3px;">{}</div>'
            '<div style="font-size: 12px; color: #7f8c8d; background: #ecf0f1; '
            'padding: 2px 8px; border-radius: 10px; display: inline-block;">学号: {}</div>'
            '</div>'
            '</div>',
            color, obj.name[0] if obj.name else 'S', obj.name, obj.student_id
        )
    display_student_card.short_description = '👤 学生信息'
    
    def display_student_id(self, obj):
        """学号展示"""
        return format_html(
            '<div style="background: #3498db; color: white; padding: 8px 15px; '
            'border-radius: 25px; text-align: center; font-weight: bold; '
            'box-shadow: 0 2px 5px rgba(52, 152, 219, 0.3);">'
            '<i class="fa fa-id-card"></i> {}'
            '</div>',
            obj.student_id
        )
    display_student_id.short_description = '🎫 学号'
    
    def display_contact(self, obj):
        """联系方式展示"""
        return format_html(
            '<div style="background: #2ecc71; color: white; padding: 8px 12px; '
            'border-radius: 20px; text-align: center;">'
            '<i class="fa fa-phone"></i> {}'
            '</div>',
            obj.phone
        )
    display_contact.short_description = '📞 联系电话'
    
    def display_dorm_assignment(self, obj):
        """宿舍分配状态"""
        if obj.dormitory:
            roommates_count = obj.dormitory.student_set.count()
            if roommates_count <= 2:
                status_color = '#27ae60'
                status_text = '正常入住'
            else:
                status_color = '#e74c3c'
                status_text = '宿舍超员'
                
            return format_html(
                '<div style="background: linear-gradient(135deg, #74b9ff 0%, #0984e3 100%); '
                'color: white; padding: 12px; border-radius: 15px; text-align: center; '
                'box-shadow: 0 3px 10px rgba(116, 185, 255, 0.3);">'
                '<div style="font-weight: bold; margin-bottom: 5px;">🏠 {}</div>'
                '<div style="font-size: 11px; opacity: 0.9;">第{}楼</div>'
                '<div style="background: {}; color: white; padding: 3px 8px; '
                'border-radius: 10px; font-size: 10px; margin-top: 5px;">{}</div>'
                '</div>',
                obj.dormitory, obj.dormitory.floor, status_color, status_text
            )
        return format_html(
            '<div style="background: #f39c12; color: white; padding: 12px; '
            'border-radius: 15px; text-align: center; box-shadow: 0 3px 10px rgba(243, 156, 18, 0.3);">'
            '<i class="fa fa-exclamation-triangle"></i><br/>'
            '<strong>未分配宿舍</strong>'
            '</div>'
        )
    display_dorm_assignment.short_description = '🏠 宿舍分配'
    
    def display_repair_history(self, obj):
        """报修历史状态"""
        pending_repairs = obj.repairorder_set.filter(status='pending').count()
        processing_repairs = obj.repairorder_set.filter(status='processing').count()
        total_repairs = obj.repairorder_set.count()
        
        if pending_repairs > 0:
            return format_html(
                '<div style="background: #e74c3c; color: white; padding: 10px; '
                'border-radius: 12px; text-align: center; animation: pulse 2s infinite;">'
                '<i class="fa fa-exclamation-circle"></i><br/>'
                '<strong>{} 个待处理</strong><br/>'
                '<small>总计: {} 次报修</small>'
                '</div>', pending_repairs, total_repairs
            )
        elif processing_repairs > 0:
            return format_html(
                '<div style="background: #f39c12; color: white; padding: 10px; '
                'border-radius: 12px; text-align: center;">'
                '<i class="fa fa-cog fa-spin"></i><br/>'
                '<strong>{} 个维修中</strong><br/>'
                '<small>总计: {} 次报修</small>'
                '</div>', processing_repairs, total_repairs
            )
        elif total_repairs > 0:
            return format_html(
                '<div style="background: #27ae60; color: white; padding: 10px; '
                'border-radius: 12px; text-align: center;">'
                '<i class="fa fa-check-circle"></i><br/>'
                '<strong>全部已完成</strong><br/>'
                '<small>总计: {} 次报修</small>'
                '</div>', total_repairs
            )
        return format_html(
            '<div style="background: #95a5a6; color: white; padding: 10px; '
            'border-radius: 12px; text-align: center;">'
            '<i class="fa fa-smile-o"></i><br/>'
            '<strong>无报修记录</strong>'
            '</div>'
        )
    display_repair_history.short_description = '🔧 报修状态'


@admin.register(RepairOrder)
class RepairOrderAdmin(admin.ModelAdmin):
    list_display = [
        'order_info', 'student_info', 'dormitory_info', 
        'fault_info', 'priority_display', 'status_display', 'time_info'
    ]
    list_filter = [
        'status', 'priority', 'fault_type', 
        'dormitory__building_name', 'created_at'
    ]
    search_fields = [
        'order_number', 'title', 'description', 
        'student__name', 'student__student_id'
    ]
    ordering = ['-created_at']
    list_select_related = ['student', 'dormitory', 'repair_worker']
    list_per_page = 20
    
    fieldsets = (
        ('📝 报修基本信息', {
            'fields': (
                'order_number', 'student', 'dormitory', 
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
            'description': '学生对维修服务的评价'
        }),
        ('🕰 时间记录', {
            'fields': ('created_at',),
            'classes': ('collapse',),
            'description': '工单的创建和完成时间'
        }),
    )
    
    readonly_fields = ['order_number', 'created_at']
    
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
    
    def student_info(self, obj):
        """学生信息"""
        return format_html(
            '<strong style="color: #1976D2;">{}</strong><br/>'
            '<small style="color: #666;">{}</small>',
            obj.student.name,
            obj.student.student_id
        )
    student_info.short_description = '👤 报修学生'
    
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
            'student', 'dormitory', 'repair_worker'
        )


# 自定义管理后台标题
admin.site.site_header = '宿舍维修管理系统'
admin.site.site_title = '宿舍维修管理'
admin.site.index_title = '欢迎使用宿舍维修管理系统'
