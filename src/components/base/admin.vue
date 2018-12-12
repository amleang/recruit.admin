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
              <div class="menu-item" @click="update_pwd_handle">
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
          <el-breadcrumb-item :to="{ path: '/' }">主页</el-breadcrumb-item>
          <el-breadcrumb-item v-for="(item,index) in breadcrumbList" :key="index">{{item.name}}</el-breadcrumb-item>
        </el-breadcrumb>
      </div>
      <div class="layout-content">
        <router-view />
      </div>
    </div>
    <el-dialog title="修改密码" :visible.sync="mainDialog" top="20vh" width="600px" append-to-body :close-on-click-modal="false" :before-close="handle_Close">
      <el-form ref="mainform" :model="mainform" label-width="150px">
        <el-form-item label="旧密码" prop="username">
          <el-input type="password" size="small" v-model="mainform.oldpwd" maxlength="50" style="width:300px;" placeholder="请输入旧密码"></el-input>
        </el-form-item>
        <el-form-item label="新密码" prop="username">
          <el-input type="password" size="small" v-model="mainform.pwd" maxlength="50" style="width:300px;" placeholder="请输入新密码"></el-input>
        </el-form-item>
        <el-form-item label="再次密码" prop="username">
          <el-input type="password" size="small" v-model="mainform.repwd" maxlength="50" style="width:300px;" placeholder="请输入再次密码"></el-input>
        </el-form-item>

      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="handle_Close">取消</el-button>
        <el-button type="primary" @click="confirm_handle">确认</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import Cookies from "js-cookie";
import adminJson from "./adminRole";
export default {
  data() {
    return {
      mainDialog: false,
      mainform: {
        oldpwd: "",
        pwd: "",
        repwd: ""
      },
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
    update_pwd_handle() {
      this.mainDialog = true;
    },
    handle_Close() {
      this.mainDialog = false;
    },
    confirm_handle() {
      if (!this.mainform.oldpwd) {
        this.$message.error("请输入旧密码");
        return;
      }
      if (!this.mainform.pwd) {
        this.$message.error("请输入新密码");
        return;
      }
      if (!this.mainform.repwd) {
        this.$message.error("请输入再次密码");
        return;
      }
      debugger
      if (this.mainform.pwd != this.mainform.repwd) {
        this.$message.error("两次密码不一致，请重新输入");
        return;
      }
      var member = Cookies.get("recrit-ck");
      console.log("cookie=>", member);
      if (member) {
        this.user = JSON.parse(member);
        const postData = {
          id: this.user.id,
          oldpwd: this.mainform.oldpwd,
          pwd: this.mainform.pwd
        };
        this.http.post("/api/user/updpwd", postData).then(res => {
          if (res.code == 200) {
            this.$message.success("密码修改成功,请重新登陆!");
            this.mainDialog = false;
            Cookies.remove("recrit-ck");
            setTimeout(() => {
              this.$router.push({ path: "/login" });
            }, 2500);
          } else this.$message.error(res.msg);
        });
      } else {
        this.$message.error("用户登录失效，请重新登录！");
        setTimeout(() => {
          this.$router.push({ path: "/login" });
        }, 2000);
      }
    },
    url_change_handle() {
      this.breadcrumbList = [];
      var path = this.$route.path;
      this.menuList.forEach((item, index) => {
        if (item.path == path) {
          this.activeMenu = item.id;
          if (path != "/") this.breadcrumbList.push(item);
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
