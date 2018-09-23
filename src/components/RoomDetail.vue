<template>
  <div class="room-detail">
    <h2>{{ room.name }} is booked : {{ room.booked }}</h2>
    <p>{{ room.description }}</p>
    <p>This room has a capacity of {{ room.capacity }}.</p>
    <ul>
      <li v-for="equipement in room.equipements" v-bind:key="equipement.name">
        {{ equipement.name }}
      </li>
    </ul>
    <button v-on:click="book()">Book</button>
    <button v-if="room.booked" v-on:click="cancelBooking()">Cancel booking</button>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  name: 'RoomList',
  data() {
    return {
      room: {},
      bookingId: null,
    };
  },
  methods: {
    book() {
      axios
        .post(`http://localhost:3000/rooms/${this.$route.params.id}/book`)
        // eslint-disable-next-line
        .then(response => {
          this.room.booked = response.status === 200;
          // eslint-disable-next-line
          this.bookingId = response.data.room._id;
        });
    },
    cancelBooking() {
      axios
        .delete(`http://localhost:3000/rooms/${this.$route.params.id}/${this.bookingId}/cancel`)
        // eslint-disable-next-line
        .then(response => (this.room.booked = response.status !== 200));
    },
  },
  mounted() {
    axios
      .get(`http://localhost:3000/rooms/${this.$route.params.id}`)
      // eslint-disable-next-line
      .then(response => (this.room = response.data.room));
  },
};
</script>

<style scoped>
  #room-list {
    font-weight: normal;
  }
</style>
