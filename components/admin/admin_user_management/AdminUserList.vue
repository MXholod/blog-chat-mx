<template>
  <div>
    <el-collapse v-if="users && users.length > 0" accordion v-model="activeName" @change="handleChange" class="admin-user-list">
      <el-collapse-item v-for="user in users" :name="user.id" :key="user.id"
        :class="{ 'admin': (user.role === 'admin'),
                  'moderator': (user.role === 'moderator'),
                  'guest': (user.role === 'guest') }"
        >
        <template slot="title">
          <i class="header-icon el-icon-user"></i>
          <span class="admin-user-header-login">{{ user.login }}</span>
          <span class="admin-user-header-role">{{ user.role }}</span>
          <div class="admin-user-header-created" v-if="user.registeredByAdmin">
            User created by admin:
            <i  class="header-icon el-icon-medal"></i>
          </div>
        </template>
        <div>Email: {{ user.email }}</div>
        <div>Consistent with real life: in line with the process and logic of real life, and comply with languages and habits that the users are used to;</div>
        <div>Consistent within interface: all elements should be consistent, such as: design style, icons and texts, position of elements, etc.</div>
      </el-collapse-item>
    </el-collapse>
    <div v-else-if="users && users.length === 0">There are not users</div>
    <loader v-else></loader>
  </div>
</template>

<script>
import Loader from './../../Loader';
export default {
  components: { Loader },
  props: {
    "users": { type: Array, default: [] }
  },
  data() {
    return {
      activeName: '1',
      /*[
        { id: 1, login : "John", email : "kjkjjlj@ukr.net" },
        { id: 2, login : "Bob", email : "hjhjhj@ukr.net" },
        { id: 3, login : "Jane", email : "popopo@ukr.net" },
        { id: 4, login : "Sarah", email : "opopoppo@ukr.net" }
      ]*/
    };
  },
  methods: {
    handleChange(val) {
      console.log(val);
    }
  }
}
</script>

<style lang="scss">
%user-item-header{
  .header-icon{
    padding-left:2%;
  }
  .admin-user-header-login{
    padding-left:2%;
    display:inline-block;
    width:20%;
  }
  .admin-user-header-role{
    padding:0 1%;
    display:inline-block;
    width:15%;
  }
  .admin-user-header-created{
    color:#af0606;
    .header-icon{
     padding-left:0;
     font-weight: bold;
    }
  }
}
.admin-user-list{
  width: 80%;
  margin: 2% auto 0;
}
.admin{
  .el-collapse-item__header{
    background-color: #6aa8fa !important;
    @extend %user-item-header;
  }
  .el-collapse-item__content{
    background-color: lighten(#6aa8fa, 25%);
    padding:2%;
  }
}
.moderator{
  .el-collapse-item__header{
    background-color: #89eb80 !important;
    @extend %user-item-header;
  }
  .el-collapse-item__content{
    background-color: lighten(#89eb80, 20%);
    padding:2%;
  }
}
.guest{
  .el-collapse-item__header{
    background-color: #e2f3bc !important;
    @extend %user-item-header;
  }
  .el-collapse-item__content{
    background-color: lighten(#e2f3bc, 10%);
    padding:2%;
  }
}
</style>
