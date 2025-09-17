<template>
  <div class="contact-page">
    <div class="page-header">
      <h1>联系我们</h1>
      <p class="subtitle">如有任何问题或建议，请通过以下方式联系我们</p>
    </div>

    <div class="contact-content">
      <!-- 联系信息卡片 -->
      <div class="contact-cards">
        <el-card class="contact-card">
          <template #header>
            <div class="card-header">
              <el-icon><Location /></el-icon>
              <span>校区地址</span>
            </div>
          </template>
          <div class="card-content">
            <p>主校区：桥东区</p>
            <p>地址：河北省张家口市桥东区朝阳西大街</p>
            <p>邮编：075000</p>
          </div>
        </el-card>

        <el-card class="contact-card">
          <template #header>
            <div class="card-header">
              <el-icon><Phone /></el-icon>
              <span>联系电话</span>
            </div>
          </template>
          <div class="card-content">
            <p>宿舍管理中心：020-12345678</p>
            <p>维修服务热线：020-87654321</p>
            <p>紧急故障报修：13800138000</p>
          </div>
        </el-card>

        <el-card class="contact-card">
          <template #header>
            <div class="card-header">
              <el-icon><Message /></el-icon>
              <span>电子邮箱</span>
            </div>
          </template>
          <div class="card-content">
            <p>宿舍管理：dormitory@university.edu.cn</p>
            <p>维修服务：repair@university.edu.cn</p>
            <p>意见反馈：feedback@university.edu.cn</p>
          </div>
        </el-card>

        <el-card class="contact-card">
          <template #header>
            <div class="card-header">
              <el-icon><Clock /></el-icon>
              <span>服务时间</span>
            </div>
          </template>
          <div class="card-content">
            <p>周一至周五：8:00 - 22:00</p>
            <p>周六至周日：9:00 - 18:00</p>
            <p>节假日：10:00 - 16:00</p>
          </div>
        </el-card>
      </div>

      <!-- 留言表单 -->
      <div class="message-form-section">
        <h2>给我们留言</h2>
        <el-form :model="messageForm" :rules="rules" ref="messageFormRef" label-position="top">
          <el-form-item label="姓名" prop="name">
            <el-input v-model="messageForm.name" placeholder="请输入您的姓名"></el-input>
          </el-form-item>
          
          <el-form-item label="联系方式" prop="contact">
            <el-input v-model="messageForm.contact" placeholder="请输入您的手机号或邮箱"></el-input>
          </el-form-item>
          
          <el-form-item label="宿舍信息" prop="dormitory">
            <el-input v-model="messageForm.dormitory" placeholder="请输入您的宿舍楼栋和房间号"></el-input>
          </el-form-item>
          
          <el-form-item label="留言内容" prop="message">
            <el-input 
              v-model="messageForm.message" 
              type="textarea" 
              :rows="4" 
              placeholder="请详细描述您的问题或建议"
            ></el-input>
          </el-form-item>
          
          <el-form-item>
            <el-button type="primary" @click="submitMessage">提交留言</el-button>
            <el-button @click="resetForm">重置</el-button>
          </el-form-item>
        </el-form>
      </div>
    </div>

    <!-- 校园地图 -->
    <div class="campus-map-section">
      <h2>校园地图</h2>
      <div class="map-wrapper">
        <div class="map-container">
          <img src="/images/xiaoyuanditu.jpg" alt="校园地图" class="campus-map" />
        </div>
        <div class="map-info">
          <h3>校区导航</h3>
          <p>我校位于河北省张家口市桥东区朝阳西大街，校园占地面积约810亩，环境优美，设施完善。</p>
          <div class="map-landmarks">
            <h4>主要地标</h4>
            <ul>
              <li><span class="landmark-icon admin"></span> 明德楼 - 位于校园中心偏北</li>
              <li><span class="landmark-icon dorm"></span> 学生宿舍区 - 位于校园东南角</li>
              <li><span class="landmark-icon lib"></span> 图书馆 - 位于校园中心位置</li>
              <li><span class="landmark-icon sport"></span> 体育场 - 位于校园南部中央</li>
              <li><span class="landmark-icon canteen"></span> 食堂 - 位于宿舍区附近</li>
            </ul>
          </div>
          
        </div>
      </div>
    </div>

    <!-- 常见问题 FAQ -->
    <div class="faq-section">
      <h2>常见问题</h2>
      <el-collapse accordion>
        <el-collapse-item title="如何申请宿舍维修服务？" name="1">
          <div>您可以通过以下方式申请宿舍维修服务：</div>
          <div>1. 在本系统首页点击"我要报修"按钮</div>
          <div>2. 拨打维修服务热线：020-87654321</div>
          <div>3. 前往宿舍管理中心服务大厅填写维修申请表</div>
        </el-collapse-item>
        
        <el-collapse-item title="维修服务需要多长时间？" name="2">
          <div>一般情况下，我们会在24小时内响应您的维修请求。</div>
          <div>- 紧急维修（如水电故障）：2-4小时内</div>
          <div>- 一般维修：24小时内</div>
          <div>- 大型维修项目：3-5个工作日</div>
        </el-collapse-item>
        
        <el-collapse-item title="维修服务是否收费？" name="3">
          <div>基本维修服务是免费的，包括：</div>
          <div>- 水电设施维修</div>
          <div>- 门窗家具维修</div>
          <div>- 公共设施维修</div>
          <div>但因个人原因导致的损坏可能会收取适当的材料费用。</div>
        </el-collapse-item>
        
        <el-collapse-item title="如何查询维修进度？" name="4">
          <div>您可以通过以下方式查询维修进度：</div>
          <div>1. 登录本系统，点击"我的报修"查看工单状态</div>
          <div>2. 拨打维修服务热线查询</div>
        </el-collapse-item>
      </el-collapse>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { ElMessage } from 'element-plus'
