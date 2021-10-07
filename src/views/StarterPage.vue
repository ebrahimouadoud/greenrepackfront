<template>
  <div>
    <States />
    <vs-row vs-justify="center">
    </vs-row>
  </div>
</template>

<script>
import YearlySales from "./components/dashboard/YearlySales.vue";
import SalesOverview from "./components/dashboard/SalesOverview.vue";
import States from "./components/dashboard/States.vue";
import Blogs from "./components/dashboard/Blogs.vue";
import SalesDifference from "./components/dashboard/SalesDifference";
/* eslint-disable */
export default {
  name: "StarterPage",
  components: {
    YearlySales,
    SalesOverview,
    States,
    Blogs,
    SalesDifference
  }
};
</script>
