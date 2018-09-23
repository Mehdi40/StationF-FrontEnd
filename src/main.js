import Vue from 'vue';
import axios from 'axios';
import VueAxios from 'vue-axios';
import VTooltip from 'v-tooltip';
import { library } from '@fortawesome/fontawesome-svg-core';
import { faUsers, faTv, faChalkboard, faPhoneSquare } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import App from './App';
import router from './router';

library.add(faUsers, faTv, faChalkboard, faPhoneSquare);

Vue.component('font-awesome-icon', FontAwesomeIcon);
Vue.use(VTooltip);


Vue.config.productionTip = false;

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  components: { App },
  template: '<App/>',
});

Vue.use(VueAxios, axios);
