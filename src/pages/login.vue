<template>
  <div class="main">
    <div class="login">
      <div class="column sysTitle">System Title</div>
      <div class="column">
        <div class="login-form">
          <div class="form">
            <div class="input">
              <input type="text" placeholder="请输入账号名" maxlength="20" v-model="form.username" class="user">
            </div>
              <div class="input">
                <input type="password" placeholder="请输入密码" v-model="form.pwd" class="pwd">
            </div>
                <div>
                  <div class="input" style="width:275px;float:left;margin-top:0;margin-right:20px;">
                    <input type="text" placeholder="请输入验证码" maxlength="10" v-model="form.captcha" class="check">
              </div>
                    <div style="float:left;height:45px;margin-left:-10px; width:115px;background:#ccc;">
                      <img style="height:40px;margin-top:2px;cursor: pointer;" :src="captcha" @click="change_captcha">
              </div>
                      <div style="clear:both"></div>
                    </div>
                    <div class="btn-login" @click="login_handle">登录</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
</template>

<script>
import Cookies from "js-cookie";
export default {
  data() {
    return {
      captcha: "",
      form: {
        username: "",
        pwd: "",
        captcha: ""
      }
    };
  },
  mounted() {
    this.captcha = "/api/user/captcha";
  },
  methods: {
    change_captcha() {
      this.captcha =
        "/api/user/captcha?" + Math.round(Math.random() * 9999999999);
    },
    login_handle() {
      if (!this.form.username) {
        this.$message({
          message: "请输入登录名！",
          type: "warning"
        });
        return;
      }
      if (!this.form.pwd) {
        this.$message({
          message: "请输入密码！",
          type: "warning"
        });
        return;
      }
      if (!this.form.captcha) {
        this.$message({
          message: "请输入验证码！",
          type: "warning"
        });
        return;
      }
      this.http.get("/api/user/login", { params: this.form }).then(res => {
        if (res.code == 200) {
          Cookies.set("recrit-web", JSON.stringify(res.docs), { expires: 7 });
          this.$router.push({ path: "/" });
        } else {
          this.$message.error(res.msg);
        }
      });
    }
  }
};
</script>
<style lang="scss" scoped>
.main {
  position: fixed;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  background-image: url(../assets/images/bg-login.jpg);

  background-position: center center;
  background-repeat: no-repeat;
  background-size: cover;
  min-width: 1200px;
  .login {
    position: absolute;
    top: 50%;
    left: 50%;
    width: 1010px;
    height: 450px;
    margin-left: -505px;
    margin-top: -225px;
    background-color: rgba(0, 0, 0, 0.3);
    display: flex;
    border-radius: 10px;
    .column {
      width: 50%;
      .login-form {
        padding: 50px 40px;
        .form {
          margin-top: 40px;
          .input {
            margin: 20px 10px;
            border: 2px solid #e2e2e2;
            border-radius: 5px;
            height: 42px;
            background: #fff;
            color: #c0c4cc;
            font-size: 16px;
            .user {
              background: url(../assets/images/icon-user.png);
              background-repeat: no-repeat;
              height: 40px;
              width: 345px;
              border: none;
              padding-left: 55px;
              font-size: 16px;
            }
            .pwd {
              background: url(../assets/images/icon-password.png);
              background-repeat: no-repeat;
              height: 40px;
              width: 345px;
              border: none;
              padding-left: 55px;
              font-size: 16px;
            }
            .check {
              background: url(../assets/images/icon-code.png);
              background-repeat: no-repeat;
              height: 40px;
              width: 245px;
              border: none;
              padding-left: 55px;
              font-size: 16px;
            }
          }
          .btn-login {
            margin: 20px 0;
            height: 50px;
            line-height: 50px;
            color: #fff;
            background: #d61e27;
            font-size: 18px;
            border-radius: 5px;
            text-align: center;
            cursor: pointer;
          }
        }
      }
    }
    .sysTitle {
      color: #fff;
      font-size: 40px;
      line-height: 455px;
      text-align: center;
    }
  }
}
</style>


