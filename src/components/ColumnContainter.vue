<template>
  <b-container class="bv-example-row">
    <b-row v-for="(col_data,index) in list_columns" :key="index">
      <b-col>
        <b-form-group>
          <b-form-input v-model="col_data.column_name"></b-form-input>
        </b-form-group>
      </b-col>
      <b-col>
        <b-form-group>
          <b-form-select v-model="col_data.datatype" :options="data_type_options"></b-form-select>
        </b-form-group>
      </b-col>
      <b-col>
        <b-form-group>
          <b-form-input :value="col_data.datasize"></b-form-input>
        </b-form-group>
      </b-col>
      <b-col>
        <b-form-group>
          <b-form-checkbox v-model="col_data.primary">Primary</b-form-checkbox>
          <b-form-checkbox v-model="col_data.unique">Unique</b-form-checkbox>
          <b-form-checkbox v-model="col_data.auto_increament">Auto increament</b-form-checkbox>
          <b-form-checkbox v-model="col_data.can_null">Can NULL</b-form-checkbox>
        </b-form-group>
      </b-col>
      <b-col>
        <b-form-group>
          <b-form-input v-model="col_data.foreign_relation"></b-form-input>
        </b-form-group>
      </b-col>
    </b-row>
  </b-container>
</template>

<script>
import { mapActions } from "vuex";

export default {
  props: ["table_name"],
  methods: {
    ...mapActions("app", ["ADD_COL_SCHEMAS_action"])
  },

  data() {
    return {
      column_schema: [],
      data_type_options: [
        { value: "char", text: "char" },
        { value: "nchar", text: "nchar" },
        { value: "nvarchar", text: "nvarchar" },
        { value: "varchar", text: "varchar" },
        { value: "int", text: "int" }
      ],
      list_columns: [] //name, datatype, size, primary, unique, autoincreament, can_null
    };
  },
  watch: {
    list_columns: {
      handler(val) {
        //console.log(val);
        let table_name = this.table_name;
        this.ADD_COL_SCHEMAS_action({
          tb_name: table_name,
          tb_schemas: val
        });
        // this.$store.commit("app/ADD_COL_SCHEMAS", {
        //   tb_name: table_name,
        //   tb_schemas: val
        // });

        //console.log("Commit state " + this.table_name);
      },
      deep: true
    }
  },
  created() {
    var column_headers = this.$store.getters["app/get_sheet"](this.table_name);
    let self = this;
    column_headers.forEach(function(col_header) {
      self.list_columns.push({
        column_name: col_header,
        datatype: "nvarchar",
        datasize: 50,
        primary: false,
        unique: false,
        auto_increament: false,
        can_null: true,
        foreign_relation: ""
      });
    });
  }
};
</script>