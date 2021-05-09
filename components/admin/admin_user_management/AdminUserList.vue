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
        <div class="admin-user-content__email">
          <span>Email: </span>{{ user.email }}
        </div>
        <div v-if="(userId !== '') && (userId !== user.id)">
          <user-state-ban apiPart="blog" :userId="user.id" :ban="user.blogBan" class="admin-user-content__blog-ban">
            <template v-slot:header>
              <h3>Ban user in Blog</h3>
            </template>
          </user-state-ban>
          <user-state-ban apiPart="chat" :userId="user.id" :ban="user.chatBan" class="admin-user-content__blog-ban">
            <template v-slot:header>
              <h3>Ban user in Chat</h3>
            </template>
          </user-state-ban>
        </div>
        <div class="admin-user-content__in-chat">
          <div v-if="user.inChat">
            <span class="in-chat__in">User is chatting</span>
            <i class="el-icon-chat-line-round"></i>
          </div>
          <div v-else>
            <span class="in-chat__out">User is not chatting</span>
            <i class="el-icon-chat-round"></i>
          </div>
        </div>
        <div class="admin-user-content__email-verification">
          <div>
            <span>Whether the email has been verified:</span>
            <span v-if="user.isVerified">Yes</span>
            <span v-else>No</span>
          </div>
          <div v-if="user.isVerified">
            <span>When the email address has been verified:</span>
            <span>{{ new Date(user.verified).toLocaleString() }}</span>
          </div>
        </div>
        <div class="admin-user-content__user-joined">
          <span>The user joined on:</span>
          <span>{{ new Date(user.created).toLocaleString() }}</span>
        </div>
      </el-collapse-item>
    </el-collapse>
    <div v-else-if="users && users.length === 0">There are not users</div>
    <loader v-else></loader>
  </div>
</template>

<script>
import Loader from './../../Loader';
import UserStateBan from './AdminUserListBan';
export default {
  components: { Loader, UserStateBan },
  props: {
    "users": { type: Array, default: [] },
    "userId": { type: String, default: '' }
  },
  data() {
    return {
      activeName: '1'
    };
  },
  methods: {
    handleChange(val) {
      //console.log(val);
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
%admin-user-content{
  border: 1px solid #000;
  background-color: #c0c3e7;
  padding: 1% 2%;
  margin-bottom:.5%;
  font-size: 1.1em;
}
.admin-user-content__email{
  @extend %admin-user-content;
  span{
    font-weight:bold;
  }
}
.admin-user-content__blog-ban{
  @extend %admin-user-content;
  font-size: .9em;
}
.admin-user-content__in-chat{
  @extend %admin-user-content;
  .in-chat__in{
    color: #089b08;
    & + i{
      margin-left: 2%;
      font-size: 1.4em;
      color: #089b08;
    }
  }
  .in-chat__out{
    color: #bd0b0b;
    & + i{
      margin-left: 2%;
      font-size: 1.4em;
      color: #bd0b0b;
    }
  }
}
.admin-user-content__email-verification{
  @extend %admin-user-content;
  & > div:first-child {
    span:first-child{
      font-weight:bold;
    }
    span:last-child{
      padding: .1em .5em;
      font-size: .9em !important;
      border: 1px solid #000;
      background-color: #221f1f;
      border-radius: 10px;
      color:#fff;
      margin-left: 1em;
    }
  }
  & > div:last-child {
    span:first-child{
      font-weight:bold;
    }
    span:last-child{
      font-size: .9em;
      margin-left: 1em;
    }
  }
}
.admin-user-content__user-joined{
  @extend %admin-user-content;
  span:first-child{
    font-weight:bold;
  }
  span:last-child{
    font-size: .9em;
    margin-left: 1em;
  }
}
</style>
