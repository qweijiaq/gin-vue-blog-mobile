<template>
  <div class="gvb_comment">
    <div class="item" v-for="item in data.list">
      <img :src="item.user.avatar" alt="" class="avatar" />
      <div class="comment">
        <div class="top">
          <span class="name">{{ item.user.nick_name }}</span>
          <span class="date"
            >{{ relativeCurrentTime(item.created_at) }}
            {{ item.user.addr }}</span
          >
        </div>
        <div class="content">{{ item.content }}</div>
        <div class="sub_comment" v-if="item.sub_comments.length">
          <div class="sub" v-for="sub in item.sub_comments">
            <span class="name">{{ sub.user.nick_name }}：</span>
            <span class="sub_content">{{ sub.content }}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { commentListApi } from "@/api/comment";
import type { commentType } from "@/api/comment";
import { reactive } from "vue";
import type { listDataType } from "@/api";
import { relativeCurrentTime } from "@/utils/date";

interface Props {
  article_id: string;
}

const props = defineProps<Props>();

const data = reactive<listDataType<commentType>>({
  list: [],
  count: 0,
});

async function getData() {
  let res = await commentListApi(props.article_id);
  data.list = res.data.list;
  data.count = res.data.count;
}
getData();

defineExpose({
  getData,
});
</script>

<style lang="scss">
.gvb_comment {
  margin-top: 20px;
  width: 100vw;
  background-color: white;

  .item {
    padding: 20px 20px 0 20px;
    display: flex;
    justify-content: space-between;

    .avatar {
      width: 40px;
      height: 40px;
      border-radius: 50%;
    }

    .comment {
      width: calc(100% - 50px);
      color: #555;
      font-size: 14px;

      .name {
        color: #333;
        font-weight: 600;
        margin-right: 5px;
      }

      .content {
        margin: 2px 0;
      }

      .sub_comment {
        background-color: var(--bg);
        padding: 10px;
        margin-top: 5px;
        border-radius: 5px;

        .sub {
          margin-bottom: 10px;

          &:last-child {
            margin-bottom: 0;
          }
        }
      }
    }
  }
}
</style>
