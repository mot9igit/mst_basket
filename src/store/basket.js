import Axios from 'axios'

export default {
    state: {
        basket: [],
        cost: 0
    },
    actions: {
        get_basket_api ({ commit }, data) {
            return Axios('/rest/basket', {
                method: 'POST',
                data: data,
                headers: {
                    'Access-Control-Allow-Origin': '*'
                }
            })
            .then((response) => {
                commit('SET_BASKET_TO_VUEX', response.data)
                // console.log(response)
                return response
            })
            .catch(error => {
            })
        },
        basket_api ({ commit }, data) {
            return Axios('/rest/basket', {
                method: 'POST',
                data: data,
                headers: {
                    'Access-Control-Allow-Origin': '*'
                }
            })
            .then((response) => {
                commit('SET_BASKET_TO_VUEX', response.data)
                return response
            })
            .catch(error => {
            })
        },
    },
    mutations: {
        SET_BASKET_TO_VUEX: (state, data) => {
            state.basket = data.data.data
            state.cost = data.data.cost
        },
    },
    getters: {
        basket (state) {
            return state.basket
        },
        cost (state) {
            return state.cost
        }
    }
}
  