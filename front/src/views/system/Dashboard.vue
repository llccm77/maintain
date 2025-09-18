<template>
  <div class="dashboard">
    <!-- 悬浮装饰图标 -->
    <div class="floating-icons">
      <!-- 宿舍图标 -->
      <div class="floating-icon">
        <svg width="48" height="48" viewBox="0 0 24 24" fill="none">
          <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z" fill="#FFB6C1" opacity="0.6"/>
          <circle cx="8" cy="16" r="1" fill="#FF69B4" opacity="0.8"/>
          <circle cx="16" cy="16" r="1" fill="#FF69B4" opacity="0.8"/>
        </svg>
      </div>
      
      <!-- 扳手图标 -->
      <div class="floating-icon">
        <svg width="40" height="40" viewBox="0 0 24 24" fill="none">
          <path d="M22.7 19l-9.1-9.1c.9-2.3.4-5-1.5-6.9-2-2-5-2.4-7.4-1.3L9 6 6 9 1.6 4.7C.4 7.1.9 10.1 2.9 12.1c1.9 1.9 4.6 2.4 6.9 1.5l9.1 9.1c.4.4 1 .4 1.4 0l2.3-2.3c.5-.4.5-1.1.1-1.4z" fill="#87CEEB" opacity="0.7"/>
        </svg>
      </div>
      
      <!-- 螺丝刀图标 -->
      <div class="floating-icon">
        <svg width="36" height="36" viewBox="0 0 24 24" fill="none">
          <path d="M16.06 10.94L12 15l-1.06-1.06L15 10l1.06.94zM4 2l2 2-2 2-2-2 2-2zm16 16l-2 2-2-2 2-2 2 2z" fill="#DDA0DD" opacity="0.6"/>
          <path d="M8.5 8.5L12 12l7-7-1-1-7 7L8.5 8.5z" stroke="#9370DB" stroke-width="1.5" fill="none" opacity="0.8"/>
        </svg>
      </div>
      
      <!-- 维修工具箱图标 -->
      <div class="floating-icon">
        <svg width="44" height="44" viewBox="0 0 24 24" fill="none">
          <rect x="3" y="8" width="18" height="10" rx="2" fill="#F0E68C" opacity="0.6"/>
          <path d="M8 8V6a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" stroke="#DAA520" stroke-width="2" fill="none" opacity="0.8"/>
          <circle cx="12" cy="13" r="2" fill="#DAA520" opacity="0.7"/>
        </svg>
      </div>
      
      <!-- 水管图标 -->
      <div class="floating-icon">
        <svg width="42" height="42" viewBox="0 0 24 24" fill="none">
          <path d="M18 8h-1V6c0-2.76-2.24-5-5-5S7 3.24 7 6v2H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2z" fill="#20B2AA" opacity="0.6"/>
          <circle cx="12" cy="15" r="2" fill="#008B8B" opacity="0.8"/>
        </svg>
      </div>
      
      <!-- 电灯泡图标 -->
      <div class="floating-icon">
        <svg width="38" height="38" viewBox="0 0 24 24" fill="none">
          <path d="M9 21c0 .5.4 1 1 1h4c.6 0 1-.5 1-1v-1H9v1zm3-19C8.1 2 5 5.1 5 9c0 2.4 1.2 4.5 3 5.7V17h8v-2.3c1.8-1.2 3-3.3 3-5.7 0-3.9-3.1-7-7-7z" fill="#FFD700" opacity="0.7"/>
          <circle cx="12" cy="9" r="3" fill="#FFA500" opacity="0.5"/>
        </svg>
      </div>
    </div>
    <!-- 温馨问候与核心功能区 -->
    <div class="greeting-section">
      <!-- 中午好模块的悬浮装饰图标 -->
      <div class="greeting-floating-icons">
        <div class="greeting-float-icon greeting-icon-1">
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none">
            <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z" fill="#FFB6C1" opacity="0.5"/>
            <circle cx="8" cy="16" r="1" fill="#FF69B4" opacity="0.7"/>
            <circle cx="16" cy="16" r="1" fill="#FF69B4" opacity="0.7"/>
          </svg>
        </div>
        <div class="greeting-float-icon greeting-icon-2">
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
            <path d="M9 21c0 .5.4 1 1 1h4c.6 0 1-.5 1-1v-1H9v1zm3-19C8.1 2 5 5.1 5 9c0 2.4 1.2 4.5 3 5.7V17h8v-2.3c1.8-1.2 3-3.3 3-5.7 0-3.9-3.1-7-7-7z" fill="#FFD700" opacity="0.6"/>
            <circle cx="12" cy="9" r="2" fill="#FFA500" opacity="0.4"/>
          </svg>
        </div>
        <div class="greeting-float-icon greeting-icon-3">
          <svg width="30" height="30" viewBox="0 0 24 24" fill="none">
            <circle cx="12" cy="12" r="8" fill="#FFE4B5" opacity="0.5"/>
            <circle cx="9" cy="9" r="1" fill="#F4A460" opacity="0.8"/>
            <circle cx="15" cy="9" r="1" fill="#F4A460" opacity="0.8"/>
            <path d="M8 15s1.5 2 4 2 4-2 4-2" stroke="#F4A460" stroke-width="2" stroke-linecap="round" fill="none" opacity="0.8"/>
          </svg>
        </div>
      </div>
      <div class="greeting-content">
        <div class="greeting-icon">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
            <circle cx="12" cy="12" r="10" fill="#FFE4B5" stroke="#F4A460" stroke-width="2"/>
            <circle cx="9" cy="9" r="1.5" fill="#F4A460"/>
            <circle cx="15" cy="9" r="1.5" fill="#F4A460"/>
            <path d="M8 15s1.5 2 4 2 4-2 4-2" stroke="#F4A460" stroke-width="2" stroke-linecap="round"/>
          </svg>
        </div>
        <h1 class="greeting-title">{{ getGreeting() }}，{{ getCurrentUserName() }}！</h1>
        <p class="greeting-subtitle">{{ getGreetingMessage() }}</p>
      </div>
      
      <!-- 核心功能按钮 -->
      <div class="main-action">
        <el-button 
          type="primary" 
          size="large" 
          class="repair-button"
          @click="startRepair"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" class="repair-icon">
            <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.77 3.77z" fill="currentColor"/>
          </svg>
          发起报修
        </el-button>
        <p class="action-tip">有任何宿舍问题，我们随时为您解决</p>
      </div>
    </div>

    <!-- 您的报修状态 -->
    <div class="status-section">
      <div class="status-content">
        <div class="status-icon">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
            <circle cx="12" cy="12" r="3" fill="#87CEEB"/>
            <path d="M12 1v6m0 6v6m11-7h-6m-6 0H1" stroke="#87CEEB" stroke-width="2"/>
          </svg>
        </div>
        <span class="status-text">{{ getStatusMessage() }}</span>
      </div>
    </div>

    <!-- 最近报修记录 -->
    <div class="recent-repairs">
      <!-- 最近报修模块的悬浮装饰图标 -->
      <div class="repair-floating-icons">
        <div class="repair-float-icon repair-icon-1">
          <svg width="30" height="30" viewBox="0 0 24 24" fill="none">
            <path d="M22.7 19l-9.1-9.1c.9-2.3.4-5-1.5-6.9-2-2-5-2.4-7.4-1.3L9 6 6 9 1.6 4.7C.4 7.1.9 10.1 2.9 12.1c1.9 1.9 4.6 2.4 6.9 1.5l9.1 9.1c.4.4 1 .4 1.4 0l2.3-2.3c.5-.4.5-1.1.1-1.4z" fill="#87CEEB" opacity="0.6"/>
          </svg>
        </div>
        <div class="repair-float-icon repair-icon-2">
          <svg width="26" height="26" viewBox="0 0 24 24" fill="none">
            <path d="M16.06 10.94L12 15l-1.06-1.06L15 10l1.06.94z" fill="#DDA0DD" opacity="0.5"/>
            <path d="M8.5 8.5L12 12l7-7-1-1-7 7L8.5 8.5z" stroke="#9370DB" stroke-width="1.5" fill="none" opacity="0.7"/>
          </svg>
        </div>
        <div class="repair-float-icon repair-icon-3">
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none">
            <rect x="3" y="8" width="18" height="10" rx="2" fill="#F0E68C" opacity="0.5"/>
            <path d="M8 8V6a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" stroke="#DAA520" stroke-width="2" fill="none" opacity="0.7"/>
            <circle cx="12" cy="13" r="1.5" fill="#DAA520" opacity="0.6"/>
          </svg>
        </div>
        <div class="repair-float-icon repair-icon-4">
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
            <path d="M18 8h-1V6c0-2.76-2.24-5-5-5S7 3.24 7 6v2H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2z" fill="#20B2AA" opacity="0.5"/>
            <circle cx="12" cy="15" r="1.5" fill="#008B8B" opacity="0.7"/>
          </svg>
        </div>
      </div>
      <div class="section-header">
        <h3 class="section-title">最近报修</h3>
        <el-button text class="view-all-btn" @click="viewAllRepairs">
          查看全部
          <el-icon><ArrowRight /></el-icon>
        </el-button>
      </div>
      
      <div class="repairs-list" v-if="recentRepairs.length > 0">
        <div 
          v-for="repair in recentRepairs" 
          :key="repair.id" 
          class="repair-item"
        >
          <div class="repair-info">
            <span class="repair-title">{{ repair.title }}</span>
            <span class="repair-time">{{ formatTime(repair.createdAt) }}</span>
          </div>
          <span class="repair-status" :class="getStatusClass(repair.status)">
            {{ getStatusText(repair.status) }}
          </span>
        </div>
      </div>
      
      <div v-else class="empty-state">
        <svg width="48" height="48" viewBox="0 0 24 24" fill="none" class="empty-icon">
          <circle cx="12" cy="12" r="10" stroke="#D3D3D3" stroke-width="2" fill="none"/>
          <path d="M8 12h8" stroke="#D3D3D3" stroke-width="2" stroke-linecap="round"/>
        </svg>
        <p class="empty-text">暂无报修记录</p>
      </div>
    </div>

    <!-- 环境信息卡片 -->
    <div class="environment-section">
      <div class="section-header">
        <div class="env-title">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" class="env-icon">
            <circle cx="12" cy="12" r="5" fill="#87CEEB" opacity="0.6"/>
            <path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" stroke="#4682B4" stroke-width="2"/>
          </svg>
          <h3>今日环境</h3>
        </div>
      </div>
      
      <div class="env-content">
        <div class="env-item">
          <span class="env-label">
            <svg t="1758175815615" class="temperature-icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="18867" width="16" height="16">
              <path d="M793.6 640c-19.2-32-51.2-64-89.6-83.2V128c0-70.4-51.2-128-121.6-128C512 0 460.8 57.6 460.8 128v435.2c-38.4 12.8-64 44.8-89.6 76.8-25.6 38.4-38.4 83.2-38.4 134.4 0 64 25.6 128 70.4 172.8S518.4 1024 582.4 1024c64 0 128-25.6 172.8-70.4s70.4-108.8 70.4-172.8c6.4-51.2-6.4-96-32-140.8z m-211.2 339.2c-115.2 0-204.8-96-204.8-204.8 0-76.8 44.8-147.2 115.2-185.6l12.8-6.4V128c0-44.8 38.4-83.2 83.2-83.2 44.8 0 83.2 38.4 83.2 83.2v460.8l12.8 6.4c70.4 38.4 115.2 108.8 115.2 185.6-6.4 108.8-102.4 198.4-217.6 198.4z" p-id="18868"></path>
              <path d="M620.8 665.6V262.4c0-19.2-19.2-38.4-38.4-38.4s-38.4 19.2-38.4 38.4v403.2c-44.8 12.8-70.4 57.6-70.4 102.4 0 57.6 51.2 108.8 108.8 108.8s108.8-51.2 108.8-108.8c0-44.8-25.6-89.6-70.4-102.4zM352 185.6H153.6c-25.6 0-38.4-12.8-38.4-38.4 0-19.2 12.8-38.4 38.4-38.4h204.8c19.2 0 38.4 19.2 38.4 38.4-6.4 25.6-19.2 38.4-44.8 38.4zM352 307.2h-128c-19.2 0-38.4-19.2-38.4-38.4s19.2-38.4 38.4-38.4h128c19.2 0 38.4 19.2 38.4 38.4 0 25.6-12.8 38.4-38.4 38.4zM352 435.2h-38.4c-19.2 0-38.4-19.2-38.4-38.4s19.2-38.4 38.4-38.4h44.8c19.2 0 38.4 19.2 38.4 38.4-6.4 19.2-19.2 38.4-44.8 38.4z" p-id="18869" fill="#FF6B35"></path>
            </svg>
            温度
          </span>
          <span class="env-value">{{ environmentInfo.temperature }}</span>
        </div>
        <div class="env-item">
          <span class="env-label">
            <svg t="1758175658686" class="humidity-icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="10019" width="16" height="16">
              <path d="M480 128a130.56 130.56 0 0 1 130.432 130.432V577.28a213.76 213.76 0 0 1 83.136 169.088A213.76 213.76 0 0 1 480 960a213.76 213.76 0 0 1-213.568-213.568 213.76 213.76 0 0 1 83.2-169.088V258.432A130.56 130.56 0 0 1 480 128z m0 38.848c-50.56 0-91.52 41.024-91.52 91.52v318.784c0 2.56 0.128 5.12 0.384 8l0.96 11.264-9.216 6.4a175.104 175.104 0 0 0-75.264 143.616 174.912 174.912 0 0 0 174.656 174.72 174.912 174.912 0 0 0 174.72-174.592c0-57.28-28.16-111.04-75.328-143.68l-9.216-6.336 0.96-11.264c0.256-2.944 0.384-5.504 0.384-7.936V258.432c0-50.56-40.96-91.52-91.52-91.52z m0 138.688c22.912 0 41.6 18.56 41.6 41.6v281.6c48.448 17.28 83.2 63.36 83.392 117.76a124.864 124.864 0 1 1-166.592-117.76v-281.6c0-22.912 18.688-41.6 41.6-41.6zM108.416 471.808s44.416 75.008 44.416 103.616c0 28.544-19.904 51.712-44.416 51.712C83.904 627.2 64 603.968 64 575.424c0-28.608 44.416-103.616 44.416-103.616z m707.2-188.48S896 408.96 896 457.088c0 48-36.032 86.912-80.448 86.912s-80.448-39.04-80.448-86.912c0-48 80.448-173.76 80.448-173.76zM230.4 128s27.776 48.192 27.776 66.624c0 18.432-12.416 33.28-27.776 33.28-15.296 0-27.712-14.848-27.712-33.28C202.688 176.192 230.4 128 230.4 128z" fill="#2196F3" p-id="10020"></path>
            </svg>
            湿度
          </span>
          <span class="env-value">{{ environmentInfo.humidity }}</span>
        </div>
        <div class="env-item">
          <span class="env-label">
            <svg t="1758175405502" class="weather-icon" viewBox="0 0 1232 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="9693" width="16" height="16">
              <path d="M866.1974 280.288546c13.574325 0 21.726504-5.384229 32.589755-13.460574l43.434048-43.111753c10.863252-10.768459 13.593284-18.863762 13.593284-32.343294 0-13.460574-5.441105-21.536918-13.593284-32.324335a45.12136 45.12136 0 0 0-32.570796-13.460574c-13.574325 0-21.726504 5.384229-32.589756 13.460574l-43.453007 43.111753c-10.863252 10.787418-13.574325 18.863762-13.574325 32.324335 0 13.460574 5.441105 21.555877 13.574325 32.343294 8.152178 10.768459 21.726504 13.460574 32.589756 13.460574zM551.219974 153.66436c13.574325 0 24.437577-5.384229 32.570797-13.479532 10.863252-10.768459 13.593284-18.844803 13.593283-32.324336V45.884977c0-13.460574-5.422147-21.536918-13.593283-32.324335-10.863252-10.768459-18.996472-13.460574-32.570797-13.460574-13.593284 0-24.437577 5.384229-32.589755 13.460574-10.863252 10.787418-13.574325 18.863762-13.574325 32.324335v61.975515c0 13.479532 5.422147 21.555877 13.574325 32.324336 8.152178 8.095303 21.726504 13.479532 32.589755 13.479532zM203.652793 269.520087a45.12136 45.12136 0 0 0 32.570797 13.460574c13.574325 0 21.726504-5.384229 32.589755-13.460574 10.863252-10.787418 13.574325-18.863762 13.574325-32.343294 0-13.460574-5.422147-21.555877-13.574325-32.324336l-43.453007-43.111753a45.12136 45.12136 0 0 0-32.570797-13.460573c-13.574325 0-21.726504 5.384229-32.589755 13.460573-8.152178 10.787418-13.593284 18.863762-13.593284 32.343294 0 13.460574 5.441105 21.536918 13.593284 32.324336l43.453007 43.111753zM154.777639 541.632221c0-13.479532-5.441105-21.555877-13.593283-32.343294a45.12136 45.12136 0 0 0-32.589755-13.460574H46.145122c-13.574325 0-21.707545 5.384229-32.570797 13.460574-8.152178 8.095303-13.574325 18.863762-13.574325 32.343294 0 13.460574 5.422147 21.555877 13.574325 32.324335 8.13322 10.787418 18.996472 13.479532 32.570797 13.479533h65.17951c13.555367 0 21.726504-5.403188 32.589756-13.479533 5.422147-5.384229 10.863252-18.863762 10.863251-32.324335z m1067.13912 156.256407c-27.14865-99.68408-100.461381-188.599701-187.367395-226.308266-54.2973-21.555877-111.324632-35.01645-171.063038-35.016451-187.367395 0-355.719359 126.624186-377.426904 280.188478l-2.730032 26.940106-24.437577-16.152688c-40.722975-29.651179-81.464909-43.111753-133.051136-43.111753-21.726504 0-43.453007 2.692115-65.17951 8.076344-95.039234 21.555877-133.051136 105.068309-133.051136 172.428054-2.730032 64.66763 29.859723 140.103718 100.480339 158.96748h801.036847c67.871625 0 103.191413-8.095303 122.187885-32.343294 70.601657-86.204548 97.769266-191.291816 70.601657-293.66801z m-154.77764 237.095683l-2.711073 2.692115h-765.736019c-54.316259 0-84.194941-35.01645-89.617087-67.359745-5.422147-32.324336 13.574325-75.436089 65.160552-88.896662a207.709924 207.709924 0 0 1 57.027332-8.095303c54.316259 0 103.191413 18.863762 127.628989 53.880212 2.711073 5.384229 18.996472 13.479532 43.453007 13.479533 18.996472 0 62.449479-5.384229 65.160552-67.359745 10.863252-172.428054 162.929818-250.556257 304.133133-250.556257 10.863252 0 21.726504 0 35.300828 2.692115 149.336534 10.787418 219.938192 115.855727 236.22359 207.463462 16.304357 91.607736-16.285398 175.120169-76.023804 202.060275zM257.950093 595.512433c27.14865-8.076344 59.738405-13.479532 89.617088-16.152689-10.863252-80.839277 16.285398-134.719489 43.434048-167.043824 40.741934-48.514941 100.480339-75.455047 165.65985-75.455047 43.434049 0 84.175982 10.787418 119.457852 35.035409 16.304357-8.095303 54.316259-24.247991 89.598129-32.343294-59.719447-56.572327-133.051136-88.896662-209.055981-88.896663-95.058193 0-187.386353 45.803868-244.413685 123.932072-54.2973 67.359744-70.582699 145.487948-54.297301 220.924036z" fill="#4A90E2" p-id="9694"></path>
            </svg>
            天气
          </span>
          <span class="env-value">{{ environmentInfo.weather }}</span>
        </div>
        <div class="env-item">
          <span class="env-label">🍃 空气</span>
          <span class="env-value">{{ environmentInfo.airQuality }}</span>
        </div>
      </div>
    </div>

    <!-- 维修小知识 -->
    <div class="knowledge-section">
      <div class="section-header">
        <div class="knowledge-title">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" class="knowledge-icon">
            <path d="M9 11H7v8h2v-8zm4 0h-2v8h2v-8zm4 0h-2v8h2v-8zm2-7H5v2h14V4zM6 19v2h12v-2H6z" fill="#DDA0DD" opacity="0.7"/>
            <circle cx="12" cy="8" r="2" fill="#9370DB" opacity="0.8"/>
          </svg>
          <h3>维修小知识</h3>
        </div>
      </div>
      
      <div class="knowledge-content">
        <div 
          v-for="knowledge in maintenanceKnowledge" 
          :key="knowledge.id" 
          class="knowledge-item"
        >
          <div class="knowledge-question">{{ knowledge.title }}</div>
          <div class="knowledge-answer">{{ knowledge.solution }}</div>
        </div>
      </div>
    </div>

    <!-- 宿舍小贴士/社区公告栏 -->
    <div class="tips-section">
      <div class="section-header">
        <div class="tips-title">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" class="tips-icon">
            <path d="M12 2L2 7l10 5 10-5-10-5z" fill="#FFB6C1"/>
            <path d="M2 17l10 5 10-5" stroke="#FFB6C1" stroke-width="2" fill="none"/>
            <path d="M2 12l10 5 10-5" stroke="#FFB6C1" stroke-width="2" fill="none"/>
          </svg>
          <h3>宿舍小喇叭</h3>
        </div>
      </div>
      
      <div class="tips-content">
        <div 
          v-for="tip in dormitoryTips.slice(0, 4)" 
          :key="tip.id" 
          class="tip-item"
          :class="`tip-${tip.type}`"
        >
          <div class="tip-icon">{{ tip.emoji }}</div>
          <div class="tip-text">
            <span class="tip-title">{{ tip.title }}</span>
            <span class="tip-content" v-if="tip.content">{{ tip.content }}</span>
            <span class="tip-time">{{ formatTime(tip.publishTime) }}</span>
          </div>
        </div>
        
        <div class="view-more-tips">
          <el-button text class="view-more-btn" @click="viewMoreTips">
            查看更多小贴士
            <el-icon><ArrowRight /></el-icon>
          </el-button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { ElButton, ElIcon } from 'element-plus'
