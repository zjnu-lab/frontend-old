<template>

 <div class = "components-container"  style="background-color:#eee">
    <el-row>
    <h1> <a>学科知识图谱</a> </h1>
    </el-row> 
    <el-row>
    <el-col :span="24">
        <el-input v-model="inputsearch" >
        <el-button  slot='append' icon="el-icon-search" @click="clicksearch"></el-button>
         
        </el-input>
       <el-button type="button" @click="dialogFormVisible = true">导入</el-button>
    </el-col>
        <el-dialog title="导入文件" :visible.sync="dialogFormVisible">
  <el-form :model="form">
    <el-form-item label="图谱名字" :label-width="formLabelWidth">
      <el-input v-model="form.name" autocomplete="off"></el-input>
    </el-form-item>
          <el-form-item label="选择文件" label-width="120px">
            <el-upload
              class
              :headers="headers"
              ref="upload"
              :action="uploadurl"
              accept=".csv, .xls, .xlsx"
              :show-file-list="true"
              :data="uploadparam"
              :on-success="csvsuccess"
              :auto-upload="false"
            >
              <el-button
                slot="trigger"
                class="btn-bo"
                style="padding: 12px 24px;margin-bottom: 0px;"
              >
                选择文件
              </el-button>
            </el-upload>
          </el-form-item>
  </el-form>
  <span slot="footer" class="dialog-footer">
    <el-button @click="dialogFormVisible = false">Cancel</el-button>
    <el-button type="primary" @click="dialogFormVisible = false">Confirm</el-button>
  </span>
</el-dialog>
    </el-row> 


    <el-row>
    <el-col :span="4">
        <el-card >
        <div slot="header" class="clearfix" > 
            <span >菜单</span>
        </div>
        <div >
           <ul >
      <li>
        <label> Node size  </label>
        <input type="range" min="1" max="100" v-model='nodeSize' /> {{ options.nodeSize }}
      </li>
      <li>
        <label>Render as  </label>
      <input type="radio" :value='false' v-model='canvas' />
      <label>SVG</label>
      <input type="radio" :value='true' v-model='canvas' />
      <label>Canvas</label>
      </li>  
      <div v-if  = "shownodeinfo" >
      <h2><a>节点信息</a></h2>
      <el-button @click="nodeShowMore">show more</el-button>
      <ul>
          <li>
      <a>节点id:{{nodeid}}</a>
      </li>
        <li>
      <a>节点类别:{{nodetype}}</a>
      </li>
      <li>
      <a>节点名字:{{nodename}}</a>
      </li>
        
      </ul>
      </div>
      <div v-if = "showlinkinfo" >
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
    </ul>
        </div>
        </el-card>
       
    </el-col>

     <el-col :span="19" :offset="1" >
         <el-card class="box-card">
        <div slot="header" class="clearfix" >
            <span >图谱展示</span>
        </div>
        <div >
         <!-- <div style="background-color:#eee;"> -->
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
         <!-- </div> -->
        </div>
        </el-card>

        
     </el-col>
    </el-row> 

 </div>   
  
</template>


<script>

import D3Network from 'vue-d3-network'
import axios from 'axios'


export default {
  name: 'KgGraph',
  components: { D3Network},
data () {
    return {
   
      nodes: [
        { id: 234, name: 'my awesome node 1'},
        { id: 2, name: 'my node 2',newtemp:'hhhh'},
        { id: 3, name:'orange node', _color: 'orange' },
        { id: 4, _color: '#4466ff'},
        { id: 5 },
        { id: 6 },
        { id: 7 },
        { id: 8 },
        { id: 9 }
      ],
      links: [
        { sid: 234, tid: 2 },
        { sid: 2, tid: 8 },
        { sid: 3, tid: 4,  _svgAttrs:{'stroke-width':8,opacity:1},name:'custom link' },
        { sid: 4, tid: 5 },
        { sid: 5, tid: 6 },
        { sid: 7, tid: 8 },
        { sid: 5, tid: 8 },
        { sid: 3, tid: 8 },
        { sid: 7, tid: 9 }
      ],
      nodeSize:45,
      canvas:false,
     nodename:'节点名字',
     nodeid:'节点id',
     nodetype:'节点类别',
     nodemsg:{},
     linkid:'关系id',
     linkname:'关系名字',
     shownodeinfo:undefined,
     showlinkinfo: undefined,
     inputsearch:'',
     dialogFormVisible: false,
        form: {
          name: '',
          region: '',
          date1: '',
          date2: '',
          delivery: false,
          type: [],
          resource: '',
          desc: ''
        },
        formLabelWidth: '120px'

     

    }
  },
  mounted(){
  axios
        .get('http://127.0.0.1:5000/get')
        .then(response => {
          this.nodes = response['data']['nodes'];
          this.links = response['data']['links']
        })

  },
  computed:{
    options(){
      return{
        force: 6000,
        //size:{ w:1920, h:1080},
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
      this.$router.push({name:'node',params:{id:this.nodeid}})
    },

   
    clicknode(event,node){
        this.shownodeinfo = 'True',
        this.showlinkinfo = undefined,
        this.nodename = node.name,
        this.nodeid = node.id,
        this.nodemsg = node.props,
        this.nodetype = node.label

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

  .el-row {
    margin-bottom: 20px;

  }
  .el-col {
    border-radius: 4px;

  }


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

