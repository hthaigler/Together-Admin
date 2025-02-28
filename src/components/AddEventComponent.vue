<template>
  <div class="add-event-component-container">    
    <sweet-modal icon="success" ref="componentAdded">
      <h3>{{selectedTypeObject.title}} component added!</h3>
    </sweet-modal>
    <div class="component-type-wrapper">
      <custom-radio class="toggle" v-model="forEventBase" :options="['For This Event', 'For All Instances of This Event']"></custom-radio>
      <div class="component-types">
        <div class="component-type noselect" tabindex="0" v-for="cType in cTypes" :key="cType.type"
          @click="selectType(cType)"
          :class="{selected: selectedType == cType.type}"
        >
          {{ cType.title }}
        </div>
      </div>
      <div class="type-title">{{selectedTypeObject.title}}</div>
      <div class="description">{{!!selectedTypeObject.description ? selectedTypeObject.description : ''}}</div>
      <div class="buttons">
        <button class="basic-button red" @click="canceled()">CANCEL</button>
        <button class="basic-button green" @click="addComponent()">ADD</button>
      </div>
    </div>
  </div>
</template>

<script>
import CustomRadio from '@/components/CustomRadio'
import { orderOfEventComponentEmpty, speakerComponent, eventComponentHash } from '../utils/event-component-types'
import Events from '../services/events'
import { SweetModal } from 'sweet-modal-vue'
import { setTimeout } from 'timers';

export default {
  name: '',
  data () {
    return {
      description: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Nihil fugit blanditiis architecto, facilis autem accusantium odio distinctio in, ipsam labore placeat omnis consequatur adipisci est debitis provident mollitia sapiente necessitatibus eos accusamus maiores! Illum, neque nihil consectetur quibusdam numquam ab!',
      cTypes: [
        {
          title: 'Teams',
          type: 'TEAMS',
          description: '',
        }, 
        {
          title: 'Speaker',
          type: 'SPEAKER',
          template: speakerComponent,
          description: 'Select an account as the speaker. If they\'re not in the together system, no problem - put down their name!'
        }, 
        // {
        //   title: 'Contact',
        //   type: 'CONTACT'
        // },
        {
          title: 'Order of Event',
          type: 'ORDER',
          template: orderOfEventComponentEmpty,
          description: 'From setting up a small get together to setting up your entire sunday service, you can do that here. Options include song, text, and video for the order of your event.'
        },
        {
          title: 'Check In (coming soon)',
          type: 'CHECKIN'
        },
        {
          title: 'Video (coming soon)',
          type: 'VIDEO'
        },
        {
          title: 'Audio (coming soon)',
          type: 'AUDIO'
        },
        {
          title: 'Reminder (coming soon)',
          type: 'REMINDER'
        },
        {
          title: 'PDF (coming soon)',
          type: 'PDF'
        },
        {
          title: 'Text (coming soon)',
          type: 'TEXT'
        },
      ],
      selectedType: this.value,
      selectedTypeObject: {},
      forEventBase: 0
    }
  },
  components: {
    CustomRadio, SweetModal
  },
  methods: {
    async addComponent() {
      if (this.forEventBase == 0) {
        this.patchEventInstance(this.eventInstanceID)
      }
      else if (this.forEventBase == 1) {
        this.patchEventBase(this.eventBaseID)
      }
    },
    canceled() {
      this.$emit('canceled')
    },
    async patchEventBase(baseID) {
      var componentData = {}
      componentData = eventComponentHash[this.selectedTypeObject.type]
      if (componentData == undefined) return
      componentData.component.order = this.orderNumber
      componentData.component.isBase = true
      Events.addComponentToBase(baseID, componentData).then(response => {
        this.$refs.componentAdded.open()
        setTimeout(() => {
          this.$refs.componentAdded.close()
          setTimeout(() => {
            this.$emit('modalClosed')
          }, 25)
        }, 2000)
      })
    },
    async patchEventInstance(instanceID) {
      var componentData = {}
      componentData = eventComponentHash[this.selectedTypeObject.type]
      if (componentData == undefined) return
      componentData.component.order = this.orderNumber
      componentData.component.isBase = false
      Events.addComponentToInstance(instanceID, componentData).then(response => {
        this.$refs.componentAdded.open()
        this.$emit('componentAdded')
        setTimeout(() => {
          this.$refs.componentAdded.close()
          setTimeout(() => {
            this.$emit('modalClosed')
          }, 500)
        }, 2000)
      })
    },
    selectType(typeIn) {
      this.selectedType = typeIn.type
      this.selectedTypeObject = typeIn
    }
  },
  props: {
    eventInstanceID: {
      type: Number,
      default: null
    },
    orderNumber: {
      type: Number,
      default: 0
    },
    eventBaseID: {
      type: Number,
      default: null
    },
    value: {
      type: String,
      default: ''
    }
  },
  mounted() {
  },
  computed: {
  },
  watch: {
    selectedType(n) {
      this.$emit('input', n)
    } 
  },
}
</script>

<style scoped>

.toggle {
  margin-bottom: 20px
}

.component-types {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(5rem, 1fr));
  grid-auto-rows: 4rem;
  grid-gap: 20px;
  justify-content: center;
  padding-bottom: 15px;
}

.component-type {
  text-align: center;
  font-size: .75rem;
  display: flex;
  flex-direction: column;
  justify-content: center;
  cursor: pointer;
  border-radius: 4px;
  font-weight: 600;
  color: #5a5a5a;
  background-color: white;
  padding: 0px 5px;
  
  transition: color .5s ease, background-color .5s ease;
}

.component-type:focus,
.component-type:hover {
  outline: none;
  color: #55C0E4;
}

.component-type:active,
.component-type.selected {
  background-color: #55C0E4;
  color: white;
  transition: color .2s ease, background-color .75s ease-out;
}

.type-title {
  color: #616161;
  font-size: 1rem;
  font-weight: 600;
  margin-bottom: .2rem;
}
.description {
  color: #7e7e7e;
  font-size: .9rem;
  font-weight: 600;
  min-height: 100px;
  margin-bottom: 20px;
}

.buttons {
  display: flex;
  justify-content: space-between;
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