import { ArrowRight } from '@element-plus/icons-vue'
import { useRouter } from 'vue-router'

const router = useRouter()

// 响应式数据
const statistics = ref({
  completedOrders: 1,
  pendingOrders: 0,
  processingOrders: 0
})

const recentRepairs = ref([])

const dormitoryTips = ref([
  {
    id: 1,
    title: '中秋快乐！注意用电安全',
    emoji: '🌙',
    publishTime: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2小时前
    type: 'announcement'
  },
  {
    id: 2,
    title: '空调滤网清洁小贴士',
    emoji: '❄️',
    publishTime: new Date(Date.now() - 24 * 60 * 60 * 1000), // 1天前
    type: 'tip',
    content: '定期清洁空调滤网，保持室内空气清新'
  },
  {
    id: 3,
    title: '下水道疏通正确方法',
    emoji: '🔧',
    publishTime: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000), // 3天前
    type: 'tip',
    content: '使用专业疏通剂，避免使用强酸强碱'
  },
  {
    id: 4,
    title: '节约用水小妙招',
    emoji: '💧',
    publishTime: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000), // 5天前
    type: 'tip',
    content: '洗漱时及时关闭水龙头，一起保护水资源'
  },
  {
    id: 5,
    title: '宿舍安全用电指南',
    emoji: '⚡',
    publishTime: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), // 7天前
    type: 'safety',
    content: '不使用大功率电器，及时断电确保安全'
  },
  {
    id: 6,
    title: '维修预约小贴士',
    emoji: '📅',
    publishTime: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000), // 10天前
    type: 'tip',
    content: '详细描述问题，上传照片，加快维修进度'
  }
])

