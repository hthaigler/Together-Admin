<template>
  <div id="this-sunday-container">
    <sweet-modal icon="warning" ref="deleteItemModal">
      <h3>Are you sure you want to delete {{selectedService.title}}?</h3>
      <button slot="button" class="gs-basic-button red" @click="deleteItem">DELETE</button>
    </sweet-modal>
    <sweet-modal icon="success" ref="itemCreated">
      <h3>{{newService.title}} created!!</h3>
    </sweet-modal>
    <sweet-modal icon="success" ref="itemEdited">
      <h3>{{newService.title}} edited!!</h3>
    </sweet-modal>
    <div class="page-wrapper">
      <div class="page-card-wrapper">
        <cards
          v-model="selectedID"
          :loading="loading"
          :noProfile="true"
          :cardList="services"
          :profilePicFillerValue="'name'"
          :emptyMessage="'No Events Scheduled Yet'"
          :hasDates="true"
          :fields="{
              title: 'dateTitle',
              id: 'id',
              subtitle: 'title'
            }"
          :hasAddNew="true"
          :returnObject="true"
          @selected="recieveItem"
          @onAddNew="createNewItem"
        />
      </div>
      <div class="gs-app-selected-view" id="selected-view">
        <div class="details" v-if="selectedID != -1 && !creatingNewItem">
          <div class="panel gs-card-with-shadow gs-container vertical gs-card-rise">
            <div class="quick-actions">
              <!-- <button class="basic-button"><i class="material-icons">send</i></button> -->
            </div>
              <div class="gs-buttons-right">
                <button class="gs-basic-button" @click="startEdit" v-show="!editing">
                  <i class="material-icons">edit</i>EDIT
                </button>
                <button class="gs-basic-button red" 
                  @click="deleteButtonClicked"
                  v-show="!editing"
                ><i class="material-icons">delete</i>DELETE</button>
                <button class="gs-basic-button red" @click="cancelEdit" v-show="editing">
                  <i class="material-icons">close</i>CANCEL
                </button>
                <button class="gs-basic-button" @click="saveEdit" v-show="editing">
                  <i class="material-icons">done</i>SAVE
                </button>
              </div>
              <div class="image-croppa">
                <croppa
                  v-model="photoCroppa"
                  canvas-color="transparent"
                  :disable-rotation="true"
                  :prevent-white-space="true"
                  :width="250"
                  :height="250"
                  :speed="10"
                  v-show="editing"
                ></croppa>
                <img
                  :src="selectedService.iconURL"
                  alt
                  srcset
                  class="this-sunday-image"
                  v-show="!editing"
                />
              </div>
              <form action class id="this-sunday-form">
                <div class="gs-form-group">
                  <label for>Title</label>
                  <input
                    type="text"
                    class="gs-basic-input large"
                    placeholder="Add a title"
                    required
                    v-model="selectedService.title"
                    :readonly="!editing"
                  />
                </div>

                <div class="gs-form-group">
                  <label for>Date</label>
                  <flat-pickr
                    class="gs-basic-input"
                    :config="datePickerConfig"
                    :disabled='!editing'
                    v-model="selectedService.date"
                  ></flat-pickr>
                </div>

                <div class="gs-form-group">
                  <label for>Times</label>
                  <div class="times">
                    <input v-for="time in selectedService.times" v-model="time.time" :key="time.id" type="time" class="gs-basic-input time"
                          placeholder="Time" required :readonly="!editing">
                    <div class="gs-basic-button icon" formnovalidate v-show="editing"><i class="material-icons">add</i></div>
                  </div>
                </div>
                <div class="gs-form-group">
                  <label for="">Speaker</label>
                  <div class="guest-speaker-checkbox" v-show="editing">
                    <p-check class="p-default p-round p-smooth" color="primary"
                      v-model="hasGuestSpeaker"
                    >
                      Guest Speaker                      
                    </p-check>
                  </div>
                  <div v-show="!hasGuestSpeaker">
                    <dropdown
                      :inputCSSClass="'gs-basic-input'"
                      :items="people"
                      :readonly="!editing"
                      :fields="{
                        title: 'fullName',
                        id: 'id', 
                        profile: 'personImageThumbnailURL'
                      }"                   
                      :selectedItem="selectedService.person"
                      @selected="onSpeakerSelected"
                    />
                  </div>
                  <div v-show="hasGuestSpeaker">
                    <input type="text" class="gs-basic-input" placeholder="Input Speaker's Name" required
                      v-model="selectedService.speakerName"
                      :readonly="!editing">
                  </div>
                </div>
                <div class="gs-form-group">
                  <label for>Description</label>
                  <textarea
                    type="text"
                    class="gs-basic-input"
                    placeholder="Add Description"
                    rows="10"
                    required
                    v-model="selectedService.description"
                    :readonly="!editing"
                  ></textarea>
                </div>
              </form>              
              <div class="gs-buttons-right">         
              <button class="gs-basic-button red"
                @click="cancelEdit"
                v-show="editing"
              ><i class="material-icons">close</i>CANCEL</button>
              <button class="gs-basic-button"
                @click="saveEdit"
                v-show="editing"
              ><i class="material-icons">done</i>SAVE</button>
              </div>
          </div>
        </div>
        <div class="details" v-if="creatingNewItem">
          <div class="panel gs-card-with-shadow gs-card-rise">
            <h5>Create New Service</h5>
            <div class="image-croppa">
              <croppa
                v-model="photoCroppa"
                canvas-color="transparent"
                :disable-rotation="true"
                :prevent-white-space="true"
                :width="250"
                :height="250"
                :speed="10"
              ></croppa>
            </div>
            <form action class id="this-sunday-form" @submit.prevent="createService">
              <div class="gs-form-group">
                <label for>Title</label>
                <input
                  type="text"
                  class="gs-basic-input large"
                  placeholder="Add a title"
                  required
                  v-model="newService.title"
                />
              </div>
              <div class="gs-form-group">
                <label for>Date</label>
                <flat-pickr
                  class="gs-basic-input"
                  :config="datePickerConfig"
                  v-model="newService.date"
                ></flat-pickr>
              </div>
              <div class="gs-form-group">
                <label for>Times</label>
                <div class="times">
                  <div v-for="(time, index) in newService.serviceTimes" :key="index" class="time">
                    <div class="delete-time noselect" @click="deleteTimeFromNewService(index)">
                      <i class="material-icons">close</i>
                    </div>
                    <input
                      v-model="time.time"
                      type="time"
                      class="gs-basic-input time"
                      placeholder="Time"
                      required
                    />
                  </div>
                  <div class="gs-basic-button icon" formnovalidate @click="addTimeToNewService">
                    <i class="material-icons">add</i>
                  </div>
                </div>
              </div>
              <div class="gs-form-group">
                <label for="">Speaker</label>                
                <div class="guest-speaker-checkbox">
                  <p-check class="p-default p-round p-smooth" color="primary"
                    v-model="hasGuestSpeaker"
                  >
                    Guest Speaker
                  </p-check>
                </div>
                <div v-show="!hasGuestSpeaker">
                  <dropdown
                    :inputCSSClass="'gs-basic-input'"
                    :items="people"
                    :fields="{
                      title: 'fullName',
                      id: 'id', 
                      profile: 'personImageThumbnailURL'
                    }"                   
                    :selectedItem="newServicePerson"
                    @selected="onSpeakerSelectedNewService"
                  />
                </div>
                <div v-if="hasGuestSpeaker">
                  <input type="text" class="gs-basic-input" placeholder="Input Speaker's Name" required
                    v-model="newService.speakerName">
                </div>
                <!-- <input type="text" class="gs-basic-input" placeholder="Add Speaker" required
                  v-model="newService.speakerName"> -->
              </div>
              <div class="gs-form-group">
                <label for>Description</label>
                <textarea
                  type="text"
                  class="gs-basic-input"
                  placeholder="Add Description"
                  rows="10"
                  required
                  v-model="newService.description"
                ></textarea>
              </div>
              <button class="gs-basic-button">CREATE</button>
            </form>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import moment from 'moment'
