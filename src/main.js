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
        userId: ''
    },
    mutations: {
        userInfo(state, id) {
            state.userId = id;
        }
    },
    actions: {
        updateUserInfo(store, id) {
            store.commit('userInfo', id);
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
