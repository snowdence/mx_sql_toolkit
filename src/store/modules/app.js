import Vue from 'vue'
import XLSX from 'xlsx'
const state = () => ({
    headers: ["Test header"],
    tickets: [{
        name: "test"
    }],
    excel_raw_data: {
        sheet_names: [],
        sheets: {}
    }
})

const getters = {
    get_header_row_from_sheet: (state, table_name) => {
        let sheet = state.excel_raw_data.sheets[table_name];
        console.log(sheet)
        var headers = [],
            range = XLSX.utils.decode_range(sheet["!ref"]);
        var C,
            R = range.s.r; /* start in the first row */
        for (C = range.s.c; C <= range.e.c; ++C) {
            /* walk every column in the range */
            var cell =
                sheet[
                    XLSX.utils.encode_cell({
                        c: C,
                        r: R
                    })
                ]; /* find the cell in the first row */
            var hdr = "UNKNOWN " + C; // <-- replace with your desired default
            if (cell && cell.t) hdr = XLSX.utils.format_cell(cell);
            headers.push(hdr);
        }
        return headers;

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

}

const mutations = {
    SET_SHEETNAMES: (state, sheet_names) => {
        Vue.set(state.excel_raw_data, 'sheet_names', [...sheet_names]);
    },
    SET_SHEETS: (state, sheets) => {
        console.log(sheets);
        Vue.set(state.excel_raw_data, 'sheets', sheets)
    }
}

export default {
    namespaced: true,
    state,
    getters,
    actions,
    mutations
}