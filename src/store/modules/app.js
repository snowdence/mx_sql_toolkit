import Vue from 'vue'
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

        /// Object.assign({}, state.sheets, sheets)
    }
}

export default {
    namespaced: true,
    state,
    getters,
    actions,
    mutations
}