// 添加天气和环境信息
const environmentInfo = ref({
  temperature: '22°C',
  humidity: '65%',
  airQuality: '良好',
  weather: '晴朗'
})

// 添加维修小知识
const maintenanceKnowledge = ref([
  {
    id: 1,
    title: '水龙头滴水怎么办？',
    solution: '检查密封圈是否老化，及时更换'
  },
  {
    id: 2,
    title: '灯泡不亮了？',
    solution: '先检查开关，再检查灯泡是否松动'
  },
  {
    id: 3,
    title: '网络连接不稳定？',
    solution: '重启路由器，检查网线连接'
  }
])

// 方法
const getGreeting = () => {
  const hour = new Date().getHours()
  if (hour < 6) return '夜深了'
  if (hour < 9) return '早上好'
  if (hour < 12) return '上午好'
  if (hour < 14) return '中午好'
  if (hour < 18) return '下午好'
  if (hour < 22) return '晚上好'
  return '夜深了'
}

const getGreetingMessage = () => {
  const hour = new Date().getHours()
  if (hour < 6) return '注意休息，保重身体哦'
  if (hour < 9) return '元气满满的一天开始啦！'
  if (hour < 12) return '美好的上午时光'
  if (hour < 14) return '记得吃午饭哦'
  if (hour < 18) return '愉快的下午时光'
  if (hour < 22) return '是时候放松一下了'
  return '早点休息，晚安'
}

