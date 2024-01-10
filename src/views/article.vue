<template>
  <div class="article_view">
    <div
      class="article_banner"
      :style="{ backgroundImage: `url('${data.banner_url}')` }"
    >
      <div class="head_top">
        <div class="left" @click="goBack"><i class="fa fa-angle-left"></i></div>
        <div class="middle">文章详情页</div>
      </div>
      <div class="head_slogan">
        <div class="title">{{ data.title }}</div>
        <div class="abstract">{{ data.abstract }}</div>
      </div>
    </div>
    <div class="body">
      <article>
        <MdPreview v-model="data.content"></MdPreview>
      </article>
      <div class="next_prev">
        <div class="prev">
          上一篇：
          <template v-if="data.prev">
            <a :href="`/article/${data.prev.id}`">{{ data.prev?.title }}</a>
          </template>
          <template v-else>已经是第一篇了</template>
        </div>
        <div class="next">
          下一篇：
          <template v-if="data.next">
            <a :href="`/article/${data.next.id}`">{{ data.next?.title }}</a>
          </template>
          <template v-else>已经是最后一篇了</template>
        </div>
      </div>

      <gvb-comment
        ref="gvbCommentRef"
        :article_id="route.params.id as string"
      ></gvb-comment>
    </div>

    <div class="bottom_action">
      <div class="ipt">
        <Form @submit="addComment" :show-error-message="false">
          <Field
            v-model="content"
            :rules="[{ required: true, message: '请填写评论内容' }]"
            placeholder="发送评论"
          ></Field>
        </Form>
      </div>
      <Badge :content="data.digg_count">
        <div :class="{ digg: true, active: data.is_digg }" @click="digg">
          <i class="fa fa-thumbs-o-up"></i>
        </div>
      </Badge>
      <Badge :content="data.collects_count">
        <div :class="{ star: true, active: data.is_collect }" @click="coll">
          <i class="fa fa-star-o"></i>
        </div>
      </Badge>
    </div>
  </div>
</template>
<script setup lang="ts">
import { articleDetailApi } from "@/api/article";
import type { articleType } from "@/api/article";
import { MdPreview } from "md-editor-v3";
import "md-editor-v3/lib/preview.css";
import "md-editor-v3/lib/style.css";
import { useRoute } from "vue-router";
import { reactive, ref } from "vue";
import { Field, showNotify, showSuccessToast } from "vant";
import { articleDiggApi } from "@/api/article";
import { commentCreateApi } from "@/api/comment";
import type { commentAddType } from "@/api/comment";
import { Form } from "vant";
import { articleCollectsPostApi } from "@/api/article";
import { Badge } from "vant";
import GvbComment from "@/components/comment.vue";
import { useStore } from "@/stores";

const store = useStore();
const route = useRoute();
const data = reactive<articleType>({
  abstract: "",
  banner_url: "",
  collects_count: 0,
  created_at: "",
  digg_count: 0,
  id: "",
  title: "",
});

async function getData() {
  let res = await articleDetailApi(route.params.id as string);
  Object.assign(data, res.data);
}

getData();

function goBack() {
  history.back();
}

async function digg() {
  let res = await articleDiggApi(route.params.id as string);
  if (res.code) {
    showNotify({ message: res.msg, type: "danger" });
    return;
  }
  data.is_digg = true;

  data.digg_count++;
  setTimeout(() => {
    data.is_digg = false;
  }, 2000);
  showSuccessToast(res.msg);
}

const content = ref("");

const gvbCommentRef = ref();

async function addComment() {
  if (!store.isLogin) {
    showNotify({ message: "请登录", type: "warning" });
    return;
  }
  const data: commentAddType = {
    article_id: route.params.id as string,
    content: content.value,
    parent_comment_id: undefined,
  };
  let res = await commentCreateApi(data);
  if (res.code) {
    showNotify({ message: res.msg, type: "danger" });
    return;
  }
  content.value = "";
  showSuccessToast(res.msg);
  gvbCommentRef.value.getData();
}

async function coll() {
  let res = await articleCollectsPostApi(route.params.id as string);
  if (res.code) {
    showNotify({ message: res.msg, type: "danger" });
    return;
  }
  showSuccessToast(res.msg);

  data.is_collect = !data.is_collect;
  if (data.is_collect) {
    data.collects_count += 1;
  } else {
    data.collects_count -= 1;
  }
}
</script>
<style lang="scss">
.article_view {
  .article_banner {
    width: 100vw;
    height: 200px;
    background-repeat: no-repeat;
    background-size: cover;
    display: flex;
    justify-content: center;
    align-items: center;
    position: relative;

    .head_top {
      position: absolute;
      top: 0;
      color: white;
      display: flex;
      align-items: center;
      padding: 10px 20px;
      width: 100vw;

      .middle {
        position: absolute;
        left: 50%;
        transform: translateX(-50%);
      }
    }

    .head_slogan {
      display: flex;
      justify-content: center;
      align-items: center;
      flex-direction: column;
      font-size: 14px;
      color: white;
      padding-left: 20px;
      padding-right: 20px;

      .title {
        font-size: 18px;
        margin-bottom: 10px;
      }

      .abstract {
        display: -webkit-box;
        -webkit-box-orient: vertical;
        -webkit-line-clamp: 2;
        overflow: hidden;
        text-overflow: ellipsis;
      }
    }
  }

  .next_prev {
    padding: 0 20px 20px 20px;
    margin-bottom: 20px;
    background-color: white;

    .next {
      margin-top: 10px;
    }

    a {
      color: var(--active);
    }
  }

  .body {
    margin-bottom: 100px;
    background-color: var(--bg);

    ul {
      li {
        list-style: disc;
      }
    }

    ol {
      li {
        list-style: decimal;
      }
    }

    table {
      width: 90vw;
      justify-content: center;

      th {
        text-align: center;
        font-weight: bold;
        color: var(--bg);
        background-color: var(--active);
      }

      td {
        text-align: center;
      }
    }
  }

  .bottom_action {
    position: fixed;
    bottom: 0;
    width: 100vw;
    display: flex;
    background-color: white;
    box-shadow: -2vw 0 2vw 1vw rgba(black, 0.08);
    padding: 2vw 4vw;
    justify-content: space-between;
    z-index: 1;

    .ipt {
      width: calc(100% - 35vw);

      .van-cell {
        border-color: var(--bg);
        border-width: 1px;
        border-radius: 5px;
        border-style: solid;
      }
    }

    .digg,
    .star {
      width: 46px;
      background-color: #e7e7e7;
      display: flex;
      justify-content: center;
      align-items: center;
      border-radius: 5px;
      height: 100%;

      &.active {
        color: var(--active);
      }
    }
  }
}
</style>
