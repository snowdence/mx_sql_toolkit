import Vue from 'vue'
import XLSX from 'xlsx'
class SQLHelper {
    db_query = ""
    db_name = ""
    db_col_schemas = {}
    constructor(db_name, db_col_schemas) {
        this.db_name = db_name;
        this.db_col_schemas = db_col_schemas;
    }
    buildCreateTable() {
        let q = '';
        for (let [k, v] of Object.entries(this.db_col_schemas)) {
            console.log(k, this.db_col_schemas[k]);
            let tbq = `CREATE TABLE ` + k + ` (`;
            v.forEach(item => {
                tbq += item.column_name + ' ' + item.datatype + '(' + item.datasize + '),\n'
            });
            tbq += ');'
            q += tbq + '\n';
            //console.log(q);
        }
        return q;
    }
    build() {
        this.db_query = ""
        this.db_query +=
            `USE master
                DROP DATABASE IF EXISTS ${this.db_name};
                GO
                CREATE DATABASE ${this.db_name}
                GO
                USE ${this.db_name}
                GO
            `;
        this.db_query += this.buildCreateTable()
        return this.db_query;
    }

}
function get_header_row(sheet) {
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
}
const state = () => ({
    headers: ["Test header"],
    tickets: [{
        name: "test"
    }],
    sql_opt: {
        database_name: "default",
        check_go_cmd: true,
        date_exel_format: "dd/MM/yyyy"
    },

    col_schemas: {},
    data_schemas: {},
    db_schemas: {
        col_schemas: {},
        data_schemas: {}
    },
    excel_raw_data: {
        sheet_names: [],
        sheets: {}
    },
    sql_text: "STATE APP"
})

const getters = {
    get_sheet: (state) => (table_name) => {
        return get_header_row(state.excel_raw_data.sheets[table_name]);
        //return state.excel_raw_data.sheets[table_name];
    },
    excel_json_data: state => {
        let json_rslt = {};
        state.excel_raw_data.sheet_names.forEach(function (item) {
            let parsed = XLSX.utils.sheet_to_json(state.excel_raw_data.sheets[item]);
            json_rslt[item] = parsed
        });
        return json_rslt
    },
    excel_json_header: state => {
        let json_rslt = {};
        state.excel_raw_data.sheet_names.forEach(function (item) {
            let parsed = this.get_header_row(state.excel_raw_data.sheets[item]);
            json_rslt[item] = parsed
        });
        return json_rslt
    }
}

const actions = {
    ADD_COL_SCHEMAS_action({ commit }, { tb_name, tb_schemas }) {
        commit('ADD_COL_SCHEMAS', {
            tb_name: tb_name,
            tb_schemas: tb_schemas
        })
    }
}

const mutations = {
    SET_SQL_OPT: (state, { key, value }) => {
        Vue.set(state.sql_opt, key, value);
    },
    SET_SQL_TEXT: (state, val) => {
        state.sql_text = val
    },
    SET_SHEETNAMES: (state, sheet_names) => {
        Vue.set(state.excel_raw_data, 'sheet_names', [...sheet_names]);
    },
    SET_SHEETS: (state, sheets) => {
        console.log(sheets);
        Vue.set(state.excel_raw_data, 'sheets', sheets)
    },
    SET_COL_SCHEMAS: (state, col_chemas) => {
        Vue.set(state.db_schemas, 'col_chemas', col_chemas)
    },
    ADD_COL_SCHEMAS: (state, { tb_name, tb_schemas }) => {
        console.log({
            tb_name: tb_name,
            tb_schemas: tb_schemas
        })
        Vue.set(state.col_schemas, tb_name, tb_schemas)
    },
    BUILD_SQL: (state) => {
        let sqlhelper = new SQLHelper("QLSV", state.col_schemas);
        console.log("== BUILD SQL ==  ")
        console.log(state.col_schemas);
        console.log(sqlhelper.build());
        state.sql_text = sqlhelper.build();
    }
}

export default {
    namespaced: true,
    state,
    getters,
    actions,
    mutations
}