import { Location, Phone, Message, Clock } from '@element-plus/icons-vue'

// 表单数据
const messageFormRef = ref(null)
const messageForm = reactive({
  name: '',
  contact: '',
  dormitory: '',
  message: ''
})

// 表单验证规则
const rules = {
  name: [
    { required: true, message: '请输入您的姓名', trigger: 'blur' },
    { min: 2, max: 20, message: '长度在 2 到 20 个字符', trigger: 'blur' }
  ],
  contact: [
    { required: true, message: '请输入您的联系方式', trigger: 'blur' }
  ],
  dormitory: [
    { required: true, message: '请输入您的宿舍信息', trigger: 'blur' }
  ],
  message: [
    { required: true, message: '请输入留言内容', trigger: 'blur' },
    { min: 5, max: 500, message: '长度在 5 到 500 个字符', trigger: 'blur' }
  ]
}

// 提交留言
const submitMessage = async () => {
  if (!messageFormRef.value) return
  
  await messageFormRef.value.validate((valid, fields) => {
    if (valid) {
      // 这里可以添加API调用，将留言提交到后端
      console.log('提交留言:', messageForm)
      
      // 模拟提交成功
      ElMessage.success('留言提交成功，我们会尽快回复您！')
      resetForm()
    } else {
      console.log('表单验证失败:', fields)
      ElMessage.error('请完善表单信息')
    }
  })
}

// 重置表单
const resetForm = () => {
  if (messageFormRef.value) {
    messageFormRef.value.resetFields()
  }
}
</script>

<style scoped>
.contact-page {
  padding: 24px;
  max-width: 1200px;
  margin: 0 auto;
}

.page-header {
  text-align: center;
  margin-bottom: 40px;
}

.page-header h1 {
  font-size: 32px;
  color: #2c3e50;
  margin-bottom: 12px;
}

.subtitle {
  font-size: 16px;
  color: #7f8c8d;
}

.contact-content {
  display: flex;
  flex-direction: column;
  gap: 40px;
}

.contact-cards {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 20px;
}

.contact-card {
  height: 100%;
  transition: all 0.3s ease;
}

.contact-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.1);
}

.card-header {
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 18px;
  font-weight: 600;
}

.card-content {
  padding: 10px 0;
}

.card-content p {
  margin: 8px 0;
  line-height: 1.5;
}

.message-form-section {
  background-color: #f8f9fa;
  padding: 30px;
  border-radius: 8px;
  margin-top: 20px;
}

.message-form-section h2 {
  margin-bottom: 20px;
  font-size: 24px;
  color: #2c3e50;
}

.campus-map-section {
  margin-top: 40px;
}

.campus-map-section h2 {
  margin-bottom: 20px;
  font-size: 24px;
  color: #2c3e50;
}

.map-wrapper {
  display: flex;
  flex-direction: row;
  gap: 20px;
  margin-bottom: 30px;
}

.map-container {
  flex: 1;
  height: 500px;
  background-color: #eee;
  border-radius: 8px;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.campus-map {
  max-width: 100%;
  max-height: 100%;
  object-fit: contain;
}

.map-info {
  flex: 1;
  padding: 20px;
  background-color: #f8f9fa;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.map-info h3 {
  font-size: 20px;
  color: #2c3e50;
  margin-bottom: 15px;
  border-bottom: 2px solid #409EFF;
  padding-bottom: 10px;
}

.map-info h4 {
  font-size: 18px;
  color: #2c3e50;
  margin: 15px 0 10px;
}

.map-info p {
  margin-bottom: 15px;
  line-height: 1.6;
}

.map-landmarks ul, .map-directions ul {
  padding-left: 20px;
  margin-bottom: 15px;
}

.map-landmarks li, .map-directions li {
  margin-bottom: 8px;
  position: relative;
  padding-left: 5px;
}

.landmark-icon {
  display: inline-block;
  width: 12px;
  height: 12px;
  border-radius: 50%;
  margin-right: 8px;
}

.landmark-icon.admin {
  background-color: #409EFF;
}

.landmark-icon.dorm {
  background-color: #67C23A;
}

.landmark-icon.lib {
  background-color: #E6A23C;
}

.landmark-icon.sport {
  background-color: #F56C6C;
}

.landmark-icon.canteen {
  background-color: #909399;
}

.faq-section {
  margin-top: 40px;
  margin-bottom: 40px;
}

.faq-section h2 {
  margin-bottom: 20px;
  font-size: 24px;
  color: #2c3e50;
}

@media (max-width: 768px) {
  .contact-cards {
    grid-template-columns: 1fr;
  }
  
  .map-wrapper {
    flex-direction: column;
  }
  
  .map-container {
    height: 300px;
  }
  
  .map-info {
    margin-top: 20px;
  }
}
</style>