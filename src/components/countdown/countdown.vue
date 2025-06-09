<template>
  <div>
    <div :class="['counter', { hide: hideCounter }]">
      <div class="nums">
        <span 
          v-for="(num, idx) in nums" 
          :key="idx"
          :class="spanClass(idx)"
          @animationend="handleAnimationEnd($event, idx)"
        >
          {{ num }}
        </span>
      </div>
    </div>
    <div :class="['final', { show: showFinal }]">
      <p style="font-size: 90px; font-weight: bolder; color: #1abc9c;">Start!!!</p>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      nums: [3, 2, 1],
      spanStates: [], 
      hideCounter: false,
      showFinal: false,
    };
  },
  mounted() {
    this.resetDOM();
  },
  methods: {
    spanClass(idx) {
      return this.spanStates[idx];
    },
    resetDOM() {
      this.hideCounter = false;
      this.showFinal = false;
      this.spanStates = this.nums.map(() => '');
      this.spanStates[0] = 'in';
    },
    handleAnimationEnd(e, idx) {
      const penultimate = this.nums.length - 1;
      if (e.animationName === 'goIn' && idx !== penultimate) {
        this.$set(this.spanStates, idx, 'out');
      } else if (e.animationName === 'goOut' && this.spanStates[idx + 1] !== undefined) {
        this.$set(this.spanStates, idx + 1, 'in');
      } else {
        this.hideCounter = true;
        this.showFinal = true;
      }
      setTimeout(() => {
        this.showFinal = false;
      }, 1900);
    }
  }
};
</script>

<style>
body {
  margin: 0;
	height: 100vh;
}

.counter {
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    text-align: center;
}

.counter.hide {
    transform: translate(-50%, -50%) scale(0);
    animation: hide .2s ease-out;
}

@keyframes hide {
    0% {
        transform: translate(-50%, -50%) scale(1);
    }

    100% {
        transform: translate(-50%, -50%) scale(0);
    }
}

.final {
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%) scale(0);
}

.final.show {
    transform: translate(-50%, -50%) scale(1);
    animation: show .3s ease-in;
}

@keyframes show {
    0% {
        transform: translate(-50%, -50%) scale(0);
    }

    80% {
        transform: translate(-50%, -50%) scale(1.4);
    }

    100% {
        transform: translate(-50%, -50%) scale(1);
    }
}

.nums {
	color: #1abc9c;
	position: relative;
	font-size: 100px;
	overflow: hidden;
	width: 250px;
	height: 95px;
}

.nums span {
	position: absolute;
	left: 50%;
	top: 50%;
	transform: translate(-50%, -50%) rotate(120deg);
	transform-origin: bottom center;
}

.nums span.in {
    transform: translate(-50%, -50%) rotate(0deg);
	animation: goIn .5s ease-in-out;
}

.nums span.out {
	animation: goOut .5s ease-in-out;
}

@keyframes goIn {
	0% {
		transform: translate(-50%, -50%) rotate(120deg);
	}
	30% {
		transform: translate(-50%, -50%) rotate(-20deg);
	}

	60% {
		transform: translate(-50%, -50%) rotate(10deg);
	}

	90%, 100% {
		transform: translate(-50%, -50%) rotate(0deg);
	}

}

@keyframes goOut {
	0%, 30% {
		transform: translate(-50%, -50%) rotate(0deg);
	}

	60% {
		transform: translate(-50%, -50%) rotate(20deg);
	}

	100% {
		transform: translate(-50%, -50%) rotate(-120deg);
	}
}

h4 {
	font-size: 20px;
	margin: 5px;
	text-transform: uppercase;
}



footer {
	position: fixed;
	bottom: 0;
	left: 0;
	right: 0;
	text-align: center;
	letter-spacing: 1px;
}

footer i {
	color: red;
}

footer a {
	color: #3C97BF;
	text-decoration: none;
}
</style>
