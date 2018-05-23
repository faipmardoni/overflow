<template>
  <div class="admin">
    <Navbar/>            
    <b-container>
        <h1 v-if="isEdit==false">Create New Question</h1>
        <h1 v-if="isEdit==true">Edit Question</h1>
        <b-form-group>
          <b-form-input type="text" required placeholder="Enter Title" v-model="title" ref="focusThis">
          </b-form-input>
        </b-form-group>
        <b-form-group>
          <editor api-key="h80880oagf5sptclv172iyfnicpdx2c3ewjilb6rl3sthf6b" :init="{plugins: 'wordcount', height:'360'}" v-model="content"></editor>
        </b-form-group>
        <b-button-group size="lg">
        <b-button type="submit" variant="success" @click="submit" v-if="isEdit==false">Publish</b-button>
        <b-button type="submit" variant="primary" @click="updated" v-if="isEdit==true" style="float:left">Update</b-button>
        </b-button-group>
        <b-button type="submit" size="lg" variant="primary" @click="added" v-if="isEdit==true" style="float:right">Add Question</b-button>
        <hr>
    </b-container>
    <b-container>
      <h2>List Your Questions</h2>
      <b-table striped hover :items="items" :fields="fields">
        <template slot="createdAt" slot-scope="row">
            {{formatDate(row.item.createdAt)}}
          </template>
          <template slot="updatedAt" slot-scope="row">
            {{formatDate(row.item.updatedAt)}}
          </template>
        <template slot="actions" slot-scope="row">
          <b-button-group size="sm">
            <b-button variant="primary" @click="editPost(row.item)">
              EDIT
            </b-button>
            <b-button variant="danger" @click="deletePost(row.item)">
              DELETE
            </b-button>
          </b-button-group>
        </template>
      </b-table>
      <hr>
    </b-container>
    <b-container>
      <h2>List Your Answers</h2>
      {{items.answers}}
        <b-table striped hover :items="answers" :fields="answerFields">
          <template slot="createdAt" slot-scope="row">
            {{formatDate(row.item.createdAt)}}
          </template>
          <template slot="updatedAt" slot-scope="row">
            {{formatDate(row.item.updatedAt)}}
          </template>
          <template slot="questionId" slot-scope="row">
            <router-link :to="{ name: 'question', params: { id: row.item.questionId }}">
              {{row.item.questionId}}
            </router-link>
          </template>
          <template slot="actions" slot-scope="row">
            <b-button-group size="sm">
              <b-button variant="danger" @click="deleteAnswer(row.item)">
                DELETE
              </b-button>
            </b-button-group>
          </template>
        </b-table>
    </b-container>
  </div>
</template>

<script>
import Editor from "@tinymce/tinymce-vue";
import Swal from "sweetalert2";
import axios from "axios";
import store from "@/store.js";
import Navbar from "@/components/Navbar.vue";

export default {
  components: {
    editor: Editor,
    Navbar
  },
  data: function() {
    return {
      title: "",
      content: "",
      answerFields: {
        post_created: {
          key: "createdAt",
          label: "Created",
          sortable: true
        },
        post_updated: {
          key: "updatedAt",
          label: "Updated",
          sortable: true
        },
        post_title: {
          key: "questionId",
          label: "ID Question",
          sortable: true
        },
        actions: {
          key: "actions"
        }
      },
      fields: {
        post_created: {
          key: "createdAt",
          label: "Created",
          sortable: true
        },
        post_updated: {
          key: "updatedAt",
          label: "Updated",
          sortable: true
        },
        post_title: {
          key: "title",
          label: "Title",
          sortable: true
        },
        actions: {
          key: "actions"
        }
      },
      isEdit: false,
      post: null
    };
  },
  created() {
    const token = localStorage.getItem("Token");
    if (!token || !this.hasLogin) {
      this.$router.push({
        name: "home"
      });
    } else {
      store.dispatch("questionsByUser");
    }
  },
  computed: {
    items: {
      get() {
        return this.$store.state.questionsByUser;
      }
    },
    answers: {
      get() {
        return this.$store.state.answersByUser;
      }
    },
    hasLogin: {
      get() {
        return this.$store.state.hasLogin;
      }
    }
  },
  methods: {
    formatDate(date) {
      let event = new Date(date);
      var options = {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric"
      };
      return event.toLocaleDateString("en-US", options);
    },
    submit() {
      const token = localStorage.getItem("Token");
      let userId = localStorage.getItem("userId");
      let self = this;
      axios
        .post(
          "https://server-overflow.faipmardoni.net/questions/",
          {
            userId,
            title: this.title,
            content: this.content
          },
          {
            headers: {
              token
            }
          }
        )
        .then(function(result) {
          Swal("Success!", "Your question has been publish!", "success");
          store.commit("addQuestions", result.data.result);
          Object.assign(self.$data, self.$options.data.call(self));
        })
        .catch(function(error) {
          Swal("Oops!", "Something went wrong!", "error");
          console.log("error :", error);
        });
    },
    deletePost(item) {
      const token = localStorage.getItem("Token");
      let self = this;
      axios
        .delete(`https://server-overflow.faipmardoni.net/questions/${item._id}`, {
          headers: {
            token
          }
        })
        .then(response => {
          const idx = self.items.indexOf(item);
          Swal("Deleted!", "Your question has been deleted!", "success");
          store.commit("deleteQuestions", idx);
        })
        .catch(error => {
          Swal("Oops!", "Something went wrong!", "error");
          console.log("error :", error);
        });
    },
    deleteAnswer(item) {
      const token = localStorage.getItem("Token");
      let self = this;
      axios
        .delete(`https://server-overflow.faipmardoni.net/answers/${item._id}`, {
          headers: {
            token
          }
        })
        .then(response => {
          const idx = self.answers.indexOf(item)
          self.answers.splice(idx, 1)
          Swal("Deleted!", "Your answers has been deleted!", "success");
        })
        .catch(error => {
          Swal("Oops!", "Something went wrong!", "error");
          console.log("error :", error);
        });
    },
    reset() {
      Object.assign(this.$data, this.$options.data.call(this));
    },
    editPost(item) {
      this.$refs.focusThis.focus();
      this.post = item;
      this.title = item.title;
      this.content = item.content;
      this.isEdit = true;
    },
    updated() {
      const token = localStorage.getItem("Token");
      let userId = localStorage.getItem("userId");
      let self = this;
      axios
        .put(
          `https://server-overflow.faipmardoni.net/questions/${self.post._id}`,
          {
            title: self.title,
            content: self.content
          },
          {
            headers: {
              token
            }
          }
        )
        .then(response => {
          const idx = self.items.indexOf(self.post);
          self.items[idx].title = this.title;
          self.items[idx].description = this.description;
          self.items[idx].content = this.content;
          self.items[idx].image = response.data.result.image;
          Swal("Success!", "Your product has been updated!", "success");
          self.title = null;
          self.description = null;
          self.content = null;
          Object.assign(self.$data, self.$options.data.call(self));          
        })
        .catch(error => {
          Swal("Oops!", "Something went wrong!", "error");
          console.log("error :", error.response);
        });
    },
    signout() {
      localStorage.clear();
      store.commit("changeLogin", false);
      this.$router.push({
        name: "home"
      });
    },
    added() {
      this.isEdit = true;
      Object.assign(this.$data, this.$options.data.call(this));                
    }
  }
};
</script>


