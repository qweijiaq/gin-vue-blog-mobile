import { defineStore } from "pinia";
import { showNotify } from "vant";
import { userInfoApi } from "@/api/user";
import { parseToken } from "@/utils/jwt";

export interface userStoreInfoType {
  user_name: string;
  nick_name: string;
  role: number; // 角色
  user_id: number; // 用户id
  avatar: string;
  token: string;
  exp: number; // 过期时间 需要x1000
  sign: string; // slogn
}

const userInfo: userStoreInfoType = {
  user_name: "",
  nick_name: "",
  role: 0,
  user_id: 0,
  avatar: "",
  token: "",
  exp: 0,
  sign: "",
};
export const useStore = defineStore("store", {
  state: () => {
    return {
      userInfo: userInfo,
    };
  },
  actions: {
    async setToken(token: string) {
      this.userInfo.token = token;
      // 调用户信息的接口
      let res = await userInfoApi();
      let info = parseToken(token);
      let data = res.data;
      this.userInfo = {
        user_name: data.user_name,
        nick_name: data.nick_name,
        role: info.role,
        user_id: info.user_id,
        avatar: data.avatar,
        token: token,
        exp: info.exp,
        sign: data.sign,
      };

      localStorage.setItem("userInfo", JSON.stringify(this.userInfo));
    },
    loadToken() {
      let val = localStorage.getItem("userInfo");
      if (val === null) {
        return;
      }
      try {
        this.userInfo = JSON.parse(val);
      } catch (e) {
        this.clearUserInfo();
        return;
      }
      // 判断token是不是过期了
      let exp = Number(this.userInfo.exp) * 1000;
      let nowTime = new Date().getTime();
      if (exp - nowTime <= 0) {
        // 过期
        showNotify({ type: "warning", message: "登录已过期" });
        this.clearUserInfo();
        return;
      }
    },
    setUserInfo(key: "nick_name" | "sign", val: string) {
      this.userInfo[key] = val;
      localStorage.setItem("userInfo", JSON.stringify(this.userInfo));
    },
    async logout() {
      this.clearUserInfo();
    },
    clearUserInfo() {
      this.userInfo = userInfo;
      localStorage.removeItem("userInfo");
    },
  },
  getters: {
    // 是否登录
    isLogin(): boolean {
      return this.userInfo.role !== 0;
    },
    // 判断是不是管理员
    isAdmin(): boolean {
      return this.userInfo.role == 1;
    },
    isGeneral(): boolean {
      return this.userInfo.role == 2;
    },
    // 判断是不是游客
    isTourist(): boolean {
      return this.userInfo.role == 3;
    },
  },
});
