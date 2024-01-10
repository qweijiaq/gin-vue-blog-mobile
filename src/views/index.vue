<template>
  <div class="base_view index_view">
    <div class="head">
      <Search
        v-model="params.key"
        @search="search"
        placeholder="请输入搜索关键词"
      />
      <Tabs @click-tab="clickTab">
        <Tab
          v-for="item in tagList"
          :title="item.label"
          :name="item.value"
        ></Tab>
      </Tabs>
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
        <div class="more">
          <Button @click="getPage">加载更多</Button>
        </div>
      </div>
    </div>
    <gvb-tabbar></gvb-tabbar>
  </div>
</template>

<script setup lang="ts">
import {
  Button,
  Search,
  showNotify,
  Tab,
  Tabs,
  TextEllipsis,
  Icon,
} from "vant";

import { reactive } from "vue";
import type { articleParamsType, articleType } from "@/api/article";
import { ref } from "vue";
import type { optionType, listDataType } from "@/api";
import { tagOptionsApi } from "@/api/tag";
import { articleListApi } from "@/api/article";
import { relativeCurrentTime } from "@/utils/date";
import GvbTabbar from "@/components/tabbar.vue";

const tagList = ref<optionType[]>([]);

const params = reactive<articleParamsType>({
  key: "",
  limit: 10,
  page: 1,
});

const data = reactive<listDataType<articleType>>({
  list: [],
  count: 0,
});

async function getTags() {
  let res = await tagOptionsApi();
  tagList.value = [{ label: "全部", value: "" }, ...res.data];
}
getTags();

async function getData() {
  let res = await articleListApi(params);
  data.list = res.data.list;
  data.count = res.data.count;
}
getData();

function clickTab({ name }: { name: string }) {
  params.page = 1;
  if (params.tag === name) {
    return;
  }
  params.tag = name;
  getData();
}

function search() {
  getData();
}

async function getPage() {
  (params.page as number) += 1;
  let res = await articleListApi(params);
  if (res.data.list.length === 0) {
    showNotify({ type: "warning", message: "已经到底啦~" });
    return;
  }
  data.list.push(...res.data.list);
  data.count = res.data.count;
}
</script>

<style lang="scss">
.index_view {
  .head {
    position: fixed;
    top: 0;
    background-color: white;
    z-index: 1;
    box-shadow: 2vw 0 2vw 1vw rgba(black, 0.08);

    .van-search {
      width: 100vw;
    }

    .van-tabs {
      width: 100vw;
    }
  }

  .body {
    padding-top: 100px;
    padding-bottom: 80px;
    min-height: 100vh;
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
