import Vue from 'vue'

//Custom Vue directive to transform date type
Vue.directive('date', {
  bind: function (el, binding, vnode) {
    //Getting the value of the input element
    let value = binding.value;
    let date =  new Date(value).getDate();
    let month =  new Date(value).getMonth() + 1;
    //2021 % 100 = 21
    let year =  (new Date(value).getFullYear() % 100);
    let hours =  new Date(value).getHours();
    let minutes =  new Date(value).getMinutes();

      if (date < 10) date = '0' + date;
      if (month < 10) month = '0' + month;
      if (year < 10) year = '0' + year;
      if (hours < 10) hours = '0' + hours;
      if (minutes < 10) minutes = '0' + minutes;
      el.innerText =  date + '.' + month + '.' + year+' '+hours+':'+minutes;
  }
})