const getCurrentUserName = () => {
  return '同学' // 这里可以从用户状态中获取真实姓名
}

const getStatusMessage = () => {
  if (statistics.value.processingOrders > 0) {
    return '您有一条报修正在处理中，耐心等待一下哦！'
  }
  if (statistics.value.pendingOrders > 0) {
    return '您有新的报修待处理，我们会尽快安排！'
  }
  if (statistics.value.completedOrders > 0) {
    return '恭喜！您的报修已完成，请记得确认并评价！'
  }
  return '您近期没有待处理的报修，一切正常~'
}

const startRepair = () => {
  router.push('/repair/create')
}

const viewAllRepairs = () => {
  router.push('/repair/list')
}

const viewMoreTips = () => {
  // 跳转到AI维修小助手页面
  router.push('/ai-assistant')
}

const formatTime = (time) => {
  const now = new Date()
  const diff = now - new Date(time)
  const hours = Math.floor(diff / (1000 * 60 * 60))
  const days = Math.floor(hours / 24)
  
  if (days > 0) return `${days}天前`
  if (hours > 0) return `${hours}小时前`
  return '刚刚'
}

const getStatusClass = (status) => {
  const statusMap = {
    'pending': 'status-pending',
    'processing': 'status-processing',
    'completed': 'status-completed'
  }
  return statusMap[status] || 'status-pending'
}

