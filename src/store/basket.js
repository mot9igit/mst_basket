import Axios from 'axios'

export default {
    state: {
        basket: [],
        basket_delivery: [],
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
        basket_delivery_api ({ commit }, data) {
            return Axios('/rest/basket', {
                method: 'POST',
                data: data,
                headers: {
                    'Access-Control-Allow-Origin': '*'
                }
            })
            .then((response) => {
                commit('SET_BASKET_DELIVERY_TO_VUEX', response.data)
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
        SET_BASKET_DELIVERY_TO_VUEX: (state, data) => {
            console.log(data)
            state.basket_delivery = data.data
        },
    },
    getters: {
        basket (state) {
            return state.basket
        },
        cost (state) {
            return state.cost
        },
        basket_delivery (state) {
            return state.basket_delivery
        },
    }
}
  