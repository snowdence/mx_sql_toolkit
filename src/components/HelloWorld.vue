<template>
  <b-container class="bv-example-row">
    <!-- Stack the columns on mobile by making one full-width and the other half-width -->

    <b-row>
      <form class="mt-4">
        <b-form-group id="fileInput">
          <b-form-file v-model="file" placeholder="Drag and drop"></b-form-file>
        </b-form-group>
      </form>
      <div class="mt-4" v-if="file">
        <p>Name: {{ file.name }}</p>
        <p>Size: {{ file.size }}</p>
        <p>lastModified: {{ file.lastModified }}</p>
        <p>Type: {{ file.type }}</p>
      </div>
      <div ref="preview" id="preview"></div>
    </b-row>
    <b-row>
      <b-col cols="6" md="4">
        <h1>Data Options</h1>Upload File:
        <b-form @submit="onSubmit">
          <b-form-group
            id="lb-db-name"
            label="DB Name:"
            label-for="input-db-name"
            description="Input database name for creating."
          >
            <b-form-input
              id="input-db-name"
              v-model="sql_opt.database_name"
              type="text"
              required
              placeholder="Database Name"
            ></b-form-input>
          </b-form-group>

          <b-form-group
            id="lb-date-excel"
            label="Exel Date Format:"
            label-for="input-date-format"
            description="Input date format in exel file."
          >
            <b-form-input
              id="input-date-format"
              v-model="sql_opt.date_exel_format"
              type="text"
              required
              placeholder="Date Format Exel"
            ></b-form-input>
          </b-form-group>
          <b-form-checkbox
            v-model="sql_opt.check_go_cmd"
            class="mb-2 mr-sm-2 mb-sm-0"
          >Use 'Go" after any commands</b-form-checkbox>

          <b-button type="submit" variant="primary">Submit</b-button>
        </b-form>
      </b-col>
      <b-col cols="12" md="8">
        <div>
          <h1>Table Data {{excel_raw_data.sheet_names.length}}</h1>
          <b-card no-body>
            <b-tabs pills card>
              <b-tab
                v-for="(exel, name, index) in excel_raw_data.sheets"
                :key="index"
                :title="name"
                :active="false"
              >
                <b-card-text>
                  <ColumnContainer :table_name="name" />
                </b-card-text>
              </b-tab>
            </b-tabs>
          </b-card>
        </div>
      </b-col>
    </b-row>
    <hr />
    <b-row>
      <b-col>
        <h1>SQL generator</h1>
      </b-col>
      <b-form-textarea
        id="textarea"
        :value="sql_text"
        placeholder="SQL ..."
        rows="10"
        max-rows="20"
      ></b-form-textarea>
    </b-row>
  </b-container>
</template>

