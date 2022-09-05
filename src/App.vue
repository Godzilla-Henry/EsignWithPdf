<template>
  <div id="app">
    <nav>
      <router-link to="/">Esign</router-link> |
      <router-link to="/fabric">Fabric</router-link> |
      <router-link to="/Pdfview">Pdfview</router-link>
    </nav>
    <router-view/>
  </div>
</template>

<style>
nav {
  padding: 30px;
}

nav a {
  font-weight: bold;
  color: #2c3e50;
}

nav a.router-link-exact-active {
  color: #42b983;
}
</style>
