<template>

  <div class="column gutter-sm">

    <q-btn-group>
      <q-btn label="Create block" @click="notifyBlockRequested()">
        <q-tooltip>
          Create and add the block top the library (right click)
        </q-tooltip>
      </q-btn>


    </q-btn-group>
  <q-select
          name="collectionSelector"
          v-model="selectedEntity"
          :options.sync="availableEntities"
          @input="entityChanged"
          filled
          separator
          stack-label
          label="Select an entity"
  />
    <q-table
            title="Properties of the entity"
            :data="entityModel.children"
            :columns="columns"
            row-key="name"
    />


  </div>
</template>

<script>
export default {
  // name: 'ComponentName',
  data () {
    return {
      availableEntities :[],
      selectedEntity:null,
      entityModel:{children:[]},
    columns: [
      {
        name: 'Property',
        required: true,
        label: 'Property',
        align: 'left',
        field: 'label',
        sortable: true,
        style: 'font-size: 10px'
      },      {
        name: 'Type',
        required: true,
        label: 'Type',
        align: 'left',
        field: 'type',
        sortable: true,
        style: 'font-size: 8px'
      }
            ]

    }

  },
  methods:{


    getEntities() {
      this.$axios.post('/v1/resources/vppBackendServices?rs:action=DHFEntities')
              .then((response) => {
                this.availableEntities = response.data
              })
              .catch(() => {
                this.$q.notify({
                  color: 'negative',
                  position: 'top',
                  message: 'Loading entities failed',
                  icon: 'report_problem'
                })
              })
    },
    entityChanged(){
      this.$axios.post('/v1/resources/vppBackendServices?rs:action=DHFEntityProperties&rs:entity=' +  this.selectedEntity.value)
              .then((response) => {
                this.entityModel = response.data






              })
             /* .catch(() => {
                this.$q.notify({
                  color: 'negative',
                  position: 'top',
                  message: 'Entity Block creation failed',
                  icon: 'report_problem'
                })
              })*/

    },


      notifyBlockRequested() {

          let entity = this.availableEntities.filter(item => { return item.value == this.selectedEntity.value })[0]

          let blockDef = {

              label: entity.label,
              collection: entity.label,
              source:"Entities",
              fields : this.entityModel.children.map(item => { return  {
                  "label" : item.label,
                  "field" : item.label,
                  "path":  "//"  + item.label
                }
              }),
              options : ["fieldsInputs","nodeOutput"]

          }
          this.$root.$emit("blockRequested",blockDef);
      },
      saveBlock() {

          let entity = this.availableEntities.filter(item => { return item.value == this.selectedEntity.value })[0]

          let blockDef = {

              label: entity.label,
              collection:  entity.label,
              source:"Entities",
              fields : this.entityModel.children.map(item => { return item.label}),
              options : ["fieldsInputs","nodeOutput"]

          }

          this.$axios.put('/v1/resources/savedBlock',blockDef)
              .then((response) => {
                  this.savedGraph = response.data
              })
              .catch(() => {
                  this.$q.notify({
                      color: 'negative',
                      position: 'top',
                      message: 'Loading failed',
                      icon: 'report_problem'
                  })
              })
      }
  },
  mounted() {
    console.log('Nothing gets called before me!')
    this.getEntities();
  }
}
</script>

<style>
</style>
