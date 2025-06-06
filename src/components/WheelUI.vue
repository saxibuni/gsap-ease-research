<template>
  <div class="lucky-wheel-container">
    <!-- 指针 - 独立于轮盘，不会转动 -->
    <div class="pointer">
      <svg width="40" height="60" viewBox="0 0 40 60">
        <polygon points="20,0 35,50 20,40 5,50" fill="#ff5722" stroke="#fff" stroke-width="2"/>
      </svg>
    </div>
    
    <!-- 轮盘 -->
    <div class="lucky-wheel" ref="wheelRef">
      <svg width="300" height="300" viewBox="0 0 300 300">
        <!-- 轮盘背景 -->
        <circle cx="150" cy="150" r="148" fill="#fff" stroke="#ddd" stroke-width="2"/>
        
        <!-- 奖品扇形区域 -->
        <g v-for="(prize, index) in prizes" :key="index">
          <path 
            :d="createSectorPath(index)" 
            :fill="prize.color"
            stroke="#fff" 
            stroke-width="2"
          />
          <!-- 奖品文字 -->
          <text 
            :x="getTextX(index)" 
            :y="getTextY(index)" 
            :fill="prize.textColor || '#333'"
            font-size="12" 
            font-weight="bold" 
            text-anchor="middle"
            dominant-baseline="middle"
            :transform="getTextTransform(index)"
          >
            {{ prize.name }}
          </text>
        </g>
        
        <!-- 中心圆圈 -->
        <circle cx="150" cy="150" r="20" fill="#ff5722" stroke="#fff" stroke-width="3"/>
        <circle cx="150" cy="150" r="10" fill="#fff"/>
      </svg>
    </div>
    
    <!-- 控制按钮 -->
    <div class="controls">
      <button 
        @click="$emit('spin')" 
        :disabled="isSpinning"
        class="start-button"
        :class="{ 'spinning': isSpinning }"
      >
        {{ isSpinning ? '转动中...' : '开始抽奖' }}
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'

// 定义奖品接口
interface Prize {
  name: string
  color: string
  textColor?: string
  probability?: number
}

// Props
interface Props {
  prizes: Prize[]
  isSpinning: boolean
}

const props = defineProps<Props>()

// Emits
const emit = defineEmits<{
  spin: []
}>()

// 轮盘引用
const wheelRef = ref<HTMLElement>()

// 暴露轮盘引用给父组件
defineExpose({
  wheelRef
})

// 计算每个扇形的角度
const sectorAngle = computed(() => 360 / props.prizes.length)

// 创建扇形路径
const createSectorPath = (index: number): string => {
  const startAngle = index * sectorAngle.value
  const endAngle = (index + 1) * sectorAngle.value
  const centerX = 150
  const centerY = 150
  const radius = 148
  
  const startAngleRad = (startAngle * Math.PI) / 180
  const endAngleRad = (endAngle * Math.PI) / 180
  
  const x1 = centerX + radius * Math.cos(startAngleRad)
  const y1 = centerY + radius * Math.sin(startAngleRad)
  const x2 = centerX + radius * Math.cos(endAngleRad)
  const y2 = centerY + radius * Math.sin(endAngleRad)
  
  const largeArcFlag = endAngle - startAngle <= 180 ? "0" : "1"
  
  return `M ${centerX} ${centerY} L ${x1} ${y1} A ${radius} ${radius} 0 ${largeArcFlag} 1 ${x2} ${y2} Z`
}

// 获取文字位置
const getTextX = (index: number): number => {
  const angle = (index * sectorAngle.value + sectorAngle.value / 2) * Math.PI / 180
  return 150 + 90 * Math.cos(angle) // 调整半径，让文字更靠近中心
}

const getTextY = (index: number): number => {
  const angle = (index * sectorAngle.value + sectorAngle.value / 2) * Math.PI / 180
  return 150 + 90 * Math.sin(angle) // 调整半径，让文字更靠近中心
}

// 获取文字旋转变换
const getTextTransform = (index: number): string => {
  const angle = index * sectorAngle.value + sectorAngle.value / 2
  const textX = getTextX(index)
  const textY = getTextY(index)
  
  // 如果角度在右半边（-90度到90度），文字正常方向
  // 如果角度在左半边（90度到270度），文字旋转180度避免倒置
  const normalizedAngle = ((angle % 360) + 360) % 360
  const rotationAngle = normalizedAngle > 90 && normalizedAngle < 270 ? angle + 180 : angle
  
  return `rotate(${rotationAngle}, ${textX}, ${textY})`
}
</script>

<style scoped>
.lucky-wheel-container {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 30px;
  user-select: none;
}

.pointer {
  position: absolute;
  top: -30px;
  left: 50%;
  transform: translateX(-50%);
  z-index: 10;
  filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.3));
}

.lucky-wheel {
  position: relative;
  width: 300px;
  height: 300px;
  border-radius: 50%;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
  overflow: visible;
}

.lucky-wheel svg {
  display: block;
  border-radius: 50%;
}

.controls {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 20px;
}

.start-button {
  padding: 15px 30px;
  font-size: 18px;
  font-weight: bold;
  background: linear-gradient(135deg, #ff5722, #ff7043);
  color: white;
  border: none;
  border-radius: 50px;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 4px 15px rgba(255, 87, 34, 0.3);
  min-width: 140px;
}

.start-button:hover:not(:disabled) {
  background: linear-gradient(135deg, #e64a19, #ff5722);
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(255, 87, 34, 0.4);
}

.start-button:active:not(:disabled) {
  transform: translateY(0);
}

.start-button:disabled {
  background: #ccc;
  cursor: not-allowed;
  transform: none;
  box-shadow: none;
}

.start-button.spinning {
  animation: pulse 1s infinite;
}

@keyframes pulse {
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.05); }
}

/* 响应式设计 */
@media (max-width: 480px) {
  .lucky-wheel {
    width: 250px;
    height: 250px;
  }
  
  .start-button {
    padding: 12px 24px;
    font-size: 16px;
  }
}
</style> 