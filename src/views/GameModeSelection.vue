<template>
  <div class="game-mode-selection">
    <h1>选择游戏模式</h1>
    <button @click="goToSinglePlayer">单人游戏</button>
    <button @click="createRoom">创建房间</button>
    <button @click="joinRoom">加入房间</button>
  </div>
</template>

<script>
export default {
  name: 'GameModeSelection',
  methods: {
    goToSinglePlayer() {
      this.$router.push({ name: 'game', params: { value: 'local' } });
    },
    createRoom() {
      // 这里可以添加创建房间的逻辑
      console.log('创建房间');
    },
    joinRoom() {
      // 这里可以添加加入房间的逻辑
      console.log('加入房间');
    }
  }
};
</script>

<style scoped>
.game-mode-selection {
  text-align: center;
  padding: 20px;
}
button {
  margin: 10px;
  padding: 10px 20px;
}
</style>