const getStatusText = (status) => {
  const statusMap = {
    'pending': '待处理',
    'processing': '处理中',
    'completed': '已完成'
  }
  return statusMap[status] || '未知'
}

// 生命周期
onMounted(() => {
  // 这里可以加载真实数据
})
</script>

<style scoped>
.dashboard {
  min-height: 100vh;
  background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
  padding: 24px;
  font-family: 'PingFang SC', 'Helvetica Neue', Arial, sans-serif;
  position: relative;
  overflow: hidden;
}

/* 温馨线条背景装饰 */
.dashboard::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-image: 
    /* 柔和的波浪线 */
    radial-gradient(circle at 20% 80%, rgba(255, 182, 193, 0.25) 0%, transparent 60%),
    radial-gradient(circle at 80% 20%, rgba(173, 216, 230, 0.25) 0%, transparent 60%),
    radial-gradient(circle at 40% 40%, rgba(255, 228, 181, 0.2) 0%, transparent 60%),
    /* 添加更多装饰线条 */
    radial-gradient(circle at 60% 70%, rgba(221, 160, 221, 0.15) 0%, transparent 50%),
    radial-gradient(circle at 30% 30%, rgba(255, 215, 0, 0.1) 0%, transparent 40%);
  pointer-events: none;
  z-index: 0;
}

/* 悬浮装饰图标 */
.floating-icons {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  pointer-events: none;
  z-index: 1;
}

