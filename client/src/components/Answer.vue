<template>
  <b-list-group-item class="flex-column">
    <b-row>
      <b-col md="2">
        <b-button-group vertical v-if="userId">
          <b-button variant="success" @click="voteA" v-if="userId!=item.userId">Vote <b-badge pill variant="light">{{ item.upVote.length }}</b-badge></b-button>
          <b-button variant="success" v-if="userId==item.userId" disabled>Vote <b-badge pill variant="light">{{ item.upVote.length }}</b-badge></b-button>
          <b-button variant="dark" @click="unVoteA" v-if="userId!=item.userId">Unvote <b-badge pill variant="light">{{ item.downVote.length }}</b-badge></b-button>
          <b-button variant="dark" v-if="userId==item.userId" disabled>Unvote <b-badge pill variant="light">{{ item.downVote.length }}</b-badge></b-button>
        </b-button-group>
        <b-button-group vertical v-if="!userId">
          <b-button variant="success" disabled>Vote <b-badge pill variant="light">{{ item.upVote.length }}</b-badge></b-button>
          <b-button variant="dark" disabled>Unvote <b-badge pill variant="light">{{ item.downVote.length }}</b-badge></b-button>
        </b-button-group>
      </b-col>
      <b-col md="10" ><p v-html="item.content">
    </p>
    <small>Posted by: {{user.name}}</small></b-col>
    </b-row>
  </b-list-group-item>
</template>

<script>
import store from "@/store.js";
import axios from "axios";
import Swal from "sweetalert2";
export default {
  props: ['item', 'user'],
  data() {
    return {
      userId: localStorage.getItem('userId')
    }
  },
  methods: {
      voteA() {
      const token = localStorage.getItem("Token");      
      const userId = localStorage.getItem("userId");
      const self = this;
      axios
        .put(
          `https://server-overflow.faipmardoni.net/answers/${self.item._id}/up-vote`,
          { userId },
          {
            headers: {
              token
            }
          }
        )
        .then(result => {
          Swal("Success!", "Your have sucessfully vote!", "success")
          self.$router.push({
              name: "home"
            });  
        })
        .catch(err => {
          Swal("Oops!", `${err.response.data.message}`, "error")          
          console.log('err.response :', err.response);
        });
    
    },
    unVoteA() {
      const token = localStorage.getItem("Token");
      const userId = localStorage.getItem("userId");
      const self = this;
      axios
        .put(
          `https://server-overflow.faipmardoni.net/answers/${self.item._id}/down-vote`,
          { userId },
          {
            headers: {
              token
            }
          }
        )
        .then(result => {
          Swal("Success!", "Your have sucessfully downVote!", "success")
          self.$router.push({
              name: "home"
            });  
        })
        .catch(err => {
          Swal("Oops!", `${err.response.data.message}`, "error")                      
          console.log('err.response :', err.response);
        });
    
    }
  }
};
</script>

<style>
</style>
