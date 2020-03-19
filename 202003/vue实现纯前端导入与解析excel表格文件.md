## 一. 场景

前端导入excel表格，直接前端解析文件，将数据传给后端。



## 二. 需要的库

### 1. 安装

```bash
npm install xlsx
```

### 2. 使用

```javascript
import XLSX from "xlsx";
```



## 三. 代码实现

### 1. html部分

```html
    <div class="container">
      {{ upload_file || "导入" }}
      <input
        type="file"
        accept=".xls,.xlsx"
        class="upload_file"
        @change="readExcel($event)"
      />
    </div>
  </div>
```



### 2. JS部分

```javascript
readExcel(e) {
      // 读取表格文件
      let that = this;
      const files = e.target.files;
      if (files.length <= 0) {
        return false;
      } else if (!/\.(xls|xlsx)$/.test(files[0].name.toLowerCase())) {
        this.$message({
          message: "上传格式不正确，请上传xls或者xlsx格式",
          type: "warning"
        });
        return false;
      } else {
        // 更新获取文件名
        that.upload_file = files[0].name;
      }

      const fileReader = new FileReader();
      fileReader.onload = ev => {
        try {
          const data = ev.target.result;
          const workbook = XLSX.read(data, {
            type: "binary"
          });
          const wsname = workbook.SheetNames[0]; //取第一张表
          const ws = XLSX.utils.sheet_to_json(workbook.Sheets[wsname]); //生成json表格内容
					console.log(ws);
        } catch (e) {
          return false;
        }
      };
      fileReader.readAsBinaryString(files[0]);
    }
```



### 3. 整体代码

```vue
<template>
  <div>
    <div class="container">
      {{ upload_file || "导入" }}
      <input
        type="file"
        accept=".xls,.xlsx"
        class="upload_file"
        @change="readExcel($event)"
      />
    </div>
  </div>
</template>

<script>
import XLSX from "xlsx";

export default {
  data() {
    return {
      upload_file: "",
      lists: []
    };
  },
  methods: {
    submit_form() {
      // 给后端发送请求，更新数据
      console.log("假装给后端发了个请求...");
    },
    readExcel(e) {
      // 读取表格文件
      let that = this;
      const files = e.target.files;
      if (files.length <= 0) {
        return false;
      } else if (!/\.(xls|xlsx)$/.test(files[0].name.toLowerCase())) {
        this.$message({
          message: "上传格式不正确，请上传xls或者xlsx格式",
          type: "warning"
        });
        return false;
      } else {
        // 更新获取文件名
        that.upload_file = files[0].name;
      }

      const fileReader = new FileReader();
      fileReader.onload = ev => {
        try {
          const data = ev.target.result;
          const workbook = XLSX.read(data, {
            type: "binary"
          });
          const wsname = workbook.SheetNames[0]; //取第一张表
          const ws = XLSX.utils.sheet_to_json(workbook.Sheets[wsname]); //生成json表格内容
          that.lists = [];
          // 从解析出来的数据中提取相应的数据
          ws.forEach(item => {
            that.lists.push({
              username: item["用户名"],
              phone_number: item["手机号"]
            });
          });
          // 给后端发请求
          this.submit_form();
        } catch (e) {
          return false;
        }
      };
      fileReader.readAsBinaryString(files[0]);
    }
  }
};
</script>

```



## 四. 样式

原本的文件上传样式可能会跟页面整体风格不搭，所以需要修改其样式。不过此处并不是直接修改其样式而是通过写一个`div`来覆盖原有的上传按钮。此处样式与`element UI`中的`primary`按钮样式相同。

实现该样式的关键在于`.upload_file`的`opacity`和`position`。

```css
.container {
  border: none;
  border-radius: 4px;
  background-color: #409eff;
  height: 40px;
  margin-top: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0 15px;
  min-width: 80px;
  *zoom: 1;
}

.upload_file {
  font-size: 20px;
  opacity: 0;
  position: absolute;
  filter: alpha(opacity=0);
  width: 60px;
}
```



## 五. 最后

前端的日益强大导致很多功能都可以在前端去直接实现，并且可以减少服务器压力。

当然单纯地去实现这样的数据传输，尤其对于重要数据，是很不安全的，因此在前后端数据传输的时候，可以加上加密校验，这个后期会来写的。



## 六. 参考文章

为了实现该功能参考了如下大佬的文章：

* [【Vue 笔记】Vue 读取excel数据并生成数组](https://www.wikimoe.com/?post=157)
* [vue前端导入并解析excel表格操作指南](https://qxiaomay.github.io/2018/07/13/vue%E5%89%8D%E7%AB%AF%E5%AF%BC%E5%85%A5%E5%B9%B6%E8%A7%A3%E6%9E%90excel%E8%A1%A8%E6%A0%BC%E6%93%8D%E4%BD%9C%E6%8C%87%E5%8D%97/)
* [css input[type=file] 样式美化，input上传按钮美化](https://www.haorooms.com/post/css_input_uploadmh)