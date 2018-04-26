//index.js
const utilMd5 = require("../../utils/md5.js")
const accessKey = "HNxuTqkPyEbdVxC6";
const secretKey = "98c8f848cfe940ab90be494be41a3885";
let timestamp = Date.parse(new Date());
let signature = utilMd5.md5(secretKey + timestamp + accessKey);
console.log(signature);

Page({
  data: {
    categoryList: [
      { key: 'Politics', display: '时政' },
      { key: 'World', display: '国际' },
      { key: 'Finance', display: '财经' },
      { key: 'Entertainment', display: '娱乐' },
      { key: 'Military', display: '军事' },
      { key: 'Sport', display: '体育' },
      { key: 'Tech', display: '科技' },
      { key: 'Society', display: '社会' },
      { key: 'Living', display: '生活' },
    ],
    activeCategory: null,
    newsList: []
  },

  onChangeCategory(event) {
    const newCategory = event.target.dataset.category
    if (!!newCategory && newCategory !== this.data.activeCategory) {
      this.setData(
        {
          activeCategory: newCategory
        },
        // category 变更完成之后，刷新首页数据
        this.loadData.bind(this)
      )
    }
  },

  onLoad() {
    this.setData(
      {
        activeCategory: this.data.categoryList[0].key
      },
      this.loadData.bind(this)
    )
  },

  onPullDownRefresh() {
    // 下拉刷新时，更新数据
    // 并在数据更新完成之后，关闭下拉状态
    this.loadData(wx.stopPullDownRefresh)
  },

  loadData(callback) {
    const category = this.data.activeCategory
    if (!!category) {
      const callbackWrap = () => {
        if (!!callback) {
          callback()
        }
      }

      wx.showLoading({
        title: '加载中'
      })
      wx.request({
        url: "https://api.xinwen.cn/news/all",
        data: {
          'access_key': accessKey,
          'timestamp': Date.parse(new Date()),
          'signature': utilMd5.md5(secretKey + Date.parse(new Date()) + accessKey),
          'category': category,
          'size':10,
        },
        success: res => {
          let result = res.data.data.news;
          //console.log(result);
          let newsList = [];
          for(let i = 0; i < 10; i++){
            newsList.push({
              title: result[i].title,
              source: result[i].source,
              address: result[i].url,
              firstImage: (result[i].thumbnail_img.length) ? result[i].thumbnail_img[0] : `../../image/${category}-bg.jpg`,
              id: result[i].news_id
            })
          }
          console.log(newsList);
        this.setData({ newsList }, callbackWrap)
         console.log(newsList);
         wx.showToast({
           title: '更新成功',
           duration: 1000
         })
         callbackWrap()
        },
        fail() {
          wx.showToast({
            icon: 'none',
            title: '加载数据异常，请稍后重试',
            duration: 1000
          })
          callbackWrap()
        }
      })
    }
  }
})