.floating-icon {
  position: absolute;
  opacity: 0.4;
  animation: float 6s ease-in-out infinite;
  filter: drop-shadow(0 2px 8px rgba(0, 0, 0, 0.1));
}

.floating-icon:nth-child(1) {
  top: 10%;
  left: 15%;
  animation-delay: 0s;
}

.floating-icon:nth-child(2) {
  top: 20%;
  right: 20%;
  animation-delay: 1s;
}

.floating-icon:nth-child(3) {
  top: 60%;
  left: 10%;
  animation-delay: 2s;
}

.floating-icon:nth-child(4) {
  bottom: 20%;
  right: 15%;
  animation-delay: 3s;
}

.floating-icon:nth-child(5) {
  top: 40%;
  left: 70%;
  animation-delay: 4s;
}

.floating-icon:nth-child(6) {
  bottom: 40%;
  left: 25%;
  animation-delay: 5s;
}

@keyframes float {
  0%, 100% {
    transform: translateY(0px) rotate(0deg);
  }
  50% {
    transform: translateY(-20px) rotate(5deg);
  }
}

/* 确保内容在装饰之上 */
.dashboard > * {
  position: relative;
  z-index: 2;
}

/* 温馨问候与核心功能区 */
.greeting-section {
  background: rgba(255, 255, 255, 0.9);
  border-radius: 24px;
  padding: 32px;
  margin-bottom: 24px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
  backdrop-filter: blur(10px);
  text-align: center;
  position: relative;
  overflow: hidden;
}

/* 中午好模块的温馨线条背景 */
.greeting-section::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-image: 
    radial-gradient(circle at 15% 85%, rgba(255, 182, 193, 0.2) 0%, transparent 50%),
    radial-gradient(circle at 85% 15%, rgba(255, 228, 181, 0.2) 0%, transparent 50%),
    linear-gradient(45deg, rgba(255, 192, 203, 0.1) 0%, transparent 30%),
    linear-gradient(-45deg, rgba(255, 218, 185, 0.1) 0%, transparent 30%);
  pointer-events: none;
  z-index: 0;
}

/* 中午好模块的悬浮图标 */
.greeting-section::after {
  content: '';
  position: absolute;
  top: 10px;
  right: 20px;
  width: 40px;
  height: 40px;
  background-image: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none"><path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z" fill="%23FFB6C1" opacity="0.4"/><circle cx="8" cy="16" r="1" fill="%23FF69B4" opacity="0.6"/><circle cx="16" cy="16" r="1" fill="%23FF69B4" opacity="0.6"/></svg>');
  background-size: contain;
  background-repeat: no-repeat;
  opacity: 0.3;
  animation: gentleFloat 4s ease-in-out infinite;
  pointer-events: none;
  z-index: 1;
}

/* 确保中午好模块内容在装饰之上 */
.greeting-section > * {
  position: relative;
  z-index: 2;
}

.greeting-content {
  margin-bottom: 32px;
}

.greeting-icon {
  margin-bottom: 16px;
}

.greeting-title {
  font-size: 28px;
  font-weight: 600;
  color: #2c3e50;
  margin: 0 0 8px 0;
  letter-spacing: 0.5px;
}

.greeting-subtitle {
  font-size: 16px;
  color: #7f8c8d;
  margin: 0;
  font-weight: 400;
}

.main-action {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
}

.repair-button {
  background: #f8f4e6;
  border: 2px solid #d4b896;
  border-radius: 12px;
  padding: 14px 28px;
  font-size: 16px;
  font-weight: 500;
  color: #8b6914;
  box-shadow: 0 2px 8px rgba(212, 184, 150, 0.2);
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  gap: 8px;
  position: relative;
  overflow: hidden;
}

.repair-button::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.3), transparent);
  transition: left 0.5s ease;
}

.repair-button:hover::before {
  left: 100%;
}

.repair-button:hover {
  background: #f5f0e1;
  border-color: #c9a876;
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(212, 184, 150, 0.3);
}

.repair-button:active {
  transform: translateY(0);
  box-shadow: 0 2px 6px rgba(212, 184, 150, 0.2);
}

.repair-icon {
  color: #8b6914;
  filter: none;
}

.action-tip {
  font-size: 14px;
  color: #95a5a6;
  margin: 0;
  font-style: italic;
}

/* 报修状态区 */
.status-section {
  background: rgba(255, 255, 255, 0.8);
  border-radius: 16px;
  padding: 20px 24px;
  margin-bottom: 24px;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.08);
}

.status-content {
  display: flex;
  align-items: center;
  gap: 12px;
}

.status-icon {
  flex-shrink: 0;
}

.status-text {
  font-size: 16px;
  color: #34495e;
  font-weight: 500;
  line-height: 1.5;
}

/* 最近报修记录 */
.recent-repairs {
  background: rgba(255, 255, 255, 0.9);
  border-radius: 20px;
  padding: 24px;
  margin-bottom: 24px;
  box-shadow: 0 6px 24px rgba(0, 0, 0, 0.08);
  position: relative;
  overflow: hidden;
}

/* 最近报修模块的温馨线条背景 */
.recent-repairs::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-image: 
    radial-gradient(circle at 20% 20%, rgba(135, 206, 235, 0.15) 0%, transparent 40%),
    radial-gradient(circle at 80% 80%, rgba(221, 160, 221, 0.15) 0%, transparent 40%),
    linear-gradient(135deg, rgba(173, 216, 230, 0.1) 0%, transparent 25%),
    linear-gradient(-135deg, rgba(255, 182, 193, 0.1) 0%, transparent 25%);
  pointer-events: none;
  z-index: 0;
}

