<template>
  <div class="home">
    <!-- <img src="../assets/logo.png"> -->
    <Navbar/>    
    <ListQuestion v-for="item in items" :key="item._id" :item="item"/>
  </div>
</template>

<script>
import ListQuestion from '@/components/ListQuestion.vue'
import Navbar from '@/components/Navbar.vue'
import store from '@/store.js'

export default {
  name: 'home',
  components: {
    // HelloWorld
    ListQuestion,
    Navbar
  },
  created() {
    store.dispatch('getQuestions')
  },
  computed: {
    items: {
      get() {
        return this.$store.state.questions
      }
    }
  },
}
</script>
