<template>
  <v-container fluid>
    <v-row>
        <v-col cols="12" class="d-flex justify-center">
            <span class="text-h4">Unapproved users</span>
        </v-col>
    </v-row>
    <v-divider class="my-5"></v-divider>
    <v-row>
        <v-col cols="3" v-for="(item, index) in unapproved_users" :key="index">
            <v-card max-width="500">
                <v-card-title class="text-h6">
                    {{ item.name }}
                </v-card-title>
                <v-divider></v-divider>
                <v-card-subtitle class="text-body-1">Detail</v-card-subtitle>
                <v-card-text class="text-subtitle1">
                    Username : {{ item.username }} <br>
                    Created Date: {{ formatDate(item.createdAt) }}
                </v-card-text>
                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn color="teal" class="white--text" text @click="approveUser(item._id)">
                        <v-icon>mdi-account-check</v-icon>
                        Approve
                    </v-btn>
                </v-card-actions>
            </v-card>
        </v-col>
    </v-row>
    <Dialog :value="dialog" :loading="loading" :message="message" @input="dialog = $event" />
  </v-container>
</template>

<script>

import store from '../store/index'
import Dialog from '../components/Shared/Dialog.vue'

export default {
    components: {
        Dialog,
    },
    data: () => ({
        unapproved_users: [],
        dialog: false,
        loading: true,
        message: "",
    }),
    created() {
        this.fetchUnapproveUsers();
    },
    methods: {
        async fetchUnapproveUsers() {
            try {
                const res = await this.axios.get('http://localhost:3000/api/v1/users/unapprove',
                    {
                        headers : {
                            Authorization: `Bearer ${store.getters['token']}`
                        },
                    }
                );
                this.unapproved_users = res.data.data;
            } catch (err) {
                console.log(err.message);
            }
        },
        formatDate(value) {
            return new Date(value).toLocaleString();
        },
        async approveUser(id) {

            this.dialog = true;
            this.loading = true;
            let status = false;

            try {
                const res = await this.axios.put(`http://localhost:3000/api/v1/approve/${id}`, {},
                    {
                        headers: {
                            Authorization: `Bearer ${store.getters['token']}`
                        },
                    }
                );
                status = res.status === 200 ? true : false;
            } catch (err) {
                this.loading = false;
                console.log(err.message);
            } finally {
                setTimeout(() => {
                    this.dialog = false;
                    if (status) {
                        this.fetchUnapproveUsers();
                    }
                }, 1000);
            }
        },
    },
    filters: {
        
    }
}
</script>

<style>

</style>