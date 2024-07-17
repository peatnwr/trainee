<template>
    <v-container fluid>
        <v-row>
            <v-col cols="12" class="d-flex justify-center">
                <span class="text-h4">Orders</span>
            </v-col>
        </v-row>
        <v-divider class="my-5"></v-divider>
        <v-card>
        <v-card-title>
            <v-text-field
                v-model="search"
                append-icon="mdi-magnify"
                label="Search"
                single-line
                hide-details
            ></v-text-field>
        </v-card-title>
        <v-data-table
            :headers="headers"
            :items="ordersData"
            :items-per-page="10"
            :sort-by="['createdAt']"
            :sort-desc="[true]"
            multi-sort
            :search="search"
            class="elevation-1"
        ></v-data-table>
        </v-card>
    </v-container>
</template>

<script>

import store from '../store/index'

export default {
    data: () => ({
        search: '',
        headers: [
          {
            text: 'Product',
            align: 'start',
            sortable: true,
            value: 'product_name',
          },
          { text: 'Amount', value: 'amount' },
          { text: 'Bought By', value: 'bought_by' },
          { text: 'Bought When', value: 'bought_when' },
        ],
        ordersData: [],
    }),
    created() {
        this.fetchOrdersData();
    },
    methods: {
        async fetchOrdersData() {
            try {
                const res = await this.axios.get('http://localhost:3000/api/v1/orders',
                    {
                        headers: {
                            Authorization : `Bearer ${store.getters['token']}`
                        }
                    },
                );
                this.ordersData = res.data.data.map(item => ({
                    product_name: item.product_name,
                    amount: item.amount,
                    bought_by: item.bought_by,
                    createdAt: item.createdAt,
                    bought_when: this.formatDate(item.createdAt),
                }));
                console.log(this.ordersData);
            } catch (err) {
                console.log(err.messsage);
            }
        },
        formatDate(value) {
            return new Date(value).toLocaleString();
        },
    }
}
</script>

<style>

</style>