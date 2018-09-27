<template>
  <div class="main">
    <div class="nav-left">
      <div class="nav-login">
        {{title}}
      </div>

      <el-menu :default-active="`${activeMenu}`" class="jart-el-menu" :unique-opened="true" :collapse="isCollapse" background-color="#001529" text-color="hsla(0,0%,100%,.65)" active-text-color="#ffd04b" @select="handleSelect">

        <template v-for="(item,idx) in menuList">
          <el-menu-item v-if="item.subList.length==0" :index="`${item.id}`" :key="idx">
            <i :class="`iconfont ${item.icon}` "></i>
            <span slot="title">{{item.name}}</span>

          </el-menu-item>
          <el-submenu v-else :index="`${item.id}`" :key="idx">
            <template slot="title">
              <i :class="`iconfont ${item.icon}`"></i>
              <span>{{item.name}}</span>
            </template>
            <template v-for="(sub,x) in item.subList">
              <el-menu-item v-if="!sub.subList" :index="`${sub.id}`" :key="x">
                {{sub.name}}
              </el-menu-item>
              <el-submenu v-else :index="`${sub.id}`" :key="x">
                <span slot="title">{{sub.name}}</span>
                <el-menu-item v-for="(m,y) in sub.subList" :index="`${m.id}`" :key="y">{{m.name}}</el-menu-item>
              </el-submenu>
            </template>
          </el-submenu>
        </template>

      </el-menu>
    </div>
    <div class="nav-main">
      <div class="layout-header">
        <i style="display:inline-block;" :class="`top-menu iconfont icon-fenlei ${isCollapse?'icon_tra':'icon_tra_out'}`" @click="menu_click"></i>
        <div class="head-right">
          <span>
            <i class="account iconfont icon-ICON_MGD"></i>
          </span>
          <span style="margin:0 10px;">{{user.username}}</span>
          <div class="head-ul">
            <div class="tool-menu">
              <div class="menu-item">
                <i class="iconfont icon-mima"></i>
                修改密码
              </div>
              <div class="menu-item" @click="login_out_handle">
                <i class="iconfont icon-tuichu"></i>
                退出登录</div>
            </div>
          </div>
        </div>
      </div>
      <div class="layout-map">
        <el-breadcrumb separator="/">
          <el-breadcrumb-item v-for="(item,index) in breadcrumbList" :key="index">{{item.name}}</el-breadcrumb-item>
        </el-breadcrumb>
      </div>
      <div class="layout-content">
        <router-view />
      </div>
    </div>
  </div>
</template>

