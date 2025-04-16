<template>
    <div class="counter">
      <button 
        class="counter-btn counter-btn--minus" 
        @click="decrement"
        :disabled="count <= min"
      >
        —
      </button>
      
      <span class="counter-value">{{ count }}</span>
      
      <button 
        class="counter-btn counter-btn--plus" 
        @click="increment"
        :disabled="count >= max"
      >
        +
      </button>
    </div>
  </template>
  
  <script>
  export default {
    name: 'Counter',
    props: {
      min: {
        type: Number,
        default: 0
      },
      max: {
        type: Number,
        default: 10
      },
      initial: {
        type: Number,
        default: 1
      },
      keyProduct: {
        type: String,
        required: true
      }
    },
    data() {
      return {
        count: this.initial,
        timeoutId: null,
        lastValue: this.initial
      }
    },
    methods: {
      handleChange(newCount) {
        // Отменяем предыдущий таймаут, если он есть
        if (this.timeoutId) {
          clearTimeout(this.timeoutId);
        }
        
        // Устанавливаем новый таймаут
        this.timeoutId = setTimeout(() => {
          if (this.lastValue !== newCount) {
            this.$emit('change', newCount, this.keyProduct);
            this.lastValue = newCount;
          }
        }, 500);
      },
      increment() {
        if (this.count < this.max) {
          this.count++;
          this.handleChange(this.count);
        }
      },
      decrement() {
        if (this.count > this.min) {
          this.count--;
          this.handleChange(this.count);
        }
      }
    },
    watch: {
      initial(newVal) {
        this.count = newVal;
        this.lastValue = newVal;
      }
    },
    beforeDestroy() {
      // Очищаем таймаут при уничтожении компонента
      if (this.timeoutId) {
        clearTimeout(this.timeoutId);
      }
    }
  }
  </script>
  
  <style scoped>
  /* Стили остаются без изменений */
  .counter {
    display: inline-flex;
    align-items: center;
    gap: 2px;
    border-radius: 4px;
    height: 34px;
    background: #F8F7F5;
  }
  
  .counter-btn {
    width: 30px;
    height: 30px;
    border: none;
    background: #f5f5f5;
    border-radius: 4px;
    font-size: 16px;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  
  .counter-btn:hover {
    background: #e0e0e0;
  }
  
  .counter-btn:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
  
  .counter-value {
    min-width: 30px;
    text-align: center;
  }
  </style>