/* 最近报修模块的悬浮维修图标 */
.recent-repairs::after {
  content: '';
  position: absolute;
  top: 15px;
  right: 25px;
  width: 36px;
  height: 36px;
  background-image: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none"><path d="M22.7 19l-9.1-9.1c.9-2.3.4-5-1.5-6.9-2-2-5-2.4-7.4-1.3L9 6 6 9 1.6 4.7C.4 7.1.9 10.1 2.9 12.1c1.9 1.9 4.6 2.4 6.9 1.5l9.1 9.1c.4.4 1 .4 1.4 0l2.3-2.3c.5-.4.5-1.1.1-1.4z" fill="%2387CEEB" opacity="0.5"/></svg>');
  background-size: contain;
  background-repeat: no-repeat;
  opacity: 0.4;
  animation: gentleFloat 5s ease-in-out infinite 1s;
  pointer-events: none;
  z-index: 1;
}

/* 确保最近报修模块内容在装饰之上 */
.recent-repairs > * {
  position: relative;
  z-index: 2;
}

/* 中午好模块悬浮图标样式 */
.greeting-floating-icons {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  pointer-events: none;
  z-index: 1;
}

.greeting-float-icon {
  position: absolute;
  opacity: 0.3;
  animation: gentleFloat 6s ease-in-out infinite;
}

.greeting-icon-1 {
  top: 20px;
  left: 30px;
  animation-delay: 0s;
}

.greeting-icon-2 {
  top: 30px;
  right: 40px;
  animation-delay: 2s;
}

.greeting-icon-3 {
  bottom: 25px;
  left: 50px;
  animation-delay: 4s;
}

/* 最近报修模块悬浮图标样式 */
.repair-floating-icons {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  pointer-events: none;
  z-index: 1;
}

.repair-float-icon {
  position: absolute;
  opacity: 0.35;
  animation: gentleFloat 5s ease-in-out infinite;
}

.repair-icon-1 {
  top: 15px;
  left: 25px;
  animation-delay: 0.5s;
}

.repair-icon-2 {
  top: 20px;
  right: 30px;
  animation-delay: 1.5s;
}

.repair-icon-3 {
  bottom: 20px;
  left: 40px;
  animation-delay: 2.5s;
}

.repair-icon-4 {
  bottom: 25px;
  right: 35px;
  animation-delay: 3.5s;
}

/* 温和的浮动动画 */
@keyframes gentleFloat {
  0%, 100% {
    transform: translateY(0px) rotate(0deg);
  }
  50% {
    transform: translateY(-8px) rotate(2deg);
  }
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.section-title {
  font-size: 20px;
  font-weight: 600;
  color: #2c3e50;
  margin: 0;
}

.view-all-btn {
  color: #3498db;
  font-weight: 500;
}

.repairs-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.repair-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px;
  background: #f8f9fa;
  border-radius: 12px;
  transition: all 0.2s ease;
}

.repair-item:hover {
  background: #e9ecef;
  transform: translateX(4px);
}

.repair-info {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.repair-title {
  font-size: 16px;
  font-weight: 500;
  color: #2c3e50;
}

.repair-time {
  font-size: 14px;
  color: #7f8c8d;
}

.repair-status {
  padding: 6px 12px;
  border-radius: 20px;
  font-size: 12px;
  font-weight: 500;
}

.status-pending {
  background: #fff3cd;
  color: #856404;
}

.status-processing {
  background: #d1ecf1;
  color: #0c5460;
}

.status-completed {
  background: #d4edda;
  color: #155724;
}

.empty-state {
  text-align: center;
  padding: 40px 20px;
}

.empty-icon {
  margin-bottom: 16px;
  opacity: 0.6;
}

.empty-text {
  font-size: 16px;
  color: #95a5a6;
  margin: 0;
}

/* 环境信息区域 */
.environment-section {
  background: rgba(255, 255, 255, 0.9);
  border-radius: 20px;
  padding: 24px;
  margin-bottom: 24px;
  box-shadow: 0 6px 24px rgba(0, 0, 0, 0.08);
}

.env-title {
  display: flex;
  align-items: center;
  gap: 8px;
}

.env-title h3 {
  font-size: 20px;
  font-weight: 600;
  color: #2c3e50;
  margin: 0;
}

.env-icon {
  filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.1));
}

.env-content {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
  gap: 16px;
  margin-top: 20px;
}

.env-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 16px;
  background: linear-gradient(135deg, #e3f2fd 0%, #bbdefb 100%);
  border-radius: 16px;
  transition: all 0.3s ease;
}

.env-item:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 24px rgba(33, 150, 243, 0.2);
}

.env-label {
  font-size: 14px;
  color: #546e7a;
  margin-bottom: 8px;
  font-weight: 500;
  display: flex;
  align-items: center;
  gap: 6px;
}

.weather-icon {
  width: 16px;
  height: 16px;
  filter: drop-shadow(0 1px 2px rgba(0, 0, 0, 0.1));
  transition: all 0.3s ease;
}

.env-item:hover .weather-icon {
  transform: scale(1.1);
  filter: drop-shadow(0 2px 4px rgba(74, 144, 226, 0.3));
}

.humidity-icon {
  width: 16px;
  height: 16px;
  filter: drop-shadow(0 1px 2px rgba(0, 0, 0, 0.1));
  transition: all 0.3s ease;
}

.temperature-icon {
  width: 16px;
  height: 16px;
  filter: drop-shadow(0 1px 2px rgba(0, 0, 0, 0.1));
  transition: all 0.3s ease;
}

.env-item:hover .humidity-icon {
  transform: scale(1.1);
  filter: drop-shadow(0 2px 4px rgba(33, 150, 243, 0.3));
}