import Croppa from 'vue-croppa'
import 'vue-croppa/dist/vue-croppa.css'
import CDN from '@/services/cdn'
import { checkIfObjNotFilled, generateGUID, getYYYYMMDD } from '../utils/helpers'
import { SweetModal } from 'sweet-modal-vue'
import flatPickr from 'vue-flatpickr-component'
import 'flatpickr/dist/flatpickr.css'

import Services from '@/services/services'
import People from '@/services/people'
import { getHHMM, getDayOfWeekMonthDay, getThisSunday } from '../utils/helpers'

import Cards from '@/components/CardList'
import Dropdown from '@/components/CardDropdown'

import { mapActions, mapMutations, mapGetters, mapState } from 'vuex';

import Vue from 'vue'
Vue.use(Croppa)

const newServiceTemplate = {
  churchUsername: "",
  title: "",
  iconURL: "",
  date: getThisSunday(),
  speakerID: null,
  speakerName: "",
  description: "",
  serviceTimes: [
    {
      time: ""
    }
  ]
};

export default {
  name: "ThisSunday",
  data() {
    return {
      selectedID: -1,
      selectedService: {},
      beforeEditedService: {},
      cdnKeys: {},
      photoCroppa: {},
      cdnKeys: {},
      date: moment().format(),
      datePickerConfig: {
        allowInput: true,
        altInput: true
      },
      editing: false,
      hasGuestSpeaker: false,
      newServicePerson: undefined
    }
  },
  computed: {
    ...mapState('thisSunday', ['services', 'loading', 'creatingNewItem', 'newService']),
    ...mapState('people', ['people']),
  },
  components: {    
    flatPickr, Cards, SweetModal, Dropdown
  },
  methods: {
    ...mapMutations('thisSunday', [
      'setServices',
      'setLoading',
      'setCreatingNewItem',
      'setNewService',
      'addTimeToNewService',
      'deleteTimeFromNewService'
    ]),
    ...mapActions('thisSunday', ['getServices']),
    ...mapActions('people', ['getPeople']),

    async createNewItem() {
      this.selectedID = -1;
      this.$router.push('/app/this-sunday/');

      this.setCreatingNewItem(true);
      this.setNewService({ ...newServiceTemplate })
      if (this.creatingNewItem) {
        const cdnKeys = await CDN.getKeys();
        this.cdnKeys = cdnKeys.data;
      }
    },
    recieveItem(item) {
      this.recieveID(item.id);
      this.selectedService = item;
      this.selectedService.date = moment(item.date, 'YYYY-MM-DD').format();
      if (this.selectedService.speakerName) {
        this.hasGuestSpeaker = true
      }
      else {
        this.hasGuestSpeaker = false
      }
    },
    async recieveID(id) {
      if (!id) {
        return;
      }
      if (id == "-1") {
        this.selectedID = id;
        this.$router.push(`/app/this-sunday/`);
        return;
      }

      this.$router.push(`/app/this-sunday/${id}`);

      this.setCreatingNewItem(false);

      this.selectedID = id;
    },
    onSpeakerSelected(person) {
      this.selectedService.person = person
    },
    onSpeakerSelectedNewService(person) {
      this.newService.speakerID = person.id
      this.newServicePerson = person
    },
    async uploadImage() {
      const { accessKeyID, secretAccessKey } = this.cdnKeys;
      var fileName = generateGUID() + ".jpg";

      if (!this.photoCroppa.hasImage()) {
        return;
      }
      var blob = await this.photoCroppa.promisedBlob("image/jpeg");

      var arrayBuffer = await new Response(blob).arrayBuffer();
      await CDN.postImage(
        accessKeyID,
        secretAccessKey,
        arrayBuffer,
        fileName
      ).catch(() => {
        fileName = "";
      });

      return fileName;
    },
    async deleteItem() {
      this.$refs.deleteItemModal.close();
      Services.deleteService(this.selectedID).then(
        function(response) {
          this.recieveID(-1);
          this.getServices();
        }.bind(this)
      );
    },
    
    deleteButtonClicked() {
      this.$refs.deleteItemModal.open();
    },
    async createService() {
      this.postService(this.newService);
    },
    async editService() {
      this.selectedService.times = this.selectedService.times.map((timeObj) => {return {time: timeObj.time.substring(0,5)}})
      if (this.hasGuestSpeaker) {
        this.patchService(this.selectedService, false)
      }
      else {        
        this.selectedService['speakerID'] = this.selectedService.person.id
        this.selectedService.speakerName = ''
        this.patchService(this.selectedService, true)
      }
    },
    async postService(service) {
      this.$root.$emit("loading", true);
      const serviceToPost = await this.getFormattedService(service);

      let postServiceRes;

      if (this.hasGuestSpeaker) {
        this.newService.speakerID = null
      }
      else {
        this.newService.speakerName = null
      }
      try {
        postServiceRes = await Services.postService(serviceToPost)

        this.$refs.itemCreated.open();
      }
      catch(error) {
        return;
      }
      finally {
        await this.getServices()
        if(postServiceRes) {
          service.id = postServiceRes.data.newResourceID;
          this.recieveItem(service);
        }
        this.$root.$emit("loading", false);
      }
    },
    async patchService(service, hasSpeakerID) {
      this.$root.$emit("loading", true);
      const serviceToPatch = await this.getFormattedService(service);
      try {
        if (hasSpeakerID) {
          await Services.patchServiceWithSpeakerID(serviceToPatch.id, serviceToPatch);
        }
        else {
          await Services.patchService(serviceToPatch.id, serviceToPatch);
        }
        this.$refs.itemEdited.open();
      }
      catch(error) {
        return;
      }
      finally {
        await this.getServices()
        this.$root.$emit("loading", false);
      }
    },
    async getFormattedService(service) {
      let profilePic = await this.uploadProfilePic();
      profilePic = profilePic
        ? "https://togethercdn.global.ssl.fastly.net/EventPics/" + profilePic
        : "";
      const formattedService = { ...service };
      formattedService .churchUsername = this.$store.state.churchUsername;
      formattedService .date = moment(formattedService .date).format('YYYY-MM-DD');
      formattedService .iconURL = profilePic;
      return formattedService;
    },
    async uploadProfilePic() {
      const { accessKeyID, secretAccessKey } = this.cdnKeys;
      const fileSufix = "EventPics/";
      var fileName = generateGUID() + ".jpg";

      if (!this.photoCroppa.hasImage()) {
        return;
      }
      var blob = await this.photoCroppa.promisedBlob("image/jpeg");
      var arrayBuffer = await new Response(blob).arrayBuffer();
      await CDN.postImage(
        accessKeyID,
        secretAccessKey,
        arrayBuffer,
        fileSufix,
        fileName
      ).catch(() => {
        fileName = "";
      });

      return fileName;
    },
    startEdit() {
      this.editing = true;
      this.beforeEditedService = { ...this.selectedService };
    },
    cancelEdit() {
      this.editing = false;
      this.selectedService = { ...this.beforeEditedService };
    },
    saveEdit() {
      this.editing = false;
      this.editService();
    }
  },
  props: {},
  async mounted() {
    if(this.services.length < 1) {
      await this.getServices();
    } 
    else {
      this.setLoading(false);
    }
    await this.getPeople(true);
    if(this.$route.params.id) {
      const selectedService = this.services.find(service => service.id.toString() === this.$route.params.id);
      this.recieveItem(selectedService);
    }
  },
};
</script>

