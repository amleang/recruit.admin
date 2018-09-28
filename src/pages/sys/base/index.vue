<template>
  <div>
    <el-form ref="form" :model="form" label-width="150px">
      <el-form-item label="企业名称">
        <el-input v-model="form.coName" size="small"></el-input>
      </el-form-item>
      <el-form-item v-for="(item,index) in form.links" :key="index">
        <link-form style="margin-left:-150px;" ref="linkForm" :form="item" :index="index"></link-form>
      </el-form-item>
      <el-form-item label="">
        <el-button size="small" icon="el-icon-plus" type="success" @click="add_link_handle">添加</el-button>
      </el-form-item>
      <el-form-item label="注意事项">
        <vue-editor :edit="form.attention" @changeedit="content=>form.content = content"></vue-editor>
      </el-form-item>
      <el-form-item label="企业简介">
        <vue-editor :edit="form.abstract" @changeedit="content=>form.abstract = content"></vue-editor>
      </el-form-item>
      <el-form-item label="标注公司地址">
        <div id="container"></div>
      </el-form-item>
    </el-form>
    <el-form :inline="true" ref="form2" :model="form" label-width="150px" style="margin-bottom:40px;">
      <el-form-item label="封面图" style="width:50%;">
        <el-upload style="float:left;" class="avatar-uploader" action="/api/upload" :show-file-list="false" :on-success="handleAvatarSuccess" :before-upload="beforeAvatarUpload">
          <form-img v-if="form.cover" :img="form.cover"></form-img>
          <i v-else class="el-icon-plus avatar-uploader-icon"></i>
        </el-upload>
      </el-form-item>
      <el-form-item label="二维码">
        <el-upload style="float:left;" class="avatar-uploader" action="/api/upload" :show-file-list="false" :on-success="handleAvatarSuccess" :before-upload="beforeAvatarUpload">
          <form-img v-if="form.qrcode" :img="form.qrcode"></form-img>
          <i v-else class="el-icon-plus avatar-uploader-icon"></i>
        </el-upload>
      </el-form-item>

    </el-form>
    <div class="bottom">
      <el-button type="success">保存</el-button>
    </div>
  </div>
</template>
<script>
import linkForm from "./linkView";
import VueEditor from "@/components/tool/vueEditor";
import { TMap } from "@/components/lib/util";
export default {
  components: {
    linkForm,
    VueEditor
  },
  data() {
    return {
      form: {
        id: 0,
        coName: "",
        links: [{ link: "", phone: "", default: false }],
        attention: "",
        abstract: "",
        lat: 0,
        lng: 0,
        cover: "",
        qrcode: ""
      },
      markersArray: []
    };
  },

  mounted() {
    const that = this;
    TMap("DE2BZ-47CRU-5LPVV-BXXAB-MWLRQ-D7FXQ").then(qq => {
      var map = new qq.maps.Map(document.getElementById("container"), {
        // 地图的中心地理坐标。
        center: new qq.maps.LatLng(31.27620345, 120.59967041),
        zoom: 8
      });
      //添加监听事件
      qq.maps.event.addListener(map, "click", function(event) {
        if (that.markersArray) {
          that.markersArray.forEach(item => {
            item.setMap(null);
          });
        }
        that.markersArray = [];
        that.form.lat = event.latLng.lat;
        that.form.lng == event.latLng.lng;
        var marker = new qq.maps.Marker({
          position: event.latLng,
          animation: qq.maps.MarkerAnimation.DROP,
          map: map
        });
        that.markersArray.push(marker);
      });
    });
  },
  methods: {
    add_link_handle() {
      this.form.links.push({ link: "", phone: "", default: false });
    }
  }
};
</script>

<style scoped>
#container {
  min-width: 600px;
  height: 400px;
}
.bottom{
  position:absolute;
  right: 50px;
  bottom:20px;
}
</style>
