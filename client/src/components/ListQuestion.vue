<template>
  <b-container class="listquestion text-left">
    <b-row>
      <b-col md="2">
        <b-card>
          <b-button-group vertical>
            <b-button variant="primary" disabled>Votes <b-badge pill variant="light">{{item.upVote.length-item.downVote.length}}</b-badge></b-button>
            <b-button variant="success" disabled>Answers <b-badge pill variant="light">{{item.answers.length}}</b-badge></b-button>
          </b-button-group>
        </b-card>
      </b-col>
      <b-col md="10">
        <b-card footer-bg-variant="light">
          <h2><router-link :to="{ name: 'question', params: { id: item._id }}">{{item.title}}</router-link></h2>
          <small>Posted by: {{item.userId.name}}</small>
        </b-card>
      </b-col>
    </b-row>
  </b-container>
</template>

<script>
export default {
  props: ['item']
};
</script>

<style>
.listquestion {
  margin-bottom: 10px;
}
</style>
