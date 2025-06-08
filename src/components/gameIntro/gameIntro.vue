<template>
  <div v-if="visible" class="intro-overlay">
    <transition name="balloon-rise" @after-enter="onEnterEnd" @after-leave="onLeaveEnd">
      <div v-show="showBalloon" class="balloon-content">
        <div class="tips-wrapper">
          <img src="@/assets/tips.png" class="tips-image" @load="onImageLoaded" />
          <transition name="bubble-fade">
            <div v-if="is_raise" class="speech-bubble">
              <div class="bubble-text">Are you ready?</div>
              <button class="yes-btn" @click="startGame">Yes</button>
            </div>
          </transition>
          <!-- 内容 -->
          <div class="tipscontent">
            <p>Welcome to the game!</p>
            <p>Please click "Yes" to start your game.</p>
          </div>
        </div>
      </div>
    </transition>
  </div>
</template>

<script>
export default {
  name: 'GameIntro',
  props: {
    onConfirmed: {
      type: Function,
      required: true
    }
  },
  data() {
    return {
      visible: true,
      showBalloon: false,
      is_raise: false,
      imageLoaded: false
    };
  },
  methods: {
    onImageLoaded() {
      // 图片加载完成后触发动画
      this.imageLoaded = true;
      this.$nextTick(() => {
        this.showBalloon = true;
      });
    },
    startGame() {
      this.is_raise = false;
      setTimeout(() => {
        this.showBalloon = false;
      }, 800);
    },
    onEnterEnd() {
      // 出现按钮
      setTimeout(() => {
        this.is_raise = true;
      }, 3000);
    },
    onLeaveEnd() {
      this.visible = false;
      this.onConfirmed();
    }
  }
};
</script>
  
<style scoped>
.intro-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 99999;
  background-color: rgba(0, 0, 0, 0.4);
}

.balloon-content {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  display: flex;
  flex-direction: column;
  align-items: center;
  transition: transform 0.8s ease-out, opacity 0.5s ease-out;
}

.tips-wrapper {
  position: relative;
  display: inline-block;
}

.tips-image {
  width: 1100px;
  height: auto;
  margin-bottom: 20px;
}

.tipscontent{
  position: absolute;
  top: 20%;
  left: 50%;
  transform: translate(-50%, -50%);
  text-align: center;
  color: #333;
  font-size: 20px;
  font-weight: bold;
  opacity: 0.8;
}

.speech-bubble {
  position: absolute;
  top: 86%;
  left: 70%;
  transform: translate(-50%, -100%);
  background: #ffffff;
  border-radius: 20px;
  padding: 20px 30px;
  max-width: 260px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  text-align: center;
  font-size: 18px;
  color: #333;
  z-index: 10;
}

.bubble-fade-enter-active {
  animation: appear 0.5s ease-out forwards;
}

.bubble-fade-leave-active {
  animation: disappear 0.4s ease-in forwards;
}

.speech-bubble::after {
  content: '';
  position: absolute;
  top: 60%;
  left: -20px;
  transform: translateY(-50%);
  width: 0;
  height: 0;
  border: 10px solid transparent;
  border-right-color: #ffffff;
}

.bubble-text {
  margin-bottom: 12px;
}

.yes-btn {
  padding: 6px 14px;
  font-size: 16px;
  background-color: #cfeef4;
  color: #333;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: background-color 0.2s;
}

.yes-btn:hover {
  background-color: #55bb88;
}

.balloon-rise-enter-active {
  animation: rise-up 0.8s ease-out forwards;
}

.balloon-rise-leave-active {
  animation: fly-away 0.8s ease-in forwards;
}

@keyframes rise-up {
  0% {
    transform: translate(-50%, 100%);
    opacity: 0;
  }
  100% {
    transform: translate(-50%, -50%);
    opacity: 1;
  }
}

@keyframes fly-away {
  0% {
    transform: translate(-50%, -50%) scale(1);
    opacity: 1;
  }
  100% {
    transform: translate(-50%, -200%) scale(0.2);
    opacity: 0;
  }
}

@keyframes appear {
  0% {
    opacity: 0;
    transform: translate(-50%, -120%) scale(0.8);
  }
  100% {
    opacity: 1;
    transform: translate(-50%, -100%) scale(1);
  }
}

@keyframes disappear {
  0% {
    opacity: 1;
    transform: translate(-50%, -100%) scale(1);
  }
  100% {
    opacity: 0;
    transform: translate(-50%, -120%) scale(0.8);
  }
}
</style>
  