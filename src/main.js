import Vue from 'vue';
import App from './App.vue';
import router from './router';
import store from './store';
import vuetify from './plugins/vuetify';
import GoogleLogin from 'vue-google-login';

Vue.config.productionTip = false;
Vue.use(GoogleLogin);

new Vue({
    router,
    store,
    vuetify,
    render: h => h(App)
}).$mount('#app');
