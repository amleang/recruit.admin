<template>
  <div>
    <el-form
      ref="form"
      :model="form"
      label-width="150px"
    >
      <el-form-item label="企业名称">
        <el-input
          v-model="form.coName"
          size="small"
          placeholder="请输入企业名称"
        ></el-input>
      </el-form-item>
      <el-form-item label="app版本号">
        <el-input
          v-model="form.ver"
          size="small"
          placeholder="请输入APP版本号"
        ></el-input>
      </el-form-item>
      <el-form-item label="平台电话">
        <el-input
          v-model="form.platPhone"
          size="small"
          placeholder="请输入平台电话"
        ></el-input>
      </el-form-item>
      <el-form-item
        v-for="(item,index) in form.links"
        :key="index"
      >
        <link-form
          style="margin-left:-150px;"
          ref="linkForm"
          :form="item"
          :index="index"
          @linkChange="link_change_handle"
          @delHandle="link_del_handle"
        ></link-form>
      </el-form-item>
      <el-form-item label="">
        <el-button
          size="small"
          icon="el-icon-plus"
          type="success"
          @click="add_link_handle"
        >添加联系人</el-button>
      </el-form-item>
      <el-form-item label="注意事项">
        <vue-editor
          :edit="form.attention"
          @changeedit="content=>form.attention = content"
        ></vue-editor>
      </el-form-item>
      <el-form-item label="关于我们">
        <vue-editor
          :edit="form.abstract"
          @changeedit="content=>form.abstract = content"
        ></vue-editor>
      </el-form-item>
      <el-form-item label="公司地址">
        <el-input
          v-model="form.address"
          size="small"
          placeholder="请输入公司地址"
        ></el-input>
      </el-form-item>
      <el-form-item label="标注公司地址">
        <div id="container"></div>
      </el-form-item>
    </el-form>
    <el-form
      :inline="true"
      ref="form2"
      :model="form"
      label-width="150px"
      style="margin-bottom:40px;"
    >
      <el-form-item
        label="封面图"
        style="width:50%;"
      >
        <el-upload
          style="float:left;"
          class="avatar-uploader"
          action="/api/upload"
          :show-file-list="false"
          :on-success="(res, file)=>handleAvatarSuccess(res,file,'cover')"
          :before-upload="beforeAvatarUpload"
        >
          <form-img
            v-if="form.cover"
            :img="form.cover"
          ></form-img>
          <i
            v-else
            class="el-icon-plus avatar-uploader-icon"
          ></i>
        </el-upload>
      </el-form-item>
      <el-form-item label="二维码">
        <el-upload
          style="float:left;"
          class="avatar-uploader"
          action="/api/upload"
          :show-file-list="false"
          :on-success="(res, file)=>handleAvatarSuccess(res,file,'qrcode')"
          :before-upload="beforeAvatarUpload"
        >
          <form-img
            v-if="form.qrcode"
            :img="form.qrcode"
          ></form-img>
          <i
            v-else
            class="el-icon-plus avatar-uploader-icon"
          ></i>
        </el-upload>
      </el-form-item>

    </el-form>
    <div class="bottom">
      <el-button
        type="success"
        @click="btn_save"
      >保存</el-button>
    </div>
  </div>
</template>
<script>
import linkForm from "./linkView";
import VueEditor from "@/components/tool/vueEditor";
import { TMap } from "@/components/lib/util";
var loadding = null;
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
        address: "",
        platPhone: "",
        links: [{ link: "", phone: "", default: false }],
        attention: "",
        abstract: "",
        lat: "",
        lng: "",
        cover: "",
        qrcode: "",
        ver: ""
      },
      markersArray: []
    };
  },

  mounted() {
    const that = this;
    TMap("DE2BZ-47CRU-5LPVV-BXXAB-MWLRQ-D7FXQ").then(qq => {
      let lat = "31.27620345";
      let lng = "120.59967041";
      that.http.get("/api/co/").then(res => {
        if (res.code == 200) {
          if (res.data.length > 0) {
            that.form = res.data[0];
            lat = that.form.lat;
            lng = that.form.lng;
          }
        } else that.$message.error(res.msg);
        console.log("form=>", { lat, lng });
        var map = new qq.maps.Map(document.getElementById("container"), {
          // 地图的中心地理坐标。
          center: new qq.maps.LatLng(lat, lng),
          zoom: 8
        });
        if (that.form.lat && that.form.lng) {
          console.log("true");
          var marker1 = new qq.maps.Marker({
            position: new qq.maps.LatLng(lat, lng),
            animation: qq.maps.MarkerAnimation.DROP,
            map: map
          });
          that.markersArray.push(marker1);
        }
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
    });
  },
  methods: {
    add_link_handle() {
      this.form.links.push({ link: "", phone: "", default: false });
    },
    link_del_handle(index) {
      if (this.form.links.length > 1) this.form.links.splice(index, 1);
      else this.$message.warning("至少保留一个联系人！");
    },
    link_change_handle(index) {
      this.form.links.forEach((item, idx) => {
        if (idx == index) item.default = 1;
        else item.default = 0;
      });
    },
    handleAvatarSuccess(res, file, type) {
      if (res.code == 200) {
        if (type == "cover") this.form.cover = res.data;
        else this.form.qrcode = res.data;
      } else this.$message.error(res.msg);
      loadding.close();
    },
    beforeAvatarUpload(file) {
      const isJPG = "image/jpeg,image/png".indexOf(file.type) > -1;
      if (!isJPG) {
        this.$message.error("上传的图片只能是jpg,png格式！");
        return isJPG;
      }
      loadding = this.$loading({
        lock: true,
        text: "Loading",
        spinner: "el-icon-loading",
        background: "rgba(0, 0, 0, 0.7)"
      });
      return isJPG;
    },
    async btn_save() {
      if (!this.form.coName) {
        this.$message.warning("请输入企业名称");
        return;
      }
      if (!this.form.platPhone) {
        this.$message.warning("请输入平台电话");
        return;
      }
      if(!this.form.ver){
        this.$message.warning("请输入APP版本号");
        return;
      }
      var isFlag = true;

      await this.$refs.linkForm.forEach(item => {
        item.validateFun().then(res => {
          console.log("res=>", res);
          if (!res) isFlag = res;
        });
      });
      if (!isFlag) return;
      if (!this.form.attention) {
        this.$message.warning("请输入注意事项");
        return;
      }
      if (!this.form.abstract) {
        this.$message.warning("请输入企业简介");
        return;
      }
      if (!this.form.address) {
        this.$message.warning("请输入企业地址");
        return;
      }
      if (!this.form.lat || !this.form.lng) {
        this.$message.warning("请标注企业地址");
        return;
      }
      if (this.form.id == 0) {
        this.http.post("/api/co", this.form).then(res => {
          if (res.code == 200) {
            this.$message.success("保存成功！");
          } else this.$message.error(res.msg);
        });
      } else {
        this.http.put("/api/co", this.form).then(res => {
          if (res.code == 200) {
            this.$message.success("保存成功！");
          } else this.$message.error(res.msg);
        });
      }
    }
  }
};
</script>

<style scoped>
#container {
  min-width: 600px;
  height: 400px;
}
.bottom {
  position: absolute;
  right: 50px;
  bottom: 20px;
}
</style>
