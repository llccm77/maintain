from django.shortcuts import render
from django.http import HttpResponse, JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_http_methods
from django.contrib.auth import authenticate, login, logout
from django.contrib.auth.models import User
from django.db.models import Q
from .models import Dormitory, Student, RepairOrder
import json


def index(request):
    """首页视图 - 重定向到管理后台或返回API数据"""
    from django.shortcuts import redirect
    
    # 如果是API请求，返回JSON数据
    if request.META.get('HTTP_ACCEPT', '').find('application/json') != -1:
        return api_system_info(request)
    
    # 否则重定向到管理后台
    return redirect('/admin/')


# API 视图
@csrf_exempt
@require_http_methods(["GET"])
def api_health_check(request):
    """
    健康检查API - 用于前端测试连接
    """
    return JsonResponse({
        'status': 'success',
        'message': '后端连接正常',
        'code': 200,
        'data': {
            'server': 'Django',
            'version': '5.2.6',
            'app': '宿舍报修管理系统',
            'timestamp': '2025-09-08'
        }
    })


@csrf_exempt
@require_http_methods(["GET"])
def api_system_info(request):
    """
    系统信息API
    """
    # 简单的统计数据
    total_orders = RepairOrder.objects.count()
    pending_orders = RepairOrder.objects.filter(status='pending').count()
    completed_orders = RepairOrder.objects.filter(status='completed').count()
    total_students = Student.objects.count()
    total_dormitories = Dormitory.objects.count()
    
    return JsonResponse({
        'statistics': {
            'total_orders': total_orders,
            'pending_orders': pending_orders,
            'completed_orders': completed_orders,
            'total_students': total_students,
            'total_dormitories': total_dormitories
        },
        'system': {
            'name': '宿舍报修管理系统',
            'version': '1.0.0',
            'backend': 'Django 5.2.6'
        }
    })


# ========================
# 认证相关API
# ========================

@csrf_exempt
@require_http_methods(["POST"])
def api_login(request):
    """
    用户登录API - 前后端分离登录接口
    """
    try:
        # 解析JSON请求数据
        data = json.loads(request.body)
        username = data.get('username', '').strip()
        password = data.get('password', '')
        
        # 验证输入
        if not username or not password:
            return JsonResponse({
                'error': '请输入用户名和密码'
            }, status=400)
        
        # 认证用户
        user = authenticate(request, username=username, password=password)
        
        if user is not None:
            if user.is_active:
                # 登录用户
                login(request, user)
                
                # 返回成功响应
                return JsonResponse({
                    'message': '登录成功',
                    'token': request.session.session_key,  # 使用session作为token
                    'user': {
                        'id': user.id,
                        'username': user.username,
                        'email': user.email or '',
                        'first_name': user.first_name or '',
                        'last_name': user.last_name or '',
                        'is_staff': user.is_staff,
                        'is_superuser': user.is_superuser,
                    }
                })
            else:
                return JsonResponse({
                    'error': '账户被禁用，请联系管理员'
                }, status=403)
        else:
            return JsonResponse({
                'error': '用户名或密码错误'
            }, status=401)
            
    except json.JSONDecodeError:
        return JsonResponse({
            'error': '请求数据格式错误'
        }, status=400)
    except Exception as e:
        return JsonResponse({
            'error': f'服务器内部错误: {str(e)}'
        }, status=500)


@csrf_exempt
@require_http_methods(["POST"])
def api_logout(request):
    """
    用户登出API
    """
    try:
        logout(request)
        return JsonResponse({
            'status': 'success',
            'code': 200,
            'message': '登出成功'
        })
    except Exception as e:
        return JsonResponse({
            'status': 'error',
            'code': 500,
            'message': '登出失败',
            'error': str(e)
        }, status=500)


