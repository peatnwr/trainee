<template>
    <div id="app" class="d-flex justify-center my-auto mx-auto">
        <v-form>
            <v-container fluid>
                <v-card>
                    <v-tabs
                        fixed-tabs
                        background-color="teal"
                        dark
                        v-model="activeTab"
                    >
                        <v-tab>Login</v-tab>
                        <v-tab>Register</v-tab>
                    </v-tabs>
                    <v-tabs-items v-model="activeTab">
                        <v-tab-item>
                            <login />
                        </v-tab-item>
                        <v-tab-item>
                            <register @register-success="onRegisterSuccess" />
                        </v-tab-item>
                    </v-tabs-items>
                </v-card>
            </v-container>
        </v-form>
    </div>
</template>

<script>
import Login from '../components/Authen/Login.vue'
import Register from '../components/Authen/Register.vue'

export default {
    name: 'Authen',
    data: () => ({
        activeTab: 0
    }),
    components: {
        Login,
        Register,
    },
    methods: {
        onRegisterSuccess() {
            this.activeTab = 0;
        }
    }
}
</script>

<style>

</style>