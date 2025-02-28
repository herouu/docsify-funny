<script setup lang="ts">
import JSZip from "jszip";
import { parse } from "@plist/binary.parse";
import { nextTick, ref } from "vue";

const props = defineProps({
  fileUrl: String,
  id: String,
});

const dom = ref();
const svgWidth = ref();
const svgHeight = ref();

interface PlistDict {
  $objects?: any[];
}

async function parsePlist(buffer: ArrayBuffer) {
  const dict = parse(buffer) as PlistDict;

  // 定义一个数组，用于存储曲线上的点的位置
  let curvesPoints: number[] = [];
  // 定义一个数组，用于存储每条曲线的点的数量
  let curvesNumPoints: number[] = [];
  // 定义一个数组，用于存储每条曲线的宽度
  let curvesWidth: number[] = [];
  // 定义一个数组，用于存储每条曲线的分数宽度
  // let curvesFractionalWidths: number[] = []
  // 存储每条曲线的颜色
  let curvesColors: String[] = [];
  dict.$objects?.forEach((item) => {
    if (typeof item !== "object") {
      return;
    }

    if (item.curvespoints) {
      curvesPoints = unpackStruct(item.curvespoints);
    }
    if (item.curvesnumpoints) {
      curvesNumPoints = unpackStruct(item.curvesnumpoints, "int32");
    }
    if (item.curveswidth) {
      curvesWidth = unpackStruct(item.curveswidth);
    }
    if (item.curvescolors) {
      // 转16进制字符串
      curvesColors = unpackStruct(item.curvescolors, "uint32").map((item) => {
        return `#${item.toString(16).padStart(8, "0")}`;
      });
    }
    // if (item.curvesfractionalwidths) {
    //   curvesFractionalWidths = unpackStruct(item.curvesfractionalwidths)
    // }
  });

  let xPoints = [],
    yPoints = [];

  for (const [x, y] of chunks(curvesPoints)) {
    xPoints.push(x);
    yPoints.push(y);
  }

  svgWidth.value = Math.round(Math.max(...xPoints));
  svgHeight.value = Math.round(Math.max(...yPoints));
  const svg: string[] = [];

  let totalNumPoints = 0;
  for (let i = 0; i < curvesNumPoints.length; i++) {
    const numPoints = curvesNumPoints[i];
    const xSubPoints = xPoints.slice(
      totalNumPoints,
      totalNumPoints + numPoints
    );
    const ySubPoints = yPoints.slice(
      totalNumPoints,
      totalNumPoints + numPoints
    );

    const commands: string[] = [];

    for (let j = 0; j < xSubPoints.length; j++) {
      if (j > 0) {
        commands.push(
          `M ${xSubPoints[j]} ${ySubPoints[j]} L ${xSubPoints[j - 1]} ${
            ySubPoints[j - 1]
          }`
        );
      }
    }
    svg.push(
      `<path d="${commands.join(" ")}" stroke="${
        curvesColors[i]
      }" stroke-width="${curvesWidth[i]}"/>`
    );
    totalNumPoints += numPoints;
  }
  const svgContent = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${
    svgWidth.value
  } ${svgHeight.value}" preserveAspectRatio="xMidYMid meet">${svg.join(
    ""
  )}</svg>`;
  const blob = new Blob([svgContent], { type: "image/svg+xml" });
  dom.value.querySelector("object").data = URL.createObjectURL(blob);
  await nextTick(() => {
    const ele = document.getElementById(props.id!);
    if (ele) {
      document.getElementById(props.id!)!.replaceChildren(dom.value);
    }
  });
}

function arrayBufferToHex(buffer) {
  // 创建一个 Uint8Array 视图来访问 ArrayBuffer 中的每个字节
  const uint8Array = new Uint8Array(buffer);
  let hexString = "";

  // 遍历 Uint8Array 中的每个字节
  for (let i = 0; i < uint8Array.length; i++) {
    // 将每个字节转换为两位十六进制字符串
    const hex = uint8Array[i].toString(16).padStart(2, "0");
    // 拼接十六进制字符串
    hexString += hex;
  }
  return hexString;
}

function dataViewToHex(dataView) {
  let hexString = "";
  // 遍历 DataView 中的每个字节
  for (let i = 0; i < dataView.byteLength; i++) {
    // 读取当前字节
    const byte = dataView.getUint8(i);
    // 将字节转换为两位十六进制字符串
    const hexByte = byte.toString(16).padStart(2, "0");
    // 拼接十六进制字符串
    hexString += hexByte;
  }
  return hexString;
}

function* chunks(array: any[], size: number = 2): IterableIterator<any[]> {
  for (let i = 0; i < array.length; i += size) {
    yield array.slice(i, i + size);
  }
}

function unpackStruct(value: ArrayBuffer, unit: string = "float32"): number[] {
  const dataView = new DataView(value);
  const result: number[] = [];
  const elementSize = unit === "f" ? 4 : 4; // Assuming 'f' for float32 and 'i' for int32, both are 4 bytes

  for (let i = 0; i < value.byteLength; i += elementSize) {
    if (unit === "float32") {
      result.push(dataView.getFloat32(i, true)); // true for little-endian
    } else if (unit === "int32") {
      result.push(dataView.getInt32(i, true)); // true for little-endian
    } else if (unit === "uint32") {
      result.push(dataView.getUint32(i, false));
    }
  }
  return result;
}

// 解析.note zip文件
async function parseNoteFile(fileUrl: string) {
  const fileContent = await fetch(fileUrl).then((response) => response.blob());
  const file = new File([fileContent], "file.note", {
    type: "application/zip",
  });
  const blob = await unzipFile(file);
  // 处理plist 文件
  await parsePlist(blob);
}

async function unzipFile(file: File): Promise<ArrayBuffer> {
  const zip = new JSZip();
  const content = await file.arrayBuffer();
  const result = await zip.loadAsync(content, {
    base64: false,
    checkCRC32: true,
  });

  for (const filename in result.files) {
    if (!result.files[filename].dir) {
      if (filename.endsWith("Session.plist")) {
        return await result.files[filename].async("arraybuffer");
      }
    }
  }
  throw new Error("No Session.plist file found in the zip file.");
}

if (props.fileUrl) {
  parseNoteFile(props.fileUrl);
}
</script>

<template>
  <div ref="dom" class="notability-svg">
    <object type="image/svg+xml" style="margin: auto; display: block"></object>
  </div>
</template>

<style scoped>
.notability-svg {
  width: 100%;
  height: 100%;
}

.notability-svg > object,
.notability-svg > object svg {
  width: 100%;
  height: 100%;
}
</style>
