<template>
    <v-container fluid>
        <v-row>
            <v-col cols="12" class="d-flex justify-center">
                <span class="text-h4">Products</span>
            </v-col>
            <v-col
                v-if="position"
                cols="12"
            >
                <v-btn
                    color="teal lighten-2"
                    class="white--text"
                    rounded
                    @click="formProduct()"
                >
                    <v-icon class="white--text">mdi-plus-circle</v-icon>
                    Add Product
                </v-btn>
            </v-col>
        </v-row>
        <v-divider class="my-5"></v-divider>
        <v-row>
            <v-col cols="3" v-for="(item, index) in products" :key="index">
                <v-card max-width="500">
                    <v-img
                        height="150"
                        :src="item.img"
                    ></v-img>

                    <v-card-title class="text-h6">
                        {{ item.name }}
                        <v-spacer></v-spacer>
                        <v-menu
                            left
                            bottom
                            v-if="position"
                        >
                            <template v-slot:activator="{ on, attrs }">
                                <v-btn
                                    icon
                                    v-bind="attrs"
                                    v-on="on"
                                >
                                    <v-icon>mdi-dots-vertical</v-icon>
                                </v-btn>
                            </template>

                            <v-list>
                                <v-list-item
                                    @click="formProduct(item._id, item.name, item.price, item.stock, item.detail, item.img)"
                                >
                                    <v-list-item-title>Edit Product</v-list-item-title>
                                </v-list-item>
                            </v-list>
                            <v-list>
                                <v-list-item
                                    @click="deleteProduct(`${ item._id }`)"
                                >
                                    <v-list-item-title>Delete Product</v-list-item-title>
                                </v-list-item>
                            </v-list>
                        </v-menu>
                    </v-card-title>
                    <v-divider></v-divider>
                    <v-card-subtitle class="text-body-2">
                        {{ item.detail }}
                    </v-card-subtitle>
                    <v-card-actions>
                        <v-chip
                            color="teal lighten-2"
                            text-color="white"
                            class="me-1"
                        >
                            <v-avatar left>
                                <v-icon>mdi-currency-usd</v-icon>
                            </v-avatar>
                            {{ item.price }}
                        </v-chip>
                        <v-chip
                            color="blue-grey lighten-2"
                            text-color="white"
                        >
                            <v-avatar left>
                                <v-icon>mdi-package-variant-closed</v-icon>
                            </v-avatar>
                            {{ item.stock }}
                        </v-chip>
                        <v-spacer></v-spacer>
                        <v-btn color="teal" class="white--text" text @click="updateCart( item._id )">
                            <v-icon>mdi-cart-arrow-down</v-icon>
                            Add Cart
                        </v-btn>
                    </v-card-actions>
                </v-card>
            </v-col>
        </v-row>
        <Dialog :value="dialog" :loading="loading" :message="message" @input="dialog = $event" />
        <v-dialog v-model="form_dialog" persistent max-width="600px">
            <v-card>
                <v-card-title>
                    <span class="text-h5">{{ product_id ? "Edit" : "Add" }} Product</span>
                </v-card-title>
                <v-card-text>
                    <v-container>
                        <v-row no-gutters>
                            <v-col cols="12">
                                <v-text-field
                                    v-model="postdata.name"
                                    label="Name *"
                                    required
                                ></v-text-field>
                            </v-col>
                            <v-col cols="12" sm="6" md="6">
                                <v-text-field
                                    v-model="postdata.price"
                                    label="Price"
                                    class="me-5"
                                ></v-text-field>
                            </v-col>
                            <v-col cols="12" sm="6" md="6">
                                <v-text-field
                                    v-model="postdata.stock"
                                    label="Amount"
                                ></v-text-field>
                            </v-col>
                            <v-col cols="12">
                                <v-textarea
                                    v-model="postdata.detail"
                                    label="Detail"
                                ></v-textarea>
                            </v-col>
                            <v-col cols="12">
                                <v-text-field
                                    v-model="postdata.img"
                                    label="Image Link"
                                ></v-text-field>
                            </v-col>
                        </v-row>
                    </v-container>
                    <small class="red--text">*indicates required field</small>
                </v-card-text>
                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn color="red darken-1" text @click="form_dialog = false">
                        Close
                    </v-btn>
                    <v-btn color="blue darken-1" text @click="product_id ? updateProduct(product_id) : createProduct()">
                        {{ product_id ? "Edit" : "Add" }} Product
                    </v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>
    </v-container>
</template>

<script>

import store from '../../store/index'
import Dialog from '../../components/Shared/Dialog.vue'
import { mapActions } from 'vuex'

export default {
    components: {
        Dialog,
    },
    data: () => ({
        form_dialog: false,
        dialog: false,
        loading: true,
        message: "",
        product_id: "",
        postdata: {
            name: "",
            price: null,
            stock: null,
            detail: "",
            img: "",
        },
        postdefault: {
            name: "",
            price: null,
            stock: null,
            detail: "",
            img: "",
        },
        products: [],
        position: store.getters["user"].position,
    }),
    created() {
        this.fetchProducts();
    },
    methods: {
        ...mapActions(['updateCarts']),
        async fetchProducts() {
            try {
                const res = await this.axios.get('http://localhost:3000/api/v1/products',
                    {
                        headers: {
                            Authorization: `Bearer ${store.getters['token']}`
                        },
                    }
                );
                this.products = res.data.data;
            } catch (err) {
                console.log(err.message);
            }
        },
        formProduct (id = null, name = null, price = null, stock = null, detail = null, img = null) {
            if (id) {
                this.form_dialog = true;
                this.product_id = id;
                this.postdata = {
                    name: name,
                    price: price,
                    stock: stock,
                    detail: detail,
                    img: img,
                };
            } else {
                this.form_dialog = true;
                this.product_id = null;
                this.postdata = {...this.postdefault};
            }
        },
        async createProduct () {

            this.dialog = true;
            this.loading = true;
            let status = false;

            try {
                const res = await this.axios.post(`http://localhost:3000/api/v1/products`, this.postdata,
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
                        this.fetchProducts();
                        this.form_dialog = false;
                    }
                }, 1000);
            }
        },
        async updateProduct (id) {

            this.dialog = true;
            this.loading = true;
            let status = false;

            try {
                const res = await this.axios.put(`http://localhost:3000/api/v1/products/${id}`, this.postdata,
                    {
                        headers: {
                            Authorization: `Bearer ${store.getters['token']}`
                        }
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
                        this.fetchProducts();
                        this.form_dialog = false;
                    }
                }, 1000);
            }
        },
        async deleteProduct (id) {

            this.dialog = true;
            this.loading = true;
            let status = false;

            try {
                const res = await this.axios.delete(`http://localhost:3000/api/v1/products/${id}`,
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
                        this.fetchProducts();
                    }
                }, 1000);
            }
        },
        updateCart (id) {
            this.updateCarts(id);
        },
    },
}
</script>

<style>

</style>