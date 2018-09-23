<template>
  <div id="room-list" :style="cssProps">
    <div class="filters">
      <div class="inside-filters">
        <div class="first-filters">
          <label><span>Text</span>
            <input type="text" class="input-field" v-model="searchText" placeholder="Text">
          </label>
          <label><span>Room size</span>
            <input type="number" v-model="searchCapacity"
                   class="input-field" placeholder="Capacity" min="0">
          </label>
        </div>
        <div class="second-filters">
          <label><span>Amenity</span>
            <div class="container-icon">
              <div class="icon" v-for="item in equipments"
                   v-on:click="chooseEquipments(item.name)"
                   v-bind:key="item.name"
                   v-bind:class="{ selected: selectedEquipments.includes(item.name) }">
                <font-awesome-icon class="equipment-icon" :icon="faToObject[item.name]" />
                <span>{{ item.name }}</span>
              </div>
            </div>
          </label>
        </div>
        <div class="date-filter">
          <label><span>Date</span>
            <datepicker v-model="selectedDate"></datepicker>
          </label>
        </div>
      </div>
    </div>
    <div class="rooms">
      <div class="room" v-for="item in filteredItems" v-bind:key="item.name">
        <router-link :to="{path: `/rooms/${item._id}`}">
          <div class="picture">
            <img v-bind:src="require(`../assets/img/${item.imgName}.jpg`)" alt="Room">
            <span>{{ item.name }}</span>
          </div>
        </router-link>
        <div class="infos">
          <div class="primary-infos">
            <div class="capacity">
              <div class="chairs">
                <font-awesome-icon class="equipment-icon users" icon="users" />
              </div>
              <span>{{ item.capacity }} seats</span>
            </div>
            <div class="equipments">
              <div class="equipement" v-for="equipment in item.equipements"
                   v-bind:key="equipment.name">
                <font-awesome-icon class="equipment-icon" :icon="faToObject[equipment.name]" />
              </div>
            </div>
          </div>
          <div class="hours">
            <div class="hour" v-for="(h, key) in bookableHours" v-bind:key="key"
                 v-on:click="book(item._id, h)"
                 v-bind:class="{booked: bookedHours[item._id] &&
                 bookedHours[item._id].includes(new Date(h).toJSON())}"
                 v-tooltip.top-center="displayDate(new Date(h))">
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios';
import moment from 'moment';
import Datepicker from 'vuejs-datepicker';

