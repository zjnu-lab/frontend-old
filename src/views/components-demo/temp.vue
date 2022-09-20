<template>
 <div class = "components-container graph">
     <router-view></router-view>
 </div>
    
  
</template>


<script>

import D3Network from 'vue-d3-network'
import axios from 'axios'


export default {
  name: 'Temp',
  components: { D3Network},
data () {
    
  },
  


}

</script>
<style src="vue-d3-network/dist/vue-d3-network.css"></style>


<style  scoped>
@import url('https://fonts.googleapis.com/css?family=PT+Sans');

.graph{
  font-family: 'PT Sans', sans-serif;
  background-color: #eee;

}
.title{
  position:absolute;
  text-align: center;
  left: 2em;
}
h1,a{
  color: #1aad8d;
  text-decoration: none;
}

ul.menu {
  list-style: none;
  position: absolute;
  z-index: 100;
  min-width: 20em;
  text-align: left;
}
ul.menu li{
  margin-top: 1em;
  position: relative;
}

#m-end path, #m-start,#m-mid{
  fill: rgba(18, 120, 98, 0.8);
}

</style>

