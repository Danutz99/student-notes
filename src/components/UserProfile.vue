<template>
    <div>
        <v-row>
            <v-col cols="2">
                <v-avatar size="40">
                    <img v-if="user.fL" alt="Avatar" :src="user.fL" />
                </v-avatar>
            </v-col>
            <v-col cols="6">
                {{ user.Ed }}
            </v-col>
            <v-col cols="4">
                <v-badge
                    :content="invitations.length"
                    :value="invitations.length"
                    color="red"
                    overlap
                >
                    <v-icon color="blue" large>
                        mdi-bell
                    </v-icon>
                </v-badge>
            </v-col>
        </v-row>
    </div>
</template>
<script>
import axios from 'axios';

export default {
    props: {
        user: {
            type: Object,
            required: true
        }
    },
    data() {
        return {
            errors: [],
            invitations: []
        };
    },
    mounted() {
        this.getInvitations();
    },
    methods: {
        getInvitations() {
            axios
                .get(
                    'http://localhost:8000/api/student/' +
                        this.$store.state.userId +
                        '/invitation'
                )
                .then(response => {
                    return (this.invitations = response.data);
                })
                .catch(e => {
                    this.errors.push(e);
                });
        }
    }
};
</script>
