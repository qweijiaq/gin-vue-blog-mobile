<template>
  <div class="my_coll_view">
    <div class="banner">
      <div class="head_top">
        <div class="left" @click="goBack"><i class="fa fa-angle-left"></i></div>
        <div class="middle">我的收藏</div>
      </div>
    </div>
    <div class="body">
      <div class="article_list">
        <div class="item" v-for="item in data.list">
          <div class="title">
            <a :href="`/article/${item.id}`" v-html="item.title"></a>
          </div>
          <div class="abstract">
            <TextEllipsis :content="item.abstract" :rows="2"></TextEllipsis>
          </div>
          <div class="info">
            <span class="date"
              ><Icon name="clock" />
              {{ relativeCurrentTime(item.created_at) }}</span
            >
            <span class="tags">
              <i class="fa fa-tags"></i>
              <span v-for="tag in item.tags">{{ tag }}</span>
            </span>
            <span class="look"><Icon name="eye" /> {{ item.look_count }}</span>
          </div>
        </div>
      </div>
    </div>
    <gvb-tabbar></gvb-tabbar>
  </div>
</template>
<script setup lang="ts">
import GvbTabbar from "@/components/tabbar.vue";
import { Icon, TextEllipsis } from "vant";
import { articleCollectsApi } from "@/api/article";
import type { articleType } from "@/api/article";
import { reactive } from "vue";
import type { listDataType, paramsType } from "@/api";
import { relativeCurrentTime } from "@/utils/date";

const data = reactive<listDataType<articleType>>({
  list: [],
  count: 0,
});

const params = reactive<paramsType>({});

async function getData() {
  let res = await articleCollectsApi(params);
  data.list = res.data.list;
  data.count = res.data.count;
}

getData();

function goBack() {
  history.back();
}
</script>
<style lang="scss">
.my_coll_view {
  .banner {
    background-image: url("http://image.fengfengzhidao.com/1001/20231006164747__%E7%BB%BF%E8%89%B2.png");
    height: 200px;
    background-size: cover;
    background-repeat: no-repeat;
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
  }

  .body {
    padding-top: 10px;
    min-height: calc(100vh - 200px);
    background-color: var(--bg);
  }

  .article_list {
    .item {
      width: 100vw;
      overflow: hidden;
      background-color: white;
      padding: 10px;
      margin-top: 10px;

      .title {
        font-size: 18px;

        a {
          color: var(--active);

          em {
            color: red;
          }
        }
      }

      .abstract {
        color: #555;
        margin: 5px 0;
        font-size: 14px;
      }

      .info {
        font-size: 14px;

        span {
          i {
            color: #444;
          }
        }

        .tags {
          margin-left: 10px;

          > span {
            margin-left: 5px;
          }
        }

        .look {
          margin-left: 10px;
        }
      }
    }

    .more {
      margin-top: 10px;
      display: flex;
      justify-content: center;
    }
  }
}
</style>
