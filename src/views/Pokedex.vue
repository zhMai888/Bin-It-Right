<template>
  <div class="wrapper">
    <div class="page-container">
      <div class="display-box">

        <!-- 顶部导航栏 -->
        <div class="category-nav">
          <button
              v-for="category in categories"
              :key="category.id"
              :class="['nav-button', categoryClass(category.id), { active: selectedCategory === category.id }]"
              @click="selectedCategory = category.id"
          >
            {{ category.name }}
          </button>
          <button
              :class="['nav-button', 'category-0', { active: selectedCategory === 0 }]"
              @click="selectedCategory = 0"
          >
            全部
          </button>
        </div>

        <!-- 下方左右区域 -->
        <div class="content-area">
          <!-- 左：卡片区 -->
          <div class="card-scroll">
            <div class="card-wrapper">
              <div
                  v-for="item in filteredTrash"
                  :key="item.id"
                  class="trash-card"
                  @click="selectCard(item)"
              >
                <div class="image-box">
                  <img :src="require(`@/assets/trash/${item.img}`)" :alt="item.name" />
                </div>
                <h3>{{ item.name }}</h3>
                <div class="type-box" >{{ getCategoryName(item.typeid) }}</div>
              </div>
            </div>
          </div>

          <!-- 卡片详情展示区 -->
          <div class="detail-box" :class="getTypeClassBorder(currentCard.typeid)" v-if="currentCard">
            <!-- 编号区域 -->
            <div class="card-id" :class="getTypeClass(currentCard.typeid)">
              No. {{ currentCard.id }}
            </div>

            <!-- 图片展示 -->
            <div class="image-preview" :class="getTypeClass(currentCard.typeid)">
              <img :src="require(`@/assets/trash/${currentCard.img}`)" :alt="currentCard.name" />
            </div>

            <!-- 信息区域 -->
            <div class="info-box" :class="getTypeClass(currentCard.typeid)">
              <div class="info-group">
                <div class="info-item">
                  <span class="label">名称：</span>
                  <span class="value">{{ currentCard.name }}</span>
                </div>
                <div class="info-item">
                  <span class="label">类型：</span>
                  <span class="value">{{ getCategoryName(currentCard.typeid) }}</span>
                </div>
              </div>
              <p><strong>简介：</strong>{{ currentCard.description || '暂无简介' }}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { getAllTrash } from '@/api/trash';
export default {
  data() {
    return {
      selectedCategory: 0,
      currentCard: null,
      categories: [
        { id: 1, name: '食物' },
        { id: 2, name: '可回收垃圾' },
        { id: 3, name: '不可回收垃圾' },
        { id: 4, name: '有害垃圾' },
        { id: 5, name: '厨余垃圾' }
      ],
      trashData: []
    };
  },
  computed: {
    filteredTrash() {
      if (this.selectedCategory === 0) {
        return this.trashData;
      }
      return this.trashData.filter(item => item.typeid === this.selectedCategory);
    }
  },
  methods: {
    getCategoryName(typeid) {
      const category = this.categories.find(c => c.id === typeid);
      return category ? category.name : '未知类型';
    },
    selectCard(card) {
      this.currentCard = card;
    },
    categoryClass(id) {
      return `category-${id}`;
    },
    getTypeClass(typeid) {
      return `category-${typeid}`;
    },
    getTypeClassBorder(typeid) {
      return `deep-${typeid}`;
    },
    async loadPicture(){
      try {
        const res = await getAllTrash();
        this.trashData = res.data
      }catch (e) {
        alert("Data Load Fault!!!")
      }
    }
  },
  mounted() {
    // 默认显示第一项为详情
    this.currentCard = this.trashData[0];
    this.loadPicture();
  }
};
</script>

<style scoped>
html, body {
  height: 100%;
  margin: 0;
  overflow: hidden;
  font-family: Arial, sans-serif;
  background-color: #f0f2f5;
}

.wrapper {
  width: 100vw;
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
}

.page-container {
  width: 70vw;
  height: 90vh;
}

.display-box {
  width: 100%;
  height: 100%;
  border-radius: 12px;
  box-shadow: 0 0 10px rgba(0,0,0,0.1);
  background-color: #ffffff;
  display: flex;
  flex-direction: column; /* ✅ 垂直布局 */
  overflow: hidden;
}

.category-nav {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 10px;
  background-color: #f7f7f7;
  border-bottom: 1px solid #ddd;
  flex-shrink: 0;
}
/* 公共按钮样式 */
.nav-button {
  width: 100px;               /* ✅ 固定宽度 */
  height: 36px;               /* ✅ 固定高度 */
  line-height: 36px;          /* ✅ 垂直居中 */
  text-align: center;         /* ✅ 水平居中 */
  font-size: 14px;
  font-weight: 500;
  margin: 0 6px;
  padding: 0;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  background-color: #eee;
  color: #333;
  transition: background-color 0.3s ease;
  box-sizing: border-box;
}