@csrf_exempt
@require_http_methods(["GET"])
def api_current_user(request):
    """
    获取当前用户信息API
    """
    try:
        if request.user.is_authenticated:
            return JsonResponse({
                'status': 'success',
                'code': 200,
                'data': {
                    'id': request.user.id,
                    'username': request.user.username,
                    'email': request.user.email or '',
                    'first_name': request.user.first_name or '',
                    'last_name': request.user.last_name or '',
                    'is_staff': request.user.is_staff,
                    'is_superuser': request.user.is_superuser,
                }
            })
        else:
            return JsonResponse({
                'status': 'error',
                'code': 401,
                'message': '未登录',
                'error': '用户未登录'
            }, status=401)
    except Exception as e:
        return JsonResponse({
            'status': 'error',
            'code': 500,
            'message': '获取用户信息失败',
            'error': str(e)
        }, status=500)


# ========================
# 报修工单相关API
# ========================

@csrf_exempt
def api_repair_orders(request):
    """
    报修工单API - 支持GET(列表)和POST(创建)
    """
    if request.method == 'GET':
        return _get_repair_orders_list(request)
    elif request.method == 'POST':
        return _create_repair_order(request)
    else:
        return JsonResponse({'error': '不支持的请求方法'}, status=405)


def _get_repair_orders_list(request):
    """
    获取报修工单列表
    """
    try:
        # 获取查询参数
        page = int(request.GET.get('page', 1))
        page_size = int(request.GET.get('page_size', 10))
        search = request.GET.get('search', '').strip()
        status = request.GET.get('status', '').strip()
        priority = request.GET.get('priority', '').strip()
        fault_type = request.GET.get('fault_type', '').strip()
        
        # 获取所有工单
        queryset = RepairOrder.objects.select_related(
            'student', 'dormitory'
        ).order_by('-created_at')
        
        # 应用筛选
        if search:
            queryset = queryset.filter(
                Q(order_number__icontains=search) |
                Q(title__icontains=search) |
                Q(student__name__icontains=search)
            )
        
        if status:
            queryset = queryset.filter(status=status)
            
        if priority:
            queryset = queryset.filter(priority=priority)
            
        if fault_type:
            queryset = queryset.filter(fault_type=fault_type)
        
        total_count = queryset.count()
        start_index = (page - 1) * page_size
        end_index = start_index + page_size
        page_orders = queryset[start_index:end_index]
        
        # 构造返回数据
        results = []
        for order in page_orders:
            results.append({
                'id': order.id,
                'order_number': order.order_number,
                'title': order.title,
                'description': order.description,
                'status': order.status,
                'priority': order.priority,
                'fault_type': order.fault_type,
                'student_name': order.student.name,
                'student_id': order.student.id,
                'dormitory_name': f"{order.dormitory.building_name}-{order.dormitory.room_number}",
                'dormitory_id': order.dormitory.id,
                'created_at': order.created_at.isoformat(),
                'updated_at': order.updated_at.isoformat()
            })
        
        return JsonResponse({
            'count': total_count,
            'next': page + 1 if end_index < total_count else None,
            'previous': page - 1 if page > 1 else None,
            'results': results
        })
        
    except Exception as e:
        return JsonResponse({
            'error': f'获取工单列表失败: {str(e)}'
        }, status=500)


def _create_repair_order(request):
    """
    创建报修工单
    """
    try:
        data = json.loads(request.body)
        
        # 获取学生和宿舍
        student = Student.objects.get(id=data['student_id'])
        dormitory = Dormitory.objects.get(id=data['dormitory_id'])
        
        # 创建工单
        order = RepairOrder.objects.create(
            title=data['title'],
            description=data['description'],
            fault_type=data.get('fault_type', 'other'),
            priority=data.get('priority', 'medium'),
            student=student,
            dormitory=dormitory
        )
        
        return JsonResponse({
            'message': '工单创建成功',
            'data': {
                'id': order.id,
                'order_number': order.order_number,
                'title': order.title,
                'status': order.status
            }
        }, status=201)
        
    except Student.DoesNotExist:
        return JsonResponse({'error': '学生不存在'}, status=404)
    except Dormitory.DoesNotExist:
        return JsonResponse({'error': '宿舍不存在'}, status=404)
    except Exception as e:
        return JsonResponse({
            'error': f'创建工单失败: {str(e)}'
        }, status=500)