<script>
import { mapState } from "vuex";
import ColumnContainer from "./ColumnContainter";
import XLSX from "xlsx";
export default {
  components: { ColumnContainer },
  computed: {
    ...mapState({
      excel_raw_data: state => state.app.excel_raw_data,
      sql_text: state => state.app.sql_text,
      sql_opt: state => state.app.sql_opt
    })
  },
  methods: {
    onSubmit(evt) {
      evt.preventDefault();
      this.$store.commit("app/BUILD_SQL");
    },
    get_header_row(sheet) {
      var headers = [],
        range = XLSX.utils.decode_range(sheet["!ref"]);
      var C,
        R = range.s.r; /* start in the first row */
      for (C = range.s.c; C <= range.e.c; ++C) {
        /* walk every column in the range */
        var cell =
          sheet[
            XLSX.utils.encode_cell({ c: C, r: R })
          ]; /* find the cell in the first row */
        var hdr = "UNKNOWN " + C; // <-- replace with your desired default
        if (cell && cell.t) hdr = XLSX.utils.format_cell(cell);
        headers.push(hdr);
      }
      return headers;
    },
    fixdata(data) {
      var o = "",
        l = 0,
        w = 10240;
      for (; l < data.byteLength / w; ++l)
        o += String.fromCharCode.apply(
          null,
          new Uint8Array(data.slice(l * w, l * w + w))
        );
      o += String.fromCharCode.apply(null, new Uint8Array(data.slice(l * w)));
      return o;
    },
    workbook_to_json(workbook) {
      var result = {};
      workbook.SheetNames.forEach(function(sheetName) {
        var roa = XLSX.utils.sheet_to_row_object_array(
          workbook.Sheets[sheetName]
        );
        if (roa.length > 0) {
          result[sheetName] = roa;
        }
      });
      return result;
    },
    handleDrop(e) {
      e.stopPropagation();
      e.preventDefault();
      let self = this;
      console.log("DROPPED");
      var files = e.dataTransfer.files,
        i,
        f;
      for (i = 0, f = files[i]; i != files.length; ++i) {
        var reader = new FileReader();
        reader.onload = function(e) {
          var results,
            data = e.target.result,
            fixedData = self.fixdata(data),
            workbook = XLSX.read(btoa(fixedData), { type: "base64" }),
            firstSheetName = workbook.SheetNames[1],
            worksheet = workbook.Sheets[firstSheetName];
          console.log(workbook);
          self.$store.state.app.headers = self.get_header_row(worksheet);

          results = XLSX.utils.sheet_to_json(worksheet);
          self.$store.state.app.tickets = results;
        };
        reader.readAsArrayBuffer(f);
      }
    },
    handleDragover(e) {
      e.stopPropagation();
      e.preventDefault();
      e.dataTransfer.dropEffect = "copy";
    }
  },
  data() {
    return {
      file: null,

      tickets: "",
      exel_data_parsed: {
        sheets: []
      },
      show: true
    };
  },

  watch: {
    file(val) {
      if (!val) return;

      let self = this;
      const fileReader = new FileReader();
      fileReader.onload = function(e) {
        var results,
          data = e.target.result,
          fixedData = self.fixdata(data);
        let workbook = XLSX.read(btoa(fixedData), { type: "base64" });
        //console.log(workbook.SheetNames);
        self.$store.commit("app/SET_SHEETNAMES", workbook.SheetNames);
        self.$store.commit("app/SET_SHEETS", workbook.Sheets);
        //console.log("Excel json data");
        //console.log(self.$store.getters["app/excel_json_data"]);
        //this.excel_raw_data = "Minhduc";
        //console.log(this.excel_raw_data);

        //console.log(self.$store.state.app.excel_raw_data);
        // for (let item in workbook.SheetNames) {
        //   console.log(item);
        //   let parsed = XLSX.utils.sheet_to_json(item);
        //   console.log(parsed);
        //   self.exel_data_parsed.sheets.push(parsed);
        // }

        //console.log(workbook);
        console.log(results);
      };
      fileReader.readAsArrayBuffer(this.file);
      // if (this.previewImg) {
      //   this.previewImg.remove();
      // }
      // const img = document.createElement("img");
      // img.classList.add("obj");
      // img.file = this.file;
      // this.previewImg = img;
      // this.$refs.preview.appendChild(img);

      // const fileReader = new FileReader();
      // fileReader.onload = e => {
      //   this.previewImg.src = e.target.result;
      // };
      // fileReader.readAsDataURL(this.file);
    }
  }
};
</script>
<style scoped>
#drop {
  border: 2px dashed #bbb;
  width: 100%;
  -moz-border-radius: 5px;
  -webkit-border-radius: 5px;
  border-radius: 5px;
  padding: 25px;
  text-align: center;
  font: 20pt bold, "Vollkorn";
  color: #bbb;
}

#preview img {
  max-width: 100%;
}

#fileInput.dragdrop .custom-file,
#fileInput.dragdrop .custom-file-input {
  height: 100px;
}

#fileInput.dragdrop .custom-file-label {
  border: 0;
  border: 5px dotted skyblue;
  height: 100px;
  line-height: 90px;
  text-align: center;
  color: skyblue;
  padding: 0;
}

#fileInput.dragdrop .custom-file:hover .custom-file-label {
  background: rgb(75, 181, 225);
  color: #fff;
}

#fileInput.dragdrop .custom-file-label::after {
  display: none;
}
</style>
