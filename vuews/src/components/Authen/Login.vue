<template>
    <v-container fluid class="my-6">
        <v-row no-gutters>
            <v-col cols="12" class="text-h6" align="center">
                <span>Login Form</span>
            </v-col>
            <v-col cols="12">
                <v-text-field
                    v-model="username"
                    label="Username"
                    :rules="[rules.required]"
                ></v-text-field>
            </v-col>
            <v-col cols="12">
                <v-text-field
                    v-model="password"
                    :append-icon="show ? 'mdi-eye' : 'mdi-eye-off'"
                    :rules="[rules.required]"
                    :type="show ? 'text' : 'password'"
                    name="password"
                    label="Password"
                    hint="At least 8 characters"
                    counter
                    @click:append="show = !show"
                ></v-text-field>
            </v-col>
            <v-col class="d-flex justify-center" cols="12">
                <v-btn class="teal lighten-2 white--text" @click="login()">
                    Login
                </v-btn>
            </v-col>
        </v-row>
        <Dialog :value="dialog" :loading="loading" :message="message" @input="dialog = $event" />
    </v-container>
</template>

<script>

import Dialog from '../Shared/Dialog.vue'

export default {
    name: 'Login',
    components: {
        Dialog,
    },
    data: () => ({
        dialog: false,
        loading: true,
        message: "",
        show: false,
        username: "",
        password: "",
        rules: {
            required: value => !!value || 'Required',
            min: v => v.length >= 8 || 'Min 8 characters'
        }
    }),
    methods: {
        async login () {

            this.dialog = true;
            this.loading = true;
            let status = false;

            try {
                let form = {
                    username: `${this.username}`,
                    password: `${this.password}`,
                }
                if (this.username && this.password) {
                    const res = await this.axios.post('http://localhost:3000/api/v1/login', form);
                    status = res.status === 200 ? true : false;
                    this.$store.commit("SET_TOKEN", res.data.data.token);
                    this.$store.commit("SET_AUTH", true);
                    this.$store.commit("SET_USER", { name: res.data.data.name, position: res.data.data.position });
                } else {
                    this.loading = false;
                    this.message = "Username and password is required";
                }
            } catch (err) {
                this.loading = false;
                this.message = err.response.data.message;
            } finally {
                setTimeout(() => {
                    this.dialog = false;
                    if (status) {
                        this.$router.push('/dashboard');
                    }
                }, 1000)
            }
        }
    }
}
</script>

<style>

</style>