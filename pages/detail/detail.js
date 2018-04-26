//detail.js

Page({
  data:{
    address: "",
  },
  onLoad(options){
    this.setData({
      address: options.address,
    })
    console.log(options.address);
  }

})