<script>
import Cookies from "js-cookie";
import adminJson from "./adminRole";
export default {
  data() {
    return {
      user: {},
      title: "招工管理系统",
      conWidth: 500,
      isCollapse: false,
      activeMenu: "1",
      breadcrumbList: [],
      menuList: []
    };
  },
  mounted() {
    var member = Cookies.get("recrit-ck");
    console.log("cookie=>", member);
    if (member) {
      this.user = JSON.parse(member);
      this.menuList = adminJson;

      this.url_change_handle();
    } else {
      this.$message.error("用户登录失效，请重新登录！");
      setTimeout(() => {
        this.$router.push({ path: "/login" });
      }, 2000);
    }
  },
  methods: {
    url_change_handle() {
      this.breadcrumbList = [];
      var path = this.$route.path;
      this.menuList.forEach((item, index) => {
        if (item.path == path) {
          this.activeMenu = item.id;
          this.breadcrumbList.push(item);
        } else {
          item.subList.forEach(sub => {
            if (sub.path == path) {
              this.activeMenu = sub.id;
              this.breadcrumbList.push(item);
              this.breadcrumbList.push(sub);
            } else {
              if (sub.subList) {
                sub.subList.forEach(x => {
                  if (x.path == path) {
                    this.activeMenu = x.id;
                    this.breadcrumbList.push(item);
                    this.breadcrumbList.push(sub);
                    this.breadcrumbList.push(x);
                  }
                });
              }
            }
          });
        }
      });
    },
    handleOpen(key, keyPath) {
      console.log(key, keyPath);
    },
    handleClose(key, keyPath) {
      console.log(key, keyPath);
    },
    handleSelect(key, keyPath) {
      if (keyPath.length == 1) {
        var menu = this.menuList.find(x => x.id == key);
        this.activeMenu = key;
        this.$router.push({ path: menu.path });
        if (menu.id == this.menuList[0].id) this.breadcrumb = null;
        else this.breadcrumb = menu;
      } else if (keyPath.length == 2) {
        var menu = this.menuList
          .find(x => x.id == keyPath[0])
          .subList.find(x => x.id == key);
        this.activeMenu = keyPath[1];
        this.breadcrumb = menu;
        this.$router.push({ path: menu.path });
      } else {
        var twoMenu = this.menuList.find(x => x.id == keyPath[0]);
        if (twoMenu) {
          var thrmenu = twoMenu.subList.find(x => x.id == keyPath[1]);
          if (thrmenu) {
            var menu = thrmenu.subList.find(x => x.id == key);
            this.activeMenu = key;
            this.breadcrumb = menu;
            this.$router.push({ path: menu.path });
          }
        }
      }
    },
    menu_click() {
      this.main_width();
      this.isCollapse = !this.isCollapse;
      setTimeout(() => {
        if (!this.isCollapse) this.title = "招工管理系统";
        else this.title = "招工";
      }, 200);
    },
    main_width() {
      setTimeout(() => {
        if (!this.isCollapse)
          this.conWidth = document.documentElement.clientWidth - 240;
        else this.conWidth = document.documentElement.clientWidth - 66;
      }, 300);
    },
    breadcrumb_handle(path) {
      if (path) {
        this.activeMenu = this.menuList[0].id;
        this.breadcrumb = null;
        this.$router.push({ path: path });
      } else {
        this.menuList.forEach((item, index) => {
          if (item.path == this.breadcrumb.path) this.activeMenu = item.id;
          else {
            item.subList.forEach((sub, idx) => {
              if (sub.path == this.breadcrumb.path) this.activeMenu = sub.id;
            });
          }
        });
        this.$router.push({ path: this.breadcrumb.path });
      }
    },
    login_out_handle() {
      this.$confirm("确定要退出登录吗?", "提示", {
        type: "warning"
      })
        .then(() => {
          Cookies.remove("member");
          this.$router.push({ path: "/login" });
        })
        .catch(() => {});
    }
  },
  watch: {
    $route(to, from) {
      this.url_change_handle();
    }
  }
};
</script>

<style lang="scss">
@import "../css/base.scss";
</style>

<style lang="scss" scoped >
.iconfont {
  font-size: 20px;
}
.icon_tra {
  transform: rotate(180deg);
  -ms-transform: rotate(180deg); /* IE 9 */
  -moz-transform: rotate(180deg); /* Firefox */
  -webkit-transform: rotate(180deg); /* Safari 和 Chrome */
  -o-transform: rotate(180deg); /* Opera */

  transition: transform 0.5s; //过度时间 可调
  -moz-transition: -moz-transform 0.5s;
  -moz-transition: -moz-transform 0.5s;
  -o-transition: -o-transform 0.5s;
  -ms-transition: -ms-transform 0.5s;
}
.icon_tra_out {
  transform: rotate(0deg);
  -ms-transform: rotate(0deg); /* IE 9 */
  -moz-transform: rotate(0deg); /* Firefox */
  -webkit-transform: rotate(0deg); /* Safari 和 Chrome */
  -o-transform: rotate(0deg); /* Opera */

  transition: transform 0.5s; //过度时间 可调
  -moz-transition: -moz-transform 0.5s;
  -moz-transition: -moz-transform 0.5s;
  -o-transition: -o-transform 0.5s;
  -ms-transition: -ms-transform 0.5s;
}
</style>
