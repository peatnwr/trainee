<template>
    <div>
        <v-app-bar
            app
            color="teal lighten-2"
            dark
        >
            <v-app-bar-nav-icon @click="drawer = true"></v-app-bar-nav-icon>
            <v-btn text color="rgb(0, 0, 0, 0)" :to="{ name: 'dashboard' }">
                <v-toolbar-title class="white--text">Mother made Restaurant</v-toolbar-title>
            </v-btn>
            <v-spacer></v-spacer>
            <span class="text-body-1">{{ user.name }}</span>
            <v-divider class="mx-3" vertical></v-divider>
            <v-btn class="me-1" icon
                :to="{ name: 'cart' }"
            >
                <v-badge
                    :content="cartCount"
                    :value="cartCount"
                    color="red"
                >
                    <v-icon>mdi-cart</v-icon>
                </v-badge>
            </v-btn>
        </v-app-bar>

        <v-navigation-drawer
            v-model="drawer"
            color="teal lighten-2"
            app
            temporary
        >
            <v-list-item>
                <v-list-item-content>
                    <v-list-item-title class="text-h6 white--text">
                        Mother made Restaurant
                    </v-list-item-title>
                    <v-list-item-subtitle class="white--text">
                        A la cart
                    </v-list-item-subtitle>
                </v-list-item-content>
            </v-list-item>

            <v-divider></v-divider>

            <v-list
                nav
                dense
            >
                <v-list-item
                    v-for="item in menus"
                    :key="item.title"
                    link
                    :to="{ name: `${ item.link }` }"
                    class="white--text"
                >
                    <v-list-item-icon>
                        <v-icon class="white--text">{{ item.icon }}</v-icon>
                    </v-list-item-icon>
                    <v-list-item-content>
                        <v-list-item-title>{{ item.title }}</v-list-item-title>
                    </v-list-item-content>
                </v-list-item>
                <v-list-item
                    v-if="user.position"
                    link
                    :to="{ name: 'approval' }"
                    class="white--text"
                >
                    <v-list-item-icon>
                        <v-icon class="white--text">mdi-account-check</v-icon>
                    </v-list-item-icon>
                    <v-list-item-content>
                        <v-list-item-title>Approval</v-list-item-title>
                    </v-list-item-content>
                </v-list-item>
            </v-list>
            <template v-slot:append>
                <v-divider></v-divider>
                <v-list-item @click.prevent="logout()">
                    <v-list-item-icon>
                        <v-icon class="white--text">mdi-logout</v-icon>
                    </v-list-item-icon>
                    <v-list-item-content>
                        <v-list-item-title class="white--text">Logout</v-list-item-title>
                    </v-list-item-content>
                </v-list-item>
            </template>
        </v-navigation-drawer>
        <v-main>
            <router-view />
        </v-main>
    </div>
</template>

<script>

import { mapGetters } from 'vuex'

export default {
    computed: {
        ...mapGetters(['user', 'carts']),
        cartCount () {
            return this.carts.length;
        }
    },
    data: () => ({
        drawer: false,
        menus: [
            { title: 'Dashboard', icon: 'mdi-view-dashboard', link: 'dashboard' },
            { title: 'Store', icon: 'mdi-store', link: 'store' },
            { title: 'Orders', icon: 'mdi-order-bool-ascending', link: 'orders' },
        ],
    }),
    methods: {
        logout() {
            this.$store.dispatch("resetUser").then(() => {
                this.$router.push('/').then(() => {
                    location.reload();
                });
            });
        },
    }
}
</script>

<style>

</style>