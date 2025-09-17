// AI配置文件
export const AI_CONFIG = {
  // DeepSeek API配置
  DEEPSEEK_API_KEY: import.meta.env.VITE_DEEPSEEK_API_KEY,
  DEEPSEEK_API_URL: 'https://api.deepseek.com/v1/chat/completions',
  
  // 通义千问语音识别配置
  QWEN_API_KEY: import.meta.env.VITE_TONGYI_API_KEY || '',
  QWEN_ASR_URL: 'https://dashscope.aliyuncs.com/api/v1/services/aigc/multimodal-generation/generation',
  
  // 模型配置
  MODEL: 'deepseek-chat',
  QWEN_ASR_MODEL: 'paraformer-realtime-8k-v2',
  MAX_TOKENS: 2000,
  TEMPERATURE: 0.7,
  
  // 系统提示词 - 定义AI助手的角色
  SYSTEM_PROMPT: `你是一个专业的宿舍维修AI助手，名字叫"小维"。你的职责是：

1. 帮助学生诊断和解决宿舍维修问题
2. 提供专业的维修建议和操作指导
3. 判断问题的紧急程度，建议是否需要报修
4. 用温暖、专业、耐心的语气与用户交流

请注意：
- 回答要简洁明了，分步骤说明
- 涉及电气安全问题时，优先建议找专业人员
- 对于复杂问题，建议提交报修申请
- 保持友好和专业的语气
- 用中文回复`
}
