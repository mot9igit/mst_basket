import Axios from 'axios'

export default {
    state: {
        basket: [],
        delivery_points: [],
        delivery_courier: [],
        basket_address: [],
        cost: 0
    },
    actions: {
        get_basket_api ({ commit }, data) {
            return Axios('/rest/marketplace', {
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
            return Axios('/rest/marketplace', {
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
        delivery_points_api ({ commit }, data) {
            return Axios('/rest/marketplace', {
                method: 'POST',
                data: data,
                headers: {
                    'Access-Control-Allow-Origin': '*'
                }
            })
            .then((response) => {
                commit('SET_DELIVERY_POINTS_TO_VUEX', response.data)
                return response
            })
            .catch(error => {
            })
        },
        delivery_courier_api ({ commit }, data) {
            return Axios('/rest/marketplace', {
                method: 'POST',
                data: data,
                headers: {
                    'Access-Control-Allow-Origin': '*'
                }
            })
            .then((response) => {
                commit('SET_DELIVERY_COURIER_TO_VUEX', response.data)
                return response
            })
            .catch(error => {
            })
        },
        basket_my_address_api ({ commit }, data) {
            return Axios('/rest/marketplace', {
                method: 'POST',
                data: data,
                headers: {
                    'Access-Control-Allow-Origin': '*'
                }
            })
            .then((response) => {
                commit('SET_BASKET_MY_ADDRESS_TO_VUEX', response.data)
                return response
            })
            .catch(error => {
            })
        },
        marketplace_response_api ({ commit }, data) {
            return Axios('/rest/marketplace', {
                method: 'POST',
                data: data,
                headers: {
                    'Access-Control-Allow-Origin': '*'
                }
            })
            .then((response) => {
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
        SET_DELIVERY_POINTS_TO_VUEX: (state, data) => {
            state.delivery_points = data.data
        },
        SET_BASKET_MY_ADDRESS_TO_VUEX: (state, data) => {
            state.basket_address = data.data
        },
        SET_DELIVERY_COURIER_TO_VUEX: (state, data) => {
            state.delivery_courier = data.data
        },
    },
    getters: {
        basket (state) {
            return state.basket
        },
        cost (state) {
            return state.cost
        },
        delivery_points (state) {
            return state.delivery_points
        },
        delivery_courier (state) {
            return state.delivery_courier
        },
        basket_address (state) {
            return state.basket_address
        },
    }
}
  