@csrf_exempt
def api_repair_order_detail(request, order_id):
    """
    工单详情API - 支持GET(详情)、PUT/PATCH(更新)、DELETE(删除)
    """
    try:
        order = RepairOrder.objects.select_related('student', 'dormitory').get(id=order_id)
        
        if request.method == 'GET':
            return JsonResponse({
                'id': order.id,
                'order_number': order.order_number,
                'title': order.title,
                'description': order.description,
                'status': order.status,
                'priority': order.priority,
                'fault_type': order.fault_type,
                'student': {
                    'id': order.student.id,
                    'name': order.student.name,
                    'phone': order.student.phone
                },
                'dormitory': {
                    'id': order.dormitory.id,
                    'building_name': order.dormitory.building_name,
                    'room_number': order.dormitory.room_number
                },
                'created_at': order.created_at.isoformat(),
                'updated_at': order.updated_at.isoformat()
            })
            
        elif request.method in ['PUT', 'PATCH']:
            data = json.loads(request.body)
            
            # 更新字段
            if 'title' in data:
                order.title = data['title']
            if 'description' in data:
                order.description = data['description']
            if 'status' in data:
                order.status = data['status']
            if 'priority' in data:
                order.priority = data['priority']
            if 'fault_type' in data:
                order.fault_type = data['fault_type']
                
            order.save()
            
            return JsonResponse({
                'message': '工单更新成功',
                'data': {
                    'id': order.id,
                    'order_number': order.order_number,
                    'status': order.status
                }
            })
            
        elif request.method == 'DELETE':
            order.delete()
            return JsonResponse({'message': '工单删除成功'})
            
    except RepairOrder.DoesNotExist:
        return JsonResponse({'error': '工单不存在'}, status=404)
    except Exception as e:
        return JsonResponse({
            'error': f'操作失败: {str(e)}'
        }, status=500)


# ========================
# 学生管理API
# ========================

@csrf_exempt
def api_students(request):
    """
    学生管理API - 支持GET(列表)和POST(创建)
    """
    if request.method == 'GET':
        return _get_students_list(request)
    elif request.method == 'POST':
        return _create_student(request)
    else:
        return JsonResponse({'error': '不支持的请求方法'}, status=405)


def _get_students_list(request):
    """
    获取学生列表
    """
    try:
        # 获取查询参数
        page = int(request.GET.get('page', 1))
        page_size = int(request.GET.get('page_size', 12))
        search = request.GET.get('search', '').strip()
        building = request.GET.get('building', '').strip()
        has_dormitory = request.GET.get('has_dormitory', '').strip()
        
        # 获取所有学生
        queryset = Student.objects.select_related('dormitory').order_by('student_id')
        
        # 应用筛选
        if search:
            queryset = queryset.filter(
                Q(name__icontains=search) |
                Q(student_id__icontains=search) |
                Q(phone__icontains=search)
            )
        
        if building:
            queryset = queryset.filter(dormitory__building_name=building)
            
        if has_dormitory == 'true':
            queryset = queryset.filter(dormitory__isnull=False)
        elif has_dormitory == 'false':
            queryset = queryset.filter(dormitory__isnull=True)
        
        total_count = queryset.count()
        start_index = (page - 1) * page_size
        end_index = start_index + page_size
        page_students = queryset[start_index:end_index]
        
        # 构造返回数据
        results = []
        for student in page_students:
            # 获取报修统计
            repair_orders = RepairOrder.objects.filter(student=student)
            repair_summary = {
                'total': repair_orders.count(),
                'pending': repair_orders.filter(status='pending').count()
            }
            
            student_data = {
                'id': student.id,
                'student_id': student.student_id,
                'name': student.name,
                'phone': student.phone,
                'dormitory': None,
                'repair_summary': repair_summary
            }
            
            if student.dormitory:
                student_data['dormitory'] = {
                    'id': student.dormitory.id,
                    'building_name': student.dormitory.building_name,
                    'room_number': student.dormitory.room_number
                }
            
            results.append(student_data)
        
        return JsonResponse({
            'count': total_count,
            'next': page + 1 if end_index < total_count else None,
            'previous': page - 1 if page > 1 else None,
            'results': results
        })
        
    except Exception as e:
        return JsonResponse({
            'error': f'获取学生列表失败: {str(e)}'
        }, status=500)


