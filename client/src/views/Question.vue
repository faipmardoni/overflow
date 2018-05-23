<template>
  <div class="question">
    <Navbar/>        
    <b-container class="title-question">
      <b-jumbotron bg-variant="success" text-variant="white" border-variant="dark">
        <template slot="header">
          {{question.title}}
        </template>
        <template slot="lead">
          Posted by : {{question.userId.name}}
        </template>
      </b-jumbotron>
    </b-container>
    <b-container class="content-question">
      <b-row>
        <b-col md="2">
        <b-card>
          <b-button-group vertical v-if="hasLogin">
            <b-button variant="success" @click.prevent="voteQ" v-if="question.userId._id!=userId">Vote <b-badge pill variant="light">{{question.upVote.length}}</b-badge></b-button>
            <b-button variant="success" @click.prevent="voteQ" v-if="question.userId._id==userId" disabled>Vote <b-badge pill variant="light">{{question.upVote.length}}</b-badge></b-button>
            <b-button variant="dark" @click.prevent="unVoteQ" v-if="question.userId._id!=userId">Unvote <b-badge pill variant="light">{{question.downVote.length}}</b-badge></b-button>
            <b-button variant="dark" @click.prevent="unVoteQ" v-if="question.userId._id==userId" disabled>Unvote <b-badge pill variant="light">{{question.downVote.length}}</b-badge></b-button>
          </b-button-group>
          <b-button-group vertical v-if="!hasLogin">
            <b-button variant="success" disabled>Vote <b-badge pill variant="light">{{question.upVote.length}}</b-badge></b-button>
            <b-button variant="dark" disabled>Unvote <b-badge pill variant="light">{{question.downVote.length}}</b-badge></b-button>
          </b-button-group>
        </b-card>
      </b-col>
      <b-col md="10">
        <b-card footer-bg-variant="dark" v-html="question.content" style="padding: 25px;">
        </b-card>
        </b-col>
      </b-row>
    </b-container>
    <b-container class="content-answer" v-if="question.answers.length!=0">
      <b-card title="Answers">
        <b-list-group>
          <Answer v-for="item in question.answers" :key="item.id" :item="item" :user="question.userId"/>
        </b-list-group>
       </b-card>
    </b-container>
    <b-container  v-if="hasLogin">
      <b-card  bg-variant="dark" text-variant="white" title="Add Answer">
        <p class="card-text">
          With supporting text below as a natural lead-in to additional content.
        </p>
        <b-button href="#" variant="success" v-b-toggle.collapse1>CLICK TO ADD ANSWER</b-button>
        <b-collapse id="collapse1" class="mt-2">
          <b-card>
            <b-form-group class="card-text">
              <editor api-key="5z7mx0qf6bojkim44zldki33cvo6t3n5s8xzw4mtx03g5x08" :init="{plugins: 'wordcount', height:'360'}" v-model="answer"></editor>
            </b-form-group>
            <b-button type="submit" variant="success" @click="addAnswer">Publish</b-button>            
          </b-card>
        </b-collapse>
      </b-card>
    </b-container>
  </div>
</template>

<script>
import Editor from "@tinymce/tinymce-vue";
import Navbar from "@/components/Navbar.vue";
import store from "@/store.js";
import axios from "axios";
import Swal from "sweetalert2";
import Answer from "@/components/Answer.vue";

export default {
  data() {
    return {
      answer: "",
      question: "",
      userId: localStorage.getItem("userId")
    };
  },
  components: {
    editor: Editor,
    Navbar,
    Answer
  },
  created() {
    let self = this;
    store.state.questions.forEach(element => {
      if (element._id == self.$route.params.id) {
        self.question = element;
      }
    });
  },
  computed: {
    hasLogin: {
      get() {
        return this.$store.state.hasLogin;
      }
    }
  },
  methods: {
    addAnswer() {
      const token = localStorage.getItem("Token");
      const userId = localStorage.getItem("userId");
      const self = this;
      axios
        .post(
          "https://server-overflow.faipmardoni.net/answers",
          {
            content: self.answer,
            userId,
            questionId: self.question._id
          },
          {
            headers: {
              token
            }
          }
        )
        .then(result => {
          Swal("Success!", "Your answer has been publish!", "success");
          Object.assign(self.$data, self.$options.data.call(self));
          self.$router.push({
              name: "user"
            });        
        })
        .catch(err => {
          Swal("Oops!", "Something went wrong!", "error");
          console.log("err :", err.response);
        });
    },
    voteQ() {
      const token = localStorage.getItem("Token");
      const userId = localStorage.getItem("userId");
      const self = this;
      axios
        .put(
          `https://server-overflow.faipmardoni.net/questions/${self.question._id}/up-vote`,
          { userId },
          {
            headers: {
              token
            }
          }
        )
        .then(result => {
          Swal("Success!", "Your have sucessfully vote!", "success");
          self.$router.push({
              name: "home"
            });
        })
        .catch(err => {
          Swal("Oops!", `${err.response.data.message}`, "error");
          self.$router.push({
              name: "home"
            });  
        });
    },
    unVoteQ() {
      const token = localStorage.getItem("Token");
      const userId = localStorage.getItem("userId");
      const self = this;
      axios
        .put(
          `https://server-overflow.faipmardoni.net/questions/${self.question._id}/down-vote`,
          { userId },
          {
            headers: {
              token
            }
          }
        )
        .then(result => {
          Swal("Success!", "Your have sucessfully downVote!", "success");
          self.$router.push({
              name: "home"
            });  
        })
        .catch(err => {
          Swal("Oops!", `${err.response.data.message}`, "error");
          console.log("err.response :", err.response);
        });
    }
  }
};
</script>

<style>
.content-question {
  margin-bottom: 20px;
}
</style>