export default {
  name: 'RoomList',
  components: {
    Datepicker,
  },
  computed: {
    cssProps() {
      return {
        '--color-very-light': '#FCFFF5',
        '--color-light': '#D1DBBD',
        '--color-medium': '#91AA9D',
        '--color-dark': '#3E606F',
        '--color-very-dark': '#193441',
      };
    },
  },
  data() {
    return {
      selected: false,
      objectName: {
        TV: 'TV',
        'Retro Projecteur': 'Projecteur',
        Telephone: 'Téléphone',
      },
      faToObject: {
        TV: 'tv',
        'Retro Projecteur': 'chalkboard',
        Telephone: 'phone-square',
      },
      selectedDate: new Date(),
      bookedHours: [],
      bookableHours: [],
      selectedValue: '',
      searchCapacity: 0,
      searchText: '',
      searchEquipment: '',
      filteredItems: [],
      items: [],
      equipments: [],
      selectedEquipments: [],
    };
  },
  mounted() {
    axios
      .get('http://localhost:3000/rooms')
      // eslint-disable-next-line
      .then(response => {
        this.items = response.data.rooms;
        this.filteredItems = response.data.rooms;
        this.equipments = response.data.equipments;
        this.setBookableHours();
        this.getBookedHours().then((res) => {
          this.bookedHours = res;
        });
      });
  },
  methods: {
    filterItems() {
      return this.items.filter(item =>
        (JSON.parse(JSON.stringify(item.name)).toLowerCase()
          .indexOf(this.searchText.toLowerCase()) > -1) ||
        (JSON.parse(JSON.stringify(item.description)).toLowerCase()
          .indexOf(this.searchText.toLowerCase()) > -1))
        .filter(item => item.capacity >= this.searchCapacity)
        .filter(item => !this.selectedEquipments.length ||
          JSON.parse(
            JSON.stringify(item.equipements),
          ).filter(value =>
            this.selectedEquipments.indexOf(value.name) > -1).length > 0);
    },
    book(id, start) {
      if (this.bookedHours[id].includes(new Date(start).toJSON())) return;
      const bookedHours = {
        startDate: new Date(start.getFullYear(), start.getMonth(),
          start.getDate(), start.getHours(), start.getMinutes()),
        endDate: new Date(start.getFullYear(), start.getMonth(),
          start.getDate(), start.getHours(), start.getMinutes() + 30),
      };

      axios
        .post(`http://localhost:3000/rooms/${id}/book`, bookedHours).then(() => {
          this.getBookedHours().then((res) => {
            this.bookedHours = res;
          });
        });
    },
    setBookableHours() {
      this.bookableHours = [];
      for (let i = 10; i < 23; i += 1) {
        for (let j = 0; j < 2; j += 1) {
          this.bookableHours.push(new Date(this.selectedDate.setHours(i, (j === 0 ? '00' : 30 * j), 0, 0)));
        }
      }
    },
    getBookedHours() {
      return axios
        .get(`http://localhost:3000/reservations/${new Date(this.selectedDate)}`)
        .then(res => res.data.bookedHours);
    },
    chooseEquipments(equipment) {
      const indexOf = this.selectedEquipments.indexOf(equipment);
      if (indexOf === -1) {
        this.selectedEquipments.push(equipment);
      } else {
        this.selectedEquipments.splice(indexOf, indexOf + 1);
      }

      this.filteredItems = this.filterItems();
    },
    displayDate(date) {
      return `${moment(date).subtract(2, 'h').format('HH:mm')} - ${moment(date).add(30, 'm').subtract(2, 'h').format('HH:mm')}`;
    },
  },
  watch: {
    selectedDate() {
      this.setBookableHours();
      this.getBookedHours().then((res) => {
        this.bookedHours = res;
      });
    },
    searchText() {
      this.filteredItems = this.filterItems();
    },
    searchCapacity() {
      this.filteredItems = this.filterItems();
    },
  },
};
</script>

