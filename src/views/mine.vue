<template>
  <div class="my_view">
    <div class="head">
      <div class="info no_login" v-if="!store.isLogin">
        <img
          src="https://skyao.io/learning-go/images/logo.png"
          alt=""
          class="avatar"
        />
        <div class="title">欢迎来到GopherBlog</div>
        <div class="abstract">登录享更多精彩</div>
      </div>
      <div class="info login_data" v-else>
        <img :src="store.userInfo.avatar" alt="" class="avatar" />
        <div class="title">{{ store.userInfo.nick_name }}</div>
        <div class="edit_info">
          <button @click="showEditModal">编辑资料</button>
        </div>
        <div class="abstract">{{ store.userInfo.sign }}</div>
      </div>
    </div>
    <div class="body">
      <div class="login_btn" v-if="!store.isLogin">
        <Button type="primary" @click="showLoginModal = true" block
          >登录/注册</Button
        >
      </div>
      <div class="action" v-else>
        <div class="item" @click="goto('mineCollections')">
          <i class="fa fa-star"></i>
          <span>我的收藏</span>
        </div>
        <div class="item">
          <i class="fa fa-lock"></i>
          <span @click="updatePassword">修改密码</span>
        </div>
        <div class="item">
          <i class="fa fa-envelope-o"></i>
          <span @click="bindEmail">绑定邮箱</span>
        </div>
        <div class="item" @click="logout">
          <i class="fa fa-mail-forward"></i>
          <span>注销退出</span>
        </div>
      </div>
    </div>
    <Popup
      position="bottom"
      v-model:show="showLoginModal"
      style="padding: 10px 0"
    >
      <Form @submit="onSubmit">
        <CellGroup inset>
          <Field
            v-model="form.user_name"
            name="用户名"
            label="用户名"
            placeholder="用户名"
            :rules="[{ required: true, message: '请填写用户名' }]"
          />
          <Field
            v-model="form.password"
            type="password"
            name="密码"
            label="密码"
            placeholder="密码"
            :rules="[{ required: true, message: '请填写密码' }]"
          />
        </CellGroup>
        <div style="margin: 16px">
          <Button round block type="primary" native-type="submit">提交</Button>
        </div>
      </Form>
    </Popup>
    <Popup position="bottom" v-model:show="editModal" style="padding: 10px 0">
      <Form @submit="editUserInfo">
        <CellGroup inset>
          <Field
            v-model="editUserForm.nick_name"
            label="昵称"
            placeholder="昵称"
            :rules="[{ required: true, message: '请填写昵称' }]"
          />
          <Field
            v-model="editUserForm.sign"
            label="个性签名"
            placeholder="个性签名"
            :rules="[{ required: true, message: '请填写个性签名' }]"
          />
        </CellGroup>
        <div style="margin: 16px">
          <Button round block type="primary" native-type="submit">提交</Button>
        </div>
      </Form>
    </Popup>
    <gvb-tabbar></gvb-tabbar>
  </div>
</template>
<script setup lang="ts">
import GvbTabbar from "@/components/tabbar.vue";
import {
  Button,
  showNotify,
  Popup,
  Form,
  Field,
  CellGroup,
  showSuccessToast,
  showToast,
} from "vant";
import { useStore } from "@/stores";
import router from "@/router";
import { reactive, ref } from "vue";
import type { loginEmailType, userInfoUpdateType } from "@/api/user";
import { loginEmailApi, userInfoUpdateApi } from "@/api/user";

const store = useStore();

const showLoginModal = ref(false);

function goto(name: string) {
  router.push({ name: name });
}

const form = reactive<loginEmailType>({
  user_name: "",
  password: "",
});

function logout() {
  store.logout();
  showNotify({ type: "primary", message: "注销成功" });
}

async function onSubmit() {
  let res = await loginEmailApi(form);
  if (res.code) {
    showNotify({ message: res.msg, type: "danger" });
    return;
  }
  store.setToken(res.data);
  showSuccessToast("登录成功");
  showLoginModal.value = false;
}

const editModal = ref(false);
const editUserForm = reactive<userInfoUpdateType>({
  nick_name: "",
  sign: "",
});
async function editUserInfo() {
  let res = await userInfoUpdateApi(editUserForm);
  if (res.code) {
    showNotify({ message: res.msg, type: "danger" });
    return;
  }
  store.setUserInfo("nick_name", editUserForm.nick_name);
  store.setUserInfo("sign", editUserForm.sign);
  showSuccessToast(res.msg);
  editModal.value = false;
}
function showEditModal() {
  editUserForm.nick_name = store.userInfo.nick_name;
  editUserForm.sign = store.userInfo.sign;
  editModal.value = true;
}

function updatePassword() {
  showToast({
    message: "修改密码请移步至web端",
    position: "top",
  });
}

function bindEmail() {
  showToast({
    message: "绑定邮箱请移步至web端",
    position: "top",
  });
}
</script>
<style lang="scss">
.my_view {
  min-height: 100vh;
  background-color: var(--bg);

  .head {
    background-image: url("https://qiniu.wei-jia.top/GopherBlog/20240109231012__bingimg_20231220_1920x1200.jpg");
    background-repeat: no-repeat;
    width: 100vw;
    height: 200px;
    display: flex;
    justify-content: center;
    position: relative;

    .info {
      width: 90vw;
      height: 100px;
      background-color: white;
      border-radius: 5px;
      position: absolute;
      bottom: 0;
      transform: translateY(50%);
      padding: 10px;
      display: flex;
      justify-content: center;
      align-items: center;

      .avatar {
        width: 50px;
        height: 50px;
        left: 20px;
        top: 0;
        transform: translateY(-50%);
        border-radius: 50%;
        position: absolute;
      }

      .title {
        left: 80px;
        top: 8px;
        position: absolute;
        font-weight: 600;
        font-size: 14px;
      }

      .abstract {
        color: #444;
      }

      .edit_info {
        position: absolute;
        right: 10px;
        top: 10px;
        width: 80px;

        button {
          background-color: #1989fa;
          border: none;
          color: white;
          font-size: 14px;
          padding: 4px 10px;
          border-radius: 10px;
        }
      }
    }
  }

  .body {
    margin-top: 50px;
    padding: 20px;

    .action {
      background-color: white;
      border-radius: 5px;
      display: flex;

      .item {
        width: 25%;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        padding: 20px 0;
        color: #333;
        font-size: 14px;

        i {
          font-size: 20px;
          margin-bottom: 5px;
        }
      }
    }
  }
}
</style>
