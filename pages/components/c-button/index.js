// pages/components/c-button/index.js
Component({
  externalClasses: ['c-class'],

  options: {
    addGlobalClass: true,
  },

  /**
   * 组件的属性列表
   */
  properties: {
    text:{
      type: String,
      value: "按钮"
    },
    type:{
      type: String,
      value: "default"
    },
    loading: {
      type: Boolean,
      value: false
    },
    disabled: {
      type: Boolean,
      value: false
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    
  },

  /**
   * 组件的方法列表
   */
  methods: {

  }
})