<style src="./../assets/css/general-style.css"></style> 

<style scoped>
.edit {
  align-self: flex-end;
  margin-bottom: 10px;
}
.edit i {
  font-size: 0.7rem;
  margin-right: 0.3rem;
  vertical-align: center;
}
#this-sunday-container {
  height: 100%;
}
#this-sunday-container .dates {
}
#this-sunday-info {
  height: 100vh;
  padding: 50px 20px;
  overflow-y: auto;
  box-sizing: border-box;
}
.this-sunday-image {
  width: 250px;
  height: 250px;
  background: #c4c4c4;
  display: block;
}
#this-sunday-form {
  margin-top: 25px;
  /* max-width: 600px; */
}
#this-sunday-form .times {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
}
#this-sunday-form .times .time {
  position: relative;
}
#this-sunday-form .times .delete-time {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 22.5px;
  width: 22.5px;
  border-radius: 30px;
  position: absolute;
  z-index: 100;
  top: -10px;
  right: 0px;
  background: white;
  border: 1px grey solid;
  cursor: pointer;
}
#this-sunday-form .times .delete-time i {
  font-size: 12.5px;
}
#this-sunday-form .times input {
  margin-right: 10px;
}
#this-sunday-form .times .gs-basic-button {
  margin-bottom: 5px;
}
.guest-speaker-checkbox{
  margin: .5rem 0px;
}
.guest-speaker-checkbox >>> .p-primary label::before,
.guest-speaker-checkbox >>> .p-primary label::after{
  margin-top: 2px;
}

/* //////////////////////////
//////  MEDIA QUERIES ///////
////////////////////////// */

/*------------------------------------------
  Responsive Grid Media Queries - 1280, 1024, 768, 480
   1280-1024   - desktop (default grid)
   1024-768    - tablet landscape
   768-480     - tablet 
   480-less    - phone landscape & smaller
--------------------------------------------*/
@media all and (min-width: 1024px) and (max-width: 1280px) {
}

@media all and (min-width: 768px) and (max-width: 1024px) {
}

@media all and (min-width: 480px) and (max-width: 768px) {
}

@media all and (max-width: 480px) {
}
</style>