<style scoped>
  * { color: #212224; }
  .selected {
    background-color: rgba(218, 194, 41, 0.2);
  }
  label {
    display: block;
    width: 200px;
    height: 60px;
    margin: 0 20px;
    float:left;
  }
  label span {
    float: left;
    margin-bottom: 5px;
  }
  label input {
    float:left;
  }
  .second-filters .icon:hover {
    cursor: pointer;
    border-color: black;
  }
  .equipment-icon .users {
    float: left;
    margin: 15px 0 0 20px;
  }
  .capacity span {
    font-size:16px;
  }
  .picture span {
    position: relative;
    top: -50px;
    font-size: 30px;
    font-weight: 600;
    float: left;
    display: inline-block;
    margin-left: 20px;
    color: white;
    text-shadow: black 0 0 10px;
  }
  .date-filter {
    position: absolute;
    width: auto;
    left: 700px;
  }
  .date-filter label {
    width: 150px;
  }
  .second-filters {
    position: absolute;
    width: auto;
    top: 90px;
  }
  .second-filters .icon span {
    margin: 10px 30px 0 0;
  }
  .second-filters label {
    width: auto;
  }
  .second-filters label span {
    margin-top: 8px;
  }
  .first-filters {
    position: absolute;
    width: 480px;
  }
  .inside-filters {
    margin: 15px 0;
  }
  .container-icon {
    position: relative;
    width: auto;
    margin-left: 100px;
    height: 40px;
  }
  .filters .icon {
    width: auto;
    float: left;
    margin-left: 30px;
  }
  .icon {
    width: 50px;
    height: 40px;
    float: left;
    margin: 0 10px;
    border: 1px solid #E0E0E0;
    border-radius: 10px;
  }
  .equipment-icon {
    width: 40px;
    height: 40px;
    float: left;
    margin: 0 10px 0 30px;
  }
  .primary-infos {
    position: relative;
  }
  .capacity {
    position: absolute;
    width: 150px;
    height: 100%;
  }
  .equipments {
    width: 150px;
    height: 100%;
    position: absolute;
    left: 160px;
  }
  .equipments .equipement {
    width: 40px;
    height: 40px;
    float: left;
    margin: 15px 5px;
  }
  #room-list {
    font-weight: normal;
  }
  .rooms {
    width: 980px;
    margin: auto;
    padding-top: 180px;
  }
  .rooms .room {
    width: 450px;
    height: 400px;
    float: left;
    margin: 10px 20px;
    border-radius: 2px;
    background-color: white;
    box-shadow: 0 2px 13px 0 rgba(0, 0, 0, 0.07);
  }
  .rooms .room .picture {
    width: 100%;
    height: 65%;
  }
  img {
    width: 100%;
    height: 100%;
  }
  .rooms .room .infos {
    width: 100%;
    height: 35%;
  }
  .rooms .room .infos .primary-infos {
    width: 100%;
    height: 65px;
  }
  .rooms .room .infos .hours {
    width: calc(100% - 20px);
    height: 65px;
    padding: 5px 10px 0;
  }
  .rooms .room .infos .hours .hour {
    cursor: pointer;
    width: calc((100% - 52px) / 26);
    height: 60px;
    display: block;
    float: left;
    border: 1px solid #BBB;
  }
  .rooms .room .infos .hours .hour.booked:hover {
    border: 1px solid #777;
  }
  .rooms .room .infos .hours .hour:not(.booked):hover {
    background-color: rgba(218, 194, 41, 0.5);
    border: 1px solid #DAC229;
  }
  .rooms .room .infos .hours .hour:not(.booked):hover:before {
    content: '+';
    display: inline-block;
    width: 16px;
    height: 62px;
    text-align: center;
    color: #DAC229;
    position: relative;
    top: 18px;
  }
  .filters {
    width: 100%;
    height: 150px;
    background-color: white;
    box-shadow: rgba(0, 0, 0, 0.13) 0 2px 15px 0;
    position: absolute;
  }
  .booked {
    background: repeating-linear-gradient(
      45deg,
      #EBEBEB,
      #EBEBEB 1px,
      #F0F0F0 1px,
      #F0F0F0 4px
    );
  }
  .input-field {
    position: relative;
    padding: 5px 0;
  }

  .input-field::before, .input-field::after {
    content: ' ';
    position: absolute;
    bottom: 0;
    border-bottom: 2px #EE5757 solid;
    transition: .3s;
  }

  .input-field::after {
    left: 50%;
    right: 50%;
    border-bottom: 2px #0d3349 solid;
  }

  .input-field::before, .input-field:focus::after {
    left: 0;
    right: 0;
  }

  input[type='text'],
  input[type='number'],
  input[type='text'][readonly='readonly'] {
    border: 1px solid #E0E0E0;
    outline: 0;
    background-color: white;
    font-family: 'San Francisco', 'Segoe UI', 'Roboto', sans-serif;
    width: 200px;
    color: #000;
    height: 20px;
    font-size: 18px;
    padding-left: 5px;
  }

  input[type='text']:hover,
  input[type='number']:hover,
  input[type='text'][readonly='readonly']:hover {
    border-color: black;
  }

  input[type='text']::placeholder,
  input[type='number']::placeholder,
  input[type='text'][readonly='readonly']::placeholder {
    color: #E0E0E0;
    font-size: 16px;
  }

  .date-filter >>> .vdp-datepicker input[type='text'] {
    width: 200px;
    height: 30px;
    padding-left: 5px;
    margin-left: -5px;
    font-size: 15px;
  }

  .date-filter >>> .vdp-datepicker__calendar {
    margin-left: -5px;
  }

  .date-filter >>> .vdp-datepicker__calendar .cell.selected {
    background: rgba(218, 194, 41, 0.5) !important;
  }

  .date-filter >>> .vdp-datepicker__calendar .cell:not(.blank):not(.disabled).day:hover,
  .date-filter >>> .vdp-datepicker__calendar .cell:not(.blank):not(.disabled).month:hover,
  .date-filter >>> .vdp-datepicker__calendar .cell:not(.blank):not(.disabled).year:hover {
    border: 1px solid #DAC229 !important;
  }
</style>