/* 分类对应的默认颜色（浅色） */
.category-1 { background-color: #fff8c2; color: #8a6d00; }  /* 食物（浅黄） */
.category-2 { background-color: #cce5ff; color: #004085; }  /* 可回收（浅蓝） */
.category-3 { background-color: #e2e3e5; color: #383d41; }  /* 不可回收（浅黑灰） */
.category-4 { background-color: #f8d7da; color: #721c24; }  /* 有害（浅红） */
.category-5 { background-color: #d4edda; color: #155724; }  /* 厨余（浅绿） */
.category-0 { background-color: #e2d6f5; color: #4a2c75; }  /* 全部（浅紫） */

/* 激活后的深色背景 */
.nav-button.active.category-1 { background-color: #ffcc00; color: #fff; }
.nav-button.active.category-2 { background-color: #007bff; color: #fff; }
.nav-button.active.category-3 { background-color: #343a40; color: #fff; }
.nav-button.active.category-4 { background-color: #dc3545; color: #fff; }
.nav-button.active.category-5 { background-color: #28a745; color: #fff; }
.nav-button.active.category-0 { background-color: #6f42c1; color: #fff; }

.deep-1 { background-color: #ffcc00; color: #fff; }
.deep-2 { background-color: #007bff; color: #fff; }
.deep-3 { background-color: #343a40; color: #fff; }
.deep-4 { background-color: #dc3545; color: #fff; }
.deep-5 { background-color: #28a745; color: #fff; }

.card-scroll {
  flex: 1.2;
  overflow-y: auto;
  padding: 20px;
  box-sizing: border-box;
}

.card-wrapper {
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
}

.trash-card {
  width: 150px;
  padding: 10px;
  background-color: #f9f9f9;
  border-radius: 8px;
  border: 1px solid #ddd;
  box-shadow: 1px 1px 5px rgba(0,0,0,0.05);
  text-align: center;
  display: flex;
  flex-direction: column;
  gap: 8px;
  cursor: pointer;
  transition: transform 0.2s ease;
}

.trash-card:hover {
  transform: scale(1.03);
}

.image-box {
  border: 1px solid #ccc;
  padding: 4px;
  border-radius: 6px;
  background-color: #fff;
}

.image-box img {
  width: 80px;
  height: 80px;
  object-fit: contain;
}

.type-box {
  font-size: 13px;
  color: #666;
  background-color: #eef2f5;
  padding: 4px 8px;
  border-radius: 4px;
}

/* ✅ 下方内容区域为左右分栏 */
.content-area {
  display: flex;
  flex: 1; /* 占据剩余空间 */
  overflow: hidden;
}

/* ✅ 左侧卡片区（占70%） */
.card-scroll {
  width: 66.6%;
  overflow-y: auto;
  padding: 20px;
  box-sizing: border-box;
}

.detail-box {
  width: 33.3%;
  padding: 20px;

  /* ✅ 加边框+圆角+阴影模拟卡片效果 */
  border: 1px solid #ccc;
  border-radius: 12px;
  margin: 16px;
  box-shadow: 0 0 8px rgba(0,0,0,0.05);

  font-size: 14px;
  line-height: 1.6;
  overflow-y: auto;
}

.card-id {
  font-weight: bold;
  font-size: 20px;
  padding: 12px 16px;
  margin-bottom: 16px;

  /* ✅ 添加边框，只保留上左右三面 */
  border: 1px solid #ccc;
  border-bottom: 2px solid #ddd;

  /* ✅ 设置仅上两个圆角 */
  border-top-left-radius: 8px;
  border-top-right-radius: 8px;
}

.image-preview {
  width: 100%;
  margin: 0 auto 16px auto; /* 居中 + 下边距 */
}

.image-preview img {
  width: 100%;
  max-height: 180px; /* 限制图片最大高度 */
  object-fit: contain;
}

.info-box {
  width: 92.82%;
  height: 42%;
  font-size: 16px;
  padding: 12px;
  border: 1px solid #ccc;
  border-radius: 8px;
}

/* ✅ 包裹前两项的容器，整体居中 */
.info-group {
  display: flex;
  flex-direction: column;
  align-items: center; /* ✅ 水平居中 */
  margin-bottom: 12px;
}

/* ✅ 每一项保持左右结构且对齐 */
.info-item {
  display: flex;
  flex-direction: row;
  margin-bottom: 6px;
  font-size: 16px;
  width: 200px; /* ✅ 控制整项宽度，使内容统一居中 */
}

/* ✅ 左侧标签固定宽度对齐冒号 */
.label {
  width: 60px;
  font-weight: bold;
  color: #333;
  text-align: right;
  margin-right: 8px;
}

/* ✅ 右侧内容 */
.value {
  color: #555;
  flex: 1;
}
</style>
