<template>
    <el-form
      ref="ruleForm"
      :model="ruleForm"
      :rules="rules"
      @submit.native.prevent="onSubmit"
      class="user-creation-form"
    >
      <el-form-item label="Login" prop="login">
        <el-input type="text" v-model="ruleForm.login" autocomplete="off"></el-input>
      </el-form-item>
      <div class="user-creation-form-email">
        <el-form-item label="Email (click the button to generate a random email)" prop="email">
          <el-input readonly type="email" v-model="ruleForm.email" autocomplete="off"></el-input>
        </el-form-item>
        <el-button plain
          :disabled="isEmailBtnActive"
          class="user-creation-form-email__btn"
          v-on:click="generateEmail">Generate e-mail</el-button>
      </div>
      <el-form-item label="Password" prop="pass">
        <el-input type="password" v-model="ruleForm.pass" autocomplete="off"></el-input>
      </el-form-item>
      <el-form-item label="Confirm password" prop="checkPass" class="confirm-pass">
        <el-input type="password" v-model="ruleForm.checkPass" autocomplete="off"></el-input>
      </el-form-item>
      <el-select v-model.trim="activeRole" class="user-creation-form__select">
        <el-option v-for="item in roles" :key="item.activeRole"
          :label="item.labelRole"
          :value="item.activeRole">
        </el-option>
      </el-select>
      <el-form-item>
        <el-button type="primary" native-type="submit" plain :loading="loading">
          Create
        </el-button>
      </el-form-item>
    </el-form>
</template>

<script>
import { mapMutations } from 'vuex';
export default {
  data () {
    var validatePass = (rule, value, callback) => {
        if (value === '') {
          callback(new Error('Please input the password'));
        } else {
          if (this.ruleForm.checkPass !== '') {
            this.$refs.ruleForm.validateField('checkPass');
          }
          callback();
        }
      };
      var validatePass2 = (rule, value, callback) => {
        if (value === '') {
          callback(new Error('Please input the password again'));
        } else if (value !== this.ruleForm.pass) {
          callback(new Error('Two inputs don\'t match!'));
        } else {
          callback();
        }
      };
    return {
      loading: false,
      roles: [
        { activeRole: 'guest', labelRole: 'Guest' },
        { activeRole: 'moderator', labelRole: 'Moderator' }
      ],
      activeRole: 'guest',
      ruleForm: {
        login:'',
        email:'',
        pass: '',
        checkPass: ''
      },
      rules: {
        login: [
          { required: true, message: 'Please input Activity login', trigger: 'blur' },
          { min: 3, max: 15, message: 'Length should be 3 to 15', trigger: 'blur' }
        ],
        email: [
          { required: true, message: 'Please input email address', trigger: 'change' },
          { type: 'email', message: 'Please input correct email address', trigger: ['change'] }
        ],
        pass: [
          { required: true, validator: validatePass, trigger: 'blur' },
          { min: 5, max: 12, message: 'Length should be 5 to 12', trigger: 'blur' }
        ],
        checkPass: [
          { required: true, validator: validatePass2, trigger: 'blur' },
          { min: 5, max: 12, message: 'Length should be 5 to 12', trigger: 'blur' }
        ]
      }
    }
  },
  computed:{
    isEmailBtnActive(){
      return this.ruleForm.login.length < 3 ? true : false;
    }
  },
  methods: {
    ...mapMutations('error',['setError']),
    generateEmail(){
      const numbers = [0,1,2,3,4,5,6,7,8,9];
      const alphabet = ['a','b','c','d','e','f','g','h','i','j','k','l','m','n','o','p','q','r','s','t','u','v','w','x','y','z'];
      const charsAndNums = alphabet.concat(numbers);
      const random = [];
      //
      for(let i = 0;i < 10;i++){
        let ind = Math.round(Math.random() * (charsAndNums.length-1));
        random.push(charsAndNums[ind]);
      }
      let email = `access_${this.ruleForm.login}-${random.join('')}@admin.vip`
      //console.log("Test ",'access_');
      this.ruleForm.email = email;
    },
    onSubmit () {
      this.$refs.ruleForm.validate(async (valid) => {
        if (valid) {
          this.loading = true;
          // Prepare form data
          const formData = {
            login: this.ruleForm.login,
            email: this.ruleForm.email,
            password: this.ruleForm.pass,
            passwordConfirmation: this.ruleForm.checkPass,
            acceptTerms: true,
            role: this.activeRole,
            registeredByAdmin: true,
            verified: Date.now()
          }
          try {
            const result = await this.$axios.post('/api/auth/admin/user/create',formData);
            if(!!result.data.userInfo && (result.status === 201)){
              this.$message({
                showClose: true,
                message: result.data.message,
                type: 'success'
              });
              return;
            }
            throw new Error("Can\'t create new user");
          } catch (e) {
            //This is a Mutation, call it and pass the error
            this.setError(e);
            //this.loading = false
          }finally{
            this.ruleForm.login = "";
            this.ruleForm.email = "";
            this.ruleForm.pass = "";
            this.ruleForm.checkPass = "";
            this.activeRole = "guest";
            this.loading = false;
          }
        } else {
          //This is a Mutation, call it and pass the error
          this.setError('Form is invalid');
        }
      })
    }
  }
}
</script>

<style lang="scss">
.user-creation-form{
  max-width: 600px;
  margin: 0 auto;
}
.user-creation-form-email{
  background-color: #b5d1f5;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  .el-form-item{
    width:55%;
    margin-left:2%;
    .el-form-item__label{
      font-size: 0.8em;
    }
    .el-form-item__content{
      width:90%;
    }
  }
  .user-creation-form-email__btn{
    height:20%;
    margin:7% 2% 0 0;
  }
}
.user-creation-form__select{
  margin-bottom:1rem;
}
</style>
