from django.db import models
from django.contrib.auth.models import User
from django.core.validators import RegexValidator


class Dormitory(models.Model):
    """宿舍模型"""
    building_name = models.CharField('楼栋名称', max_length=50)
    room_number = models.CharField('房间号', max_length=20)
    floor = models.IntegerField('楼层')
    
    class Meta:
        verbose_name = '宿舍'
        verbose_name_plural = '宿舍管理'
        unique_together = ['building_name', 'room_number']
        ordering = ['building_name', 'floor', 'room_number']
    
    def __str__(self):
        return f"{self.building_name}-{self.room_number}"


class Student(models.Model):
    """学生模型"""
    user = models.OneToOneField(User, on_delete=models.CASCADE, verbose_name='用户账号')
    student_id = models.CharField('学号', max_length=20, unique=True)
    name = models.CharField('姓名', max_length=50)
    phone = models.CharField('联系电话', max_length=11,
                           validators=[RegexValidator(r'^1[3-9]\d{9}$', '请输入有效的手机号码')])
    dormitory = models.ForeignKey(Dormitory, on_delete=models.SET_NULL, 
                                null=True, blank=True, verbose_name='宿舍')
    
    class Meta:
        verbose_name = '学生'
        verbose_name_plural = '学生管理'
        ordering = ['student_id']
    
    def __str__(self):
        return f"{self.name}({self.student_id})"


class RepairOrder(models.Model):
    """报修工单模型"""
    STATUS_CHOICES = [
        ('pending', '待处理'),
        ('processing', '维修中'),
        ('completed', '已完成'),
        ('cancelled', '已取消'),
    ]
    
    FAULT_TYPE_CHOICES = [
        ('water', '水电故障'),
        ('furniture', '家具损坏'),
        ('door_window', '门窗问题'),
        ('network', '网络故障'),
        ('other', '其他问题'),
    ]
    
    PRIORITY_CHOICES = [
        ('low', '低'),
        ('medium', '中'),
        ('high', '高'),
        ('urgent', '紧急'),
    ]
    
    order_number = models.CharField('工单号', max_length=20, unique=True, blank=True)
    student = models.ForeignKey(Student, on_delete=models.CASCADE, verbose_name='报修学生')
    dormitory = models.ForeignKey(Dormitory, on_delete=models.CASCADE, verbose_name='宿舍')
    fault_type = models.CharField('故障类型', max_length=20, choices=FAULT_TYPE_CHOICES)
    title = models.CharField('故障标题', max_length=100)
    description = models.TextField('故障描述')
    priority = models.CharField('优先级', max_length=10, choices=PRIORITY_CHOICES, default='medium')
    status = models.CharField('状态', max_length=20, choices=STATUS_CHOICES, default='pending')
    
    # 时间记录
    created_at = models.DateTimeField('创建时间', auto_now_add=True)
    completed_at = models.DateTimeField('完成时间', null=True, blank=True)
    
    # 维修员和维修说明
    repair_worker = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, blank=True, 
                                    related_name='repair_orders', verbose_name='维修员')
    repair_notes = models.TextField('维修说明', blank=True)
    
    # 评价字段（简化在同一表中）
    rating = models.IntegerField('评分', null=True, blank=True, 
                               choices=[(1, '1分'), (2, '2分'), (3, '3分'), (4, '4分'), (5, '5分')])
    comment = models.TextField('评价内容', blank=True)
    
    class Meta:
        verbose_name = '报修工单'
        verbose_name_plural = '报修工单管理'
        ordering = ['-created_at']
    
    def __str__(self):
        return f"{self.order_number} - {self.title}"
    
    def save(self, *args, **kwargs):
        if not self.order_number:
            # 自动生成工单号
            import datetime
            now = datetime.datetime.now()
            self.order_number = f"R{now.strftime('%Y%m%d%H%M%S')}"
        super().save(*args, **kwargs)