def _create_student(request):
    """
    创建学生
    """
    try:
        data = json.loads(request.body)
        
        # 检查学号是否已存在
        if Student.objects.filter(student_id=data['student_id']).exists():
            return JsonResponse({'error': '学号已存在'}, status=400)
        
        # 创建学生
        student = Student.objects.create(
            student_id=data['student_id'],
            name=data['name'],
            phone=data['phone']
        )
        
        # 如果指定了宿舍，则分配宿舍
        if data.get('dormitory_id'):
            try:
                dormitory = Dormitory.objects.get(id=data['dormitory_id'])
                student.dormitory = dormitory
                student.save()
            except Dormitory.DoesNotExist:
                pass  # 忽略不存在的宿舍
        
        return JsonResponse({
            'message': '学生创建成功',
            'data': {
                'id': student.id,
                'student_id': student.student_id,
                'name': student.name
            }
        }, status=201)
        
    except Exception as e:
        return JsonResponse({
            'error': f'创建学生失败: {str(e)}'
        }, status=500)


@csrf_exempt
def api_student_detail(request, student_id):
    """
    学生详情API - 支持GET(详情)、PUT/PATCH(更新)、DELETE(删除)
    """
    try:
        student = Student.objects.select_related('dormitory').get(id=student_id)
        
        if request.method == 'GET':
            student_data = {
                'id': student.id,
                'student_id': student.student_id,
                'name': student.name,
                'phone': student.phone,
                'dormitory': None
            }
            
            if student.dormitory:
                student_data['dormitory'] = {
                    'id': student.dormitory.id,
                    'building_name': student.dormitory.building_name,
                    'room_number': student.dormitory.room_number
                }
            
            return JsonResponse(student_data)
            
        elif request.method in ['PUT', 'PATCH']:
            data = json.loads(request.body)
            
            # 更新字段
            if 'name' in data:
                student.name = data['name']
            if 'phone' in data:
                student.phone = data['phone']
            if 'dormitory_id' in data:
                if data['dormitory_id']:
                    try:
                        dormitory = Dormitory.objects.get(id=data['dormitory_id'])
                        student.dormitory = dormitory
                    except Dormitory.DoesNotExist:
                        return JsonResponse({'error': '宿舍不存在'}, status=404)
                else:
                    student.dormitory = None
                    
            student.save()
            
            return JsonResponse({
                'message': '学生信息更新成功',
                'data': {
                    'id': student.id,
                    'name': student.name
                }
            })
            
        elif request.method == 'DELETE':
            student.delete()
            return JsonResponse({'message': '学生删除成功'})
            
    except Student.DoesNotExist:
        return JsonResponse({'error': '学生不存在'}, status=404)
    except Exception as e:
        return JsonResponse({
            'error': f'操作失败: {str(e)}'
        }, status=500)


# ========================
# 宿舍管理API
# ========================

@csrf_exempt
def api_dormitories(request):
    """
    宿舍管理API - 支持GET(列表)和POST(创建)
    """
    if request.method == 'GET':
        return _get_dormitories_list(request)
    elif request.method == 'POST':
        return _create_dormitory(request)
    else:
        return JsonResponse({'error': '不支持的请求方法'}, status=405)


