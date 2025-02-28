import Api from './api'
import store from '../store'

export default {
  getEventInstancesByChurch (churchUsername = store.state.churchUsername) {
    return Api().get('eventinstances',
      {
        params: {
          churchUsername: `${churchUsername}`,
          pagesize: 50,
          page: 0
        }
      }).then((response) => {
      return response.data
    }).catch((e) => {
      return e
    })
  },
  getEventInstancesByBase (baseID) {
    return Api().get('eventinstances',
      {
        params: {
          eventBaseID: `${baseID}`
        }
      }).then((response) => {
      return response.data
    }).catch((e) => {
      return e
    })
  },
  getEventBasesByChurch (churchUsername = store.state.churchUsername) {
    return Api().get('eventbases',
      {
        params: {
          churchUsername: `${churchUsername}`,
          pagesize: 50,
          page: 0
        }
      }).then((response) => {
      return response.data
    }).catch((e) => {
      return e
    })
  },
  getEventInstance (instanceID) {
    return Api().get('eventinstances',
      {
        params: {
          id: `${instanceID}`
        }
      }).then((response) => {
      return response.data
    }).catch((e) => {
      return e
    })
  },
  postEventBase (baseInfo) {
    return Api().post('eventbases', baseInfo).then((response) => {
      return response.data
    }).catch((e) => {
      console.error(e)
    })
  },
  postEventInstance (instanceInfo) {
    return Api().post('eventinstances', instanceInfo)
  },  
  addComponentToBase (baseID, componentData) {
    return Api().patch('eventbases',
      {
        "identifier":{
          "id": `${baseID}`
        },
        "values":{
          "componentsAdd": [componentData]
        }
    })
  },
  addComponentToInstance (instanceID, componentData) {
    return Api().patch('eventinstances',
      {
        "identifier":{
          "id": `${instanceID}`
        },
        "values":{
          "instanceOverridesAdd": [componentData]
        }
    })
  },
  deleteEventBase (baseID) {
    return Api().delete('eventbases',
    {data: {
      "elements": [
        {
          "id": `${baseID}`
        }
      ]
    }})
  }
}
