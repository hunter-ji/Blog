<template>
  <div id="nav">
    <router-link to="/">Home</router-link> |
    <router-link to="/about">About</router-link> |
    <!-- 新增site1路由 -->
    <router-link to="/site1">Site1</router-link> |
    <!-- 新增site2路由 -->
<!--    <router-link to="/site2">Site2</router-link>-->
  </div>
  <router-view/>
  <!-- 新增site1挂载节点 -->
  <div id="site1" />
  <!-- 新增site2挂载节点 -->
<!--  <div id="site2" />-->
</template>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}

#nav {
  padding: 30px;
}

#nav a {
  font-weight: bold;
  color: #2c3e50;
}

#nav a.router-link-exact-active {
  color: #42b983;
}
</style>
