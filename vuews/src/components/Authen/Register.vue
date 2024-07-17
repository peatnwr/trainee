<template>
    <v-container fluid class="my-6">
        <v-row no-gutters>
            <v-col cols="12" class="text-h6" align="center">
                <span>Register Form</span>
            </v-col>
            <v-col cols="12">
                <v-text-field
                    v-model="postdata.username"
                    :rules="[rules.required]"
                    label="Username"
                ></v-text-field>
            </v-col>
            <v-col cols="12">
                <v-text-field
                    v-model="postdata.name"
                    label="Name"
                ></v-text-field>
            </v-col>
            <v-col cols="12">
                <v-text-field
                    v-model="postdata.password"
                    :append-icon="show_pw ? 'mdi-eye' : 'mdi-eye-off'"
                    :rules="[rules.required]"
                    :type="show_pw ? 'text' : 'password'"
                    name="password"
                    label="Password"
                    hint="At least 8 characters"
                    counter
                    @click:append="show_pw = !show_pw"
                ></v-text-field>
            </v-col>
            <v-col cols="12">
                <v-text-field
                    v-model="postdata.confirm_password"
                    :append-icon="show_cpw ? 'mdi-eye' : 'mdi-eye-off'"
                    :rules="[rules.required]"
                    :type="show_cpw ? 'text' : 'password'"
                    name="confirm_password"
                    label="Confirm Password"
                    hint="At least 8 characters"
                    counter
                    @click:append="show_cpw = !show_cpw"
                ></v-text-field>
            </v-col>
            <v-col class="d-flex justify-center" cols="12">
                <v-btn class="teal lighten-2 white--text" @click="register()">
                    Register
                </v-btn>
            </v-col>
        </v-row>
        <Dialog :value="dialog" :loading="loading" :message="message" @input="dialog = $event" />
    </v-container>
</template>

<script>

import Dialog from '../Shared/Dialog.vue'

export default {
    name: 'Register',
    components: {
        Dialog,
    },
    data: () => ({
        dialog: false,
        loading: true,
        message: "",
        show_pw: false,
        show_cpw: false,
        postdata: {
            username: "",
            name: "",
            password: "",
            confirm_password: "",
        },
        postdefault: {
            username: "",
            name: "",
            password: "",
            confirm_password: "",
        },
        username: "",
        name: "",
        password: "",
        confirm_password: "",
        rules: {
            required: value => !!value || 'Required',
            min: v => v.length >= 8 || 'Min 8 characters'
        }
    }),
    methods: {
        async register () {

            this.dialog = true;
            this.loading = true;
            let status = false;

            try {
                let form = {
                    username: `${this.postdata.username}`,
                    password: `${this.postdata.password}`,
                    name: `${this.postdata.name}`,
                }
                if (this.password === this.confirm_password) {
                    const res = await this.axios.post('http://localhost:3000/api/v1/register', form);
                    status = res.status === 200 ? true : false;
                } else {
                    this.loading = false;
                    this.message = "Password does not match";
                }
            } catch (err) {
                this.loading = false;
                this.message = "Register Failed";
            } finally {
                setTimeout(() => {
                    this.dialog = false;
                    if (status) {
                        this.postdata = {...this.postdefault};
                        this.$emit('register-success');
                        location.reload();
                    }
                }, 1000)
            }
        }
    }
}
</script>

<style>

</style>