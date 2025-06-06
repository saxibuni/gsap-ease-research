<template>
  <WheelUI :prizes="prizes" :isSpinning="isSpinning" @spin="onStart" ref="wheelUIRef" />
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { gsap } from 'gsap'
import WheelUI from './WheelUI.vue'

// 定义奖品接口
interface Prize {
  name: string
  color: string
  textColor?: string
}

// UI组件引用
const wheelUIRef = ref()

// 响应式数据
const isSpinning = ref(false)

// 奖品配置
const prizes = ref<Prize[]>([
  { name: '一等奖', color: '#ff6b6b', textColor: '#fff' },
  { name: '二等奖', color: '#4ecdc4', textColor: '#fff' },
  { name: '三等奖', color: '#45b7d1', textColor: '#fff' },
  { name: '四等奖', color: '#f9ca24', textColor: '#333' },
  { name: '五等奖', color: '#6c5ce7', textColor: '#fff' },
  { name: '谢谢参与', color: '#a0a0a0', textColor: '#fff' },
  { name: '再来一次', color: '#fd79a8', textColor: '#fff' },
  { name: '小奖品', color: '#00b894', textColor: '#fff' }
])

// 计算每个扇形的角度
const sectorAngle = 360 / prizes.value.length

let tl: gsap.core.Timeline

let rotateCounter = 0
let spinIndex = 0
let canStop = false
let roundResultDeg = 0

function onStart() {
  // 模拟请求回来，3s钟后可以停止转盘转动
  setTimeout(() => {
    canStop = true
    spinIndex = Math.floor(Math.random() * prizes.value.length)
    roundResultDeg = spinIndex * sectorAngle + sectorAngle / 2
  }, 5000);
  
  startRotate()
}



function startRotate() {
  rotateCounter = 0
  canStop = false
  isSpinning.value = true

  const wheelElement = wheelUIRef.value?.wheelRef

  tl = gsap.timeline()
    .to(wheelElement, {
      rotation: '+=90',
      duration: 0.3,
      ease: "power1.in",
    })
    .to(wheelElement, {
      rotation: '+=360',
      duration: 0.6,
      ease: "none",
      repeat: -1,
      repeatDelay: 0,
      onRepeat() {
        rotateCounter++
      },
      onUpdate() {
        if (rotateCounter >= 1 && canStop) {
          onSpinEnd()
        }
      } 
    })

}

function onSpinEnd() {
  const wheelElement = wheelUIRef.value?.wheelRef!
  let currentRotation = (gsap.getProperty(wheelElement, 'rotation')! as number)
  currentRotation = currentRotation % 360
  gsap.set(wheelElement, { rotation: currentRotation })

  let diff = roundResultDeg - currentRotation
  diff = diff < 0 ? (360 + diff) : diff
  let duration = diff / 360 * 0.6 * 2
  tl.kill()
  tl = gsap.timeline().to(wheelElement, {
    rotation: roundResultDeg + '_cw',
    duration,
    ease: "power1.out",
    onComplete() {
      isSpinning.value = false
    }
  })
}



</script>