.env-item:hover .temperature-icon {
  transform: scale(1.1);
  filter: drop-shadow(0 2px 4px rgba(255, 107, 53, 0.3));
}

.env-value {
  font-size: 18px;
  font-weight: 600;
  color: #1976d2;
}

/* 维修小知识区域 */
.knowledge-section {
  background: rgba(255, 255, 255, 0.9);
  border-radius: 20px;
  padding: 24px;
  margin-bottom: 24px;
  box-shadow: 0 6px 24px rgba(0, 0, 0, 0.08);
}

.knowledge-title {
  display: flex;
  align-items: center;
  gap: 8px;
}

.knowledge-title h3 {
  font-size: 20px;
  font-weight: 600;
  color: #2c3e50;
  margin: 0;
}

.knowledge-icon {
  filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.1));
}

.knowledge-content {
  display: flex;
  flex-direction: column;
  gap: 16px;
  margin-top: 20px;
}

.knowledge-item {
  padding: 16px;
  background: linear-gradient(135deg, #f3e5f5 0%, #e1bee7 100%);
  border-radius: 16px;
  transition: all 0.3s ease;
}

.knowledge-item:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 24px rgba(156, 39, 176, 0.2);
}

.knowledge-question {
  font-size: 16px;
  font-weight: 600;
  color: #4a148c;
  margin-bottom: 8px;
}

.knowledge-answer {
  font-size: 14px;
  color: #6a1b9a;
  line-height: 1.5;
}

/* 宿舍小贴士 - 温馨人文设计 */
.tips-section {
  background: rgba(255, 255, 255, 0.9);
  border-radius: 20px;
  padding: 24px;
  box-shadow: 0 6px 24px rgba(0, 0, 0, 0.08);
  position: relative;
  overflow: hidden;
}

/* 添加温馨的背景装饰 */
.tips-section::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-image: 
    radial-gradient(circle at 15% 25%, rgba(255, 182, 193, 0.08) 0%, transparent 35%),
    radial-gradient(circle at 85% 75%, rgba(255, 218, 185, 0.08) 0%, transparent 35%),
    radial-gradient(circle at 50% 50%, rgba(255, 240, 245, 0.1) 0%, transparent 50%);
  pointer-events: none;
  z-index: 0;
}

/* 添加可爱的装饰图标 */
.tips-section::after {
  content: '🏠💕';
  position: absolute;
  top: 20px;
  right: 30px;
  font-size: 24px;
  opacity: 0.1;
  transform: rotate(-5deg);
  pointer-events: none;
  z-index: 1;
}

/* 确保内容在装饰之上 */
.tips-section > * {
  position: relative;
  z-index: 2;
}

.tips-title {
  display: flex;
  align-items: center;
  gap: 8px;
}

.tips-title h3 {
  font-size: 20px;
  font-weight: 600;
  color: #2c3e50;
  margin: 0;
}

.tips-icon {
  filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.1));
}

.tips-content {
  display: flex;
  flex-direction: column;
  gap: 16px;
  margin-top: 20px;
}

.tip-item {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 18px;
  background: linear-gradient(135deg, #fef7f0 0%, #fff5f5 100%);
  border-radius: 18px;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.05);
}

.tip-item:hover {
  transform: translateY(-3px);
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.12);
}

/* 为每个tip-item添加温馨的小装饰 */
.tip-item::after {
  content: '✨';
  position: absolute;
  bottom: 8px;
  right: 12px;
  font-size: 16px;
  opacity: 0.2;
  transform: rotate(15deg);
  pointer-events: none;
}

.tip-item .tip-icon {
  font-size: 24px;
  flex-shrink: 0;
}

.tip-text {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.tip-title {
  font-size: 16px;
  font-weight: 500;
  color: #2c3e50;
}

.tip-time {
  font-size: 12px;
  color: #7f8c8d;
}

.tip-content {
  font-size: 14px;
  color: #5d4e75;
  margin: 4px 0;
  line-height: 1.4;
}

/* 不同类型小贴士的样式 - 更人文化设计 */
.tip-announcement {
  background: linear-gradient(135deg, #fff8e1 0%, #ffe0b2 100%);
  position: relative;
  overflow: hidden;
}

.tip-announcement::before {
  content: '📢';
  position: absolute;
  top: -5px;
  right: -5px;
  font-size: 32px;
  opacity: 0.15;
  transform: rotate(15deg);
}

.tip-tip {
  background: linear-gradient(135deg, #f1f8e9 0%, #dcedc8 100%);
  position: relative;
  overflow: hidden;
}

.tip-tip::before {
  content: '💡';
  position: absolute;
  top: -5px;
  right: -5px;
  font-size: 32px;
  opacity: 0.15;
  transform: rotate(-10deg);
}

.tip-safety {
  background: linear-gradient(135deg, #fce4ec 0%, #f8bbd9 100%);
  position: relative;
  overflow: hidden;
}

.tip-safety::before {
  content: '⚠️';
  position: absolute;
  top: -5px;
  right: -5px;
  font-size: 32px;
  opacity: 0.15;
  transform: rotate(10deg);
}

.view-more-tips {
  margin-top: 16px;
  text-align: center;
}

.view-more-btn {
  color: #3498db;
  font-weight: 500;
  transition: all 0.3s ease;
}

.view-more-btn:hover {
  color: #2980b9;
  transform: translateY(-1px);
}

/* 响应式设计 */
@media (max-width: 768px) {
  .dashboard {
    padding: 16px;
  }
  
  .greeting-section {
    padding: 24px 20px;
  }
  
  .greeting-title {
    font-size: 24px;
  }
  
  .repair-button {
    padding: 14px 28px;
    font-size: 16px;
  }
  
  .section-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 12px;
  }
}
</style>