def _get_dormitories_list(request):
    """
    获取宿舍列表
    """
    try:
        # 获取查询参数
        page = int(request.GET.get('page', 1))
        page_size = int(request.GET.get('page_size', 12))
        search = request.GET.get('search', '').strip()
        building_name = request.GET.get('building_name', '').strip()
        floor = request.GET.get('floor', '').strip()
        
        # 获取所有宿舍
        queryset = Dormitory.objects.all().order_by('building_name', 'room_number')
        
        # 应用筛选
        if search:
            queryset = queryset.filter(
                Q(building_name__icontains=search) |
                Q(room_number__icontains=search)
            )
        
        if building_name:
            queryset = queryset.filter(building_name=building_name)
            
        if floor:
            queryset = queryset.filter(floor=int(floor))
        
        total_count = queryset.count()
        start_index = (page - 1) * page_size
        end_index = start_index + page_size
        page_dormitories = queryset[start_index:end_index]
        
        # 构造返回数据
        results = []
        for dormitory in page_dormitories:
            # 统计入住学生数和报修次数
            student_count = Student.objects.filter(dormitory=dormitory).count()
            repair_count = RepairOrder.objects.filter(dormitory=dormitory).count()
            
            results.append({
                'id': dormitory.id,
                'building_name': dormitory.building_name,
                'room_number': dormitory.room_number,
                'floor': dormitory.floor,
                'student_count': student_count,
                'repair_count': repair_count
            })
        
        return JsonResponse({
            'count': total_count,
            'next': page + 1 if end_index < total_count else None,
            'previous': page - 1 if page > 1 else None,
            'results': results
        })
        
    except Exception as e:
        return JsonResponse({
            'error': f'获取宿舍列表失败: {str(e)}'
        }, status=500)


def _create_dormitory(request):
    """
    创建宿舍
    """
    try:
        data = json.loads(request.body)
        
        # 检查宿舍是否已存在
        if Dormitory.objects.filter(
            building_name=data['building_name'],
            room_number=data['room_number']
        ).exists():
            return JsonResponse({'error': '宿舍已存在'}, status=400)
        
        # 创建宿舍
        dormitory = Dormitory.objects.create(
            building_name=data['building_name'],
            room_number=data['room_number'],
            floor=data['floor']
        )
        
        return JsonResponse({
            'message': '宿舍创建成功',
            'data': {
                'id': dormitory.id,
                'building_name': dormitory.building_name,
                'room_number': dormitory.room_number
            }
        }, status=201)
        
    except Exception as e:
        return JsonResponse({
            'error': f'创建宿舍失败: {str(e)}'
        }, status=500)


@csrf_exempt
def api_dormitory_detail(request, dormitory_id):
    """
    宿舍详情API - 支持GET(详情)、PUT/PATCH(更新)、DELETE(删除)
    """
    try:
        dormitory = Dormitory.objects.get(id=dormitory_id)
        
        if request.method == 'GET':
            # 获取入住学生列表
            students = Student.objects.filter(dormitory=dormitory)
            student_list = [{
                'id': s.id,
                'name': s.name,
                'student_id': s.student_id
            } for s in students]
            
            return JsonResponse({
                'id': dormitory.id,
                'building_name': dormitory.building_name,
                'room_number': dormitory.room_number,
                'floor': dormitory.floor,
                'students': student_list,
                'student_count': len(student_list)
            })
            
        elif request.method in ['PUT', 'PATCH']:
            data = json.loads(request.body)
            
            # 更新字段
            if 'building_name' in data:
                dormitory.building_name = data['building_name']
            if 'room_number' in data:
                dormitory.room_number = data['room_number']
            if 'floor' in data:
                dormitory.floor = data['floor']
                    
            dormitory.save()
            
            return JsonResponse({
                'message': '宿舍信息更新成功',
                'data': {
                    'id': dormitory.id,
                    'building_name': dormitory.building_name,
                    'room_number': dormitory.room_number
                }
            })
            
        elif request.method == 'DELETE':
            # 检查是否有学生入住
            if Student.objects.filter(dormitory=dormitory).exists():
                return JsonResponse({'error': '宿舍内有学生，无法删除'}, status=400)
            
            dormitory.delete()
            return JsonResponse({'message': '宿舍删除成功'})
            
    except Dormitory.DoesNotExist:
        return JsonResponse({'error': '宿舍不存在'}, status=404)
    except Exception as e:
        return JsonResponse({
            'error': f'操作失败: {str(e)}'
        }, status=500)
