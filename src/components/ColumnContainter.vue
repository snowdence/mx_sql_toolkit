<template>
  <div>
    <b-row>
      <b-col cols="3">
        <b-form-input value="COLUMN"></b-form-input>
      </b-col>
      <b-col cols="3"></b-col>
      <b-col cols="3">1</b-col>
    </b-row>
  </div>
</template>

<script>
export default {
  props: ["table_name"],
  data() {
    return {};
  },
  created() {
    this.$store.getters["app/get_header_row_from_sheet"](this.table_name);
  }
};
</script>