<template>
    <div class="p-5">
        <vs-alert v-if="!loading && success"
          title="Adresse mail validée."
          active="true"
          color="success"
          class="mb-3"
        >
            Votre adresse mail a bien été vérifier, vous pouvez maintenant vous authentifier.
        </vs-alert>
        <vs-alert v-if="!loading && !success"
          title="Erreur"
          active="true"
          color="danger"
          class="mb-3"
        >
            Nous n'avons pas pu vérifier votre adresse mail, merci de contacter notre administration.
        </vs-alert>
        <b-spinner v-if="loading" class="align-middle"></b-spinner>
    </div>
</template>

<script>
import axios from "axios";
/* eslint-disable */ 
export default {
  data() {
    return {
      loading: true,
      success: false
    };
  },
  mounted() {
    this.checkKey();
    console.log(" ROUTE : ", this.$route.params);
  },
  methods: {
    checkKey() {
        if(this.$route.params.tkn){
            axios
                .get(
                    "/auth/validate/" + this.$route.params.tkn)
                .then(
                res => {
                    this.loading = false;
                    this.success = true;
                    setTimeout(() => {
                    this.$router.push('/')
                    }, 5000);
                },
                error => {
                    this.loading = false;
                    this.success = false;
                }
                );
        }else{
            this.loading = false
        }
    }
  }
};
</script>

