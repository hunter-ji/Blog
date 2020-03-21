在vue2中不允许子组件直接修改`props`，为单项数据流，所有若要修改只能通过额外的值，并监听`props`以改变额外的值。

## 一. 设置props

```javascript
props: {
    dialog: {
      type: Boolean,
      default: false
    }
}
```

## 二. 创建额外的值

在`data`中创建一个`localDialog`，其值为`this.dialog`。

```javascript
data() {
    return {
    	localDialog: this.dialog
    }
}
```

## 三. 监听

保持同步的关键在于需要在子组件内监听`props`，即此处的`dialog`。

```javascript
watch: {
    dialog(val) {
      this.localDialog = val
    }
}
```

## 四. 子组件向父组件传递

子组件使用`this.$emit()`即可向父组件传递变化的值。

```javascript
methods: {
    sendToFather() {
        this.$emit('dialogchange', this.localDialog)
    }
}
```

## 五. 父组件调用

```html
<your-component :dialog="dialog" @dialogchange="dialogchange" />
data() {
	return {
        dialog: false
    }
},
methods: {
    dialogchange(val) {
    	this.dialog = val
    }
}
```

## 六. 完整代码

### 1. 子组件

```javascript
<template>
    <div :visible="localDialog">
        justmylife.cc
		<button @click="sendToFather" />
    </div>
</template>

<script>
export default {
	props: {
    	dialog: {
      	type: Boolean,
      	default: false
    	}
	},
	data() {
        return {
            localDialog: this.dialog
        }
    },
    watch: {
   		dialog(val) {
      		this.localDialog = val
    	}
	},
    methods: {
    	sendToFather() {
        	this.$emit('dialogchange', this.localDialog)
    	}
	}
}
</script>
```

### 2. 父组件

```javascript
<template>
    <your-component :dialog="dialog" @dialogchange="dialogchange" />
</template>

<script>
import yourComponent from './yourComponent'

export default {
	components: {
        yourComponent
    },
    data() {
		return {
        	dialog: false
    	}
	},
	methods: {
    	dialogchange(val) {
    		this.dialog = val
    	}
	}
}
</script>
```