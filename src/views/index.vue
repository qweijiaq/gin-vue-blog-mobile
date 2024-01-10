<template>
  <div class="base_view index_view">
    <div class="head">
      <Search v-model="params.key" placeholder="请输入搜索关键词" />
      <Tabs @click-tab="clickTab">
        <Tab
          v-for="item in tagList"
          :title="item.label"
          :name="item.value"
        ></Tab>
      </Tabs>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Search } from "vant";
import { Tab, Tabs } from "vant";

import { reactive } from "vue";
import type { articleParamsType, articleType } from "@/api/article";
import { ref } from "vue";
import type { optionType, listDataType } from "@/api";
import { tagOptionsApi } from "@/api/tag";
import { articleListApi } from "@/api/article";

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
</script>

<style lang="scss"></style>
