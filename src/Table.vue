<script setup lang="ts">
import { ref } from "vue";
import Papa from "papaparse";

const props = defineProps({
  markdown: String,
});

const tableData = ref<string[]>([]);

props.markdown?.split("\n").forEach((item) => {
  tableData.value.push(item);
});

function createColumns() {
  const columns = Papa.parse(tableData.value[0]);
  return columns.data[0];
}

function createData() {
  return tableData.value.slice(1).map((item) => {
    return Papa.parse(item).data[0];
  });
}

const columns = createColumns();
const nodes = createData();
</script>

<template>
  <div class="favorites-card">
    <table>
      <thead>
        <tr>
          <th v-for="column in columns">{{ column }}</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(node, index) in nodes" :key="index">
          <td v-for="column in node">{{ column }}</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<style scoped>
.favorites-card {
  padding: 10px;
  border-radius: 8px;
}
</style>
