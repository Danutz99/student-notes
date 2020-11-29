import Vue from 'vue';
import App from './App.vue';
import router from './router';
// import store from './store';
import vuetify from './plugins/vuetify';
import GoogleLogin from 'vue-google-login';
import Vuex from 'vuex';

Vue.config.productionTip = false;
Vue.use(GoogleLogin);
Vue.use(Vuex);

const store = new Vuex.Store({
    state: {
        username: ''
    },
    mutations: {
        username(state, name) {
            state.username = name;
        }
    },
    actions: {
        update_user_name(store, name) {
            store.commit('username', name);
        }
    }
});

new Vue({
    router,
    store,
    vuetify,
    render: h => h(App),
    created: function() {
        this.checkLogin();
    },
    watch: {
        $route: 'checkLogin'
    },
    methods: {
        checkLogin() {
            if (!localStorage.getItem('login')) {
                this.$router.push('login').catch(() => {});
                return;
            }

            // if (!this.$store.username && localStorage.getItem('login')) {
            //     this.$store.dispatch('update_user_name', 123);
            //     this.$router.push('user').catch(() => {});
            //     return;
            // }

            // if (this.$store.username && localStorage.getItem('login')) {
            //     this.$router.push('user').catch(() => {});
            //     return;
            // }
        }
    }
}).$mount('#app');
