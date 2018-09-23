import Vue from 'vue';
import Router from 'vue-router';
import HelloWorld from '@/components/HelloWorld';
import RoomList from '@/components/RoomList';
import RoomDetail from '@/components/RoomDetail';

Vue.use(Router);

export default new Router({
  routes: [
    {
      path: '/',
      name: 'HelloWorld',
      component: HelloWorld,
    },
    {
      path: '/rooms',
      name: 'RoomList',
      component: RoomList,
    },
    {
      path: '/rooms/:id',
      name: 'RoomDetail',
      component: RoomDetail,
    },
  ],
});
