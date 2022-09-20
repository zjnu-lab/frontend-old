<template>
 <div class = "components-container ">
<el-row>
  <el-col :span="12">
<el-card class="box-card">
  <div slot="header" class="clearfix">
    <span>节点信息</span>
  </div>
  <div style="height:200px;">
    <ul>
        <li>{{nodeid}}</li>
        <li>{{nodename}}</li>
        <li>{{nodetype}}</li>
        <li v-for="value,key in nodemsg">
               {{ key }}:{{value}}
      </li>
    </ul>
    <el-button @click="show2nodes">显示二度节点</el-button>

 
    <!-- example control -->  
   
    </div>
</el-card>

  </el-col>

  <el-col span="12">

    <el-card class="box-card">
  <div slot="header" class="clearfix">
    <span>选中的节点</span>
  </div>
  <div  style="height:200px;">
         <div  >
      <el-button @click="nodeShowMore">详情</el-button>
      <ul>
          <li>
      <a>节点id:{{tempnodeid}}</a>
      </li>
        <li>
      <a>节点类别:{{tempnodetype}}</a>
      </li>
      <li>
      <a>节点名字:{{tempnodename}}</a>
      </li>
        
      </ul>
      </div>
      <div  v-if  = "showlinkinfo">
     <h2><a>关系信息</a></h2>
      <ul>
          <li>
      <a>关系id:{{linkid}}</a>
      </li>
      <li>
      <a>关系名字:{{linkname}}</a>
      </li>
      </ul>
      </div>
  </div>
    </el-card>
    </el-col>
</el-row>
<el-card class="box-card">
  <div slot="header" class="clearfix">
    <span>图谱展示</span>
  </div>
    <div class = 'graph'>
    <svg >
  <defs>
    <marker id="m-end" markerWidth="20" markerHeight="20" refX="50" refY="6" orient="auto" markerUnits="strokeWidth" >
      <path d="M2,2 L10,6 L2,10 L6,6 L2,2"></path>
      
    </marker>
        <marker id="m-start" markerWidth="6" markerHeight="6" refX="-4" refY="3" orient="auto" markerUnits="strokeWidth" >
      <rect width="3" height="6"></rect>
    </marker>
  </defs>
</svg>
    <!--<d3-network ref='net' :net-nodes="nodes" :net-links="links" :options="options"  :link-cb="lcb"/>-->
    <d3-network ref='net' :net-nodes="nodes" :net-links="links" :options="options"  :link-cb="lcb" @node-click="clicknode" @link-click= "clicklink"/>
  </div>
</el-card>


  
 </div>
  
</template>


<script>

import D3Network from 'vue-d3-network'
import axios from 'axios'


export default {
  name: 'Node',
  components: { D3Network},
data () {
    return {
   
      nodes: [
        
      ],
      links: [

      ],
      nodeSize:45,
      canvas:false,
     nodename:'dd',
     nodeid:'节点id',
     nodetype:'dd',
     tempnodename:'dd',
     tempnodeid:'节点id',
     tempnodetype:'dd',
     nodemsg:{},
     linkid:'关系id',
     linkname:'关系名字',
     shownodeinfo:undefined,
     showlinkinfo: undefined,
     inputsearch:'',
     

    }
  },
  mounted(){
      //console.log(typeof this.$route.params.id);
      this.nodeid = this.$route.params.id;
      var searchstr = 'match (n) where id(n) = '+this.$route.params.id+ ' return n';
      //console.log(searchstr)
  axios
        .get('http://127.0.0.1:5000/search/'+searchstr)
        .then(response => {
            console.log(response);
          this.nodes = response['data']['nodes'];
          this.links = response['data']['links'];
          //console.log(this.nodes[0].name);
          this.nodename = this.nodes[0].name;
          console.log(this.nodes[0].label)
          this.nodetype = this.nodes[0].label[0];
          this.nodemsg = this.nodes[0].props;
          
        })

  },
  computed:{
    options(){
      return{
        force: 6000,
        size:{ w:1920, h:1080},
        nodeSize: this.nodeSize,
        nodeLabels: true,
        linkLabels:true,
        linkWidth:2,
        canvas: this.canvas
      }
    }
  },

  methods:{
    lcb (link) {
      link._svgAttrs = { 'marker-end': 'url(#m-end)',
                      }
      return link
    },
    nodeShowMore(){
      this.$router.push({name:'node',params:{id:this.tempnodeid}})
    },
    show2nodes(){
      console.log('展示二度节点') ;
      var searchstr =' MATCH p=(n)-[r]->(b)-[m]->(c) where id(n)='+this.nodeid + ' RETURN p LIMIT 50';
       axios
        .get('http://127.0.0.1:5000/search/'+searchstr)
        .then(response => {
            console.log(response);
           if ( response['data']['nodes'].length > 0) 
                this.nodes = response['data']['nodes'];
          this.links = response['data']['links'];
          this.nodes[0]._color = 'orange';
          //console.log(this.nodes[0].name);
          //this.nodename = this.nodes[0].name;
          //console.log(this.nodes[0].label)
          //this.nodetype = this.nodes[0].label[0];
          
        })
    },

   
    clicknode(event,node){
        
        this.shownodeinfo = 'True',
        this.showlinkinfo = undefined,
        this.tempnodename = node.name,
        this.tempnodeid = node.id,
        this.tempnodemsg = node.props,
        this.tempnodetype = node.label
        

    },
    clicklink(event,link){
        this.showlinkinfo = 'True',
        this.shownodeinfo = undefined,
        this.linkid = link.id,
        this.linkname = link.name
    },
    clicksearch(event){
      console.log(this.inputsearch)
      axios
        .get('http://127.0.0.1:5000/search/'+this.inputsearch)
        .then(response => {
          console.log(response);
          this.nodes = response['data']['nodes'];
          this.links = response['data']['links']
        })
    }
  }
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

