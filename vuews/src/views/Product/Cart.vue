<template >
    <v-container fluid>
        <v-row>
            <v-col cols="12" class="d-flex justify-center">
                <span class="text-h4">Carts</span>
            </v-col>
        </v-row>
        <v-divider class="my-5"></v-divider>
        <v-row>
            <v-col cols="3" v-for="(item, index) in cartsData" :key="index">
                <v-card max-width="500">
                    <v-img height="150" :src="item.img"></v-img>
                    <v-card-title class="text-h6">
                        {{ item.name }}
                        <v-spacer></v-spacer>
                        <v-chip
                            color="teal lighten-2"
                            text-color="white"
                        >
                            <v-avatar left>
                                <v-icon>mdi-currency-usd</v-icon>
                            </v-avatar>
                            {{ postData[index].amount * item.price }}
                        </v-chip>
                    </v-card-title>
                    <v-card-actions>
                        <v-text-field
                            type="number"
                            min="1"
                            :max="item.stock"
                            v-model="postData[index].amount"
                        ></v-text-field>
                        <v-spacer></v-spacer>
                        <v-btn color="red" class="white--text" text @click="delCart(item._id)">
                            <v-icon>mdi-cart-minus</v-icon>
                            Delete
                        </v-btn>
                        <v-btn color="teal" class="white--text" text @click="checkOut(item._id, postData[index].amount)">
                            <v-icon>mdi-cart-check</v-icon>
                            Check out
                        </v-btn>
                    </v-card-actions>
                </v-card>
            </v-col>
        </v-row>
    </v-container>
</template>

<script>

import { mapGetters, mapActions } from 'vuex'
import store from '../../store/index'

export default {
    computed: {
        ...mapGetters(['carts']),
    },
    data: () => ({
        cartsData: [],
        postData: [],
    }),
    created() {
        this.fetchCartsData();
    },
    methods: {
        ...mapActions(['removeItemCarts']),
        async fetchCartsData() {
            for (let i = 0; i < this.carts.length; i++) {
                let res = await this.axios.get(`http://localhost:3000/api/v1/products/${this.carts[i]}`,
                    {
                        headers : {
                            Authorization : `Bearer ${ store.getters['token'] }`
                        }
                    },
                );
                this.cartsData.push(res.data.data);
                this.postData.push({ amount: 1 })
            }
        },
        async checkOut(id, amount) {
            try {
                const res = await this.axios.post(`http://localhost:3000/api/v1/products/${id}/orders`, { amount: amount },
                    {
                        headers : {
                            Authorization : `Bearer ${ store.getters['token'] }`
                        }
                    }
                );
                if (res.status === 200) {
                    this.removeItemCarts(id);
                    this.cartsData = [];
                    this.postData = [];
                    this.fetchCartsData();
                } else {
                    console.log(res.message);
                }
            } catch (err) {
                console.log(err.message);
            }
        },
        delCart(id) {
            this.removeItemCarts(id);
            this.cartsData = [];
            this.postData = [];
            this.fetchCartsData();
        },
    },
}
</script>

<style>

</style>