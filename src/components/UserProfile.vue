<template>
    <div>
        <v-avatar size="40">
            <img v-if="user.iK" alt="Avatar" :src="user.iK" />
        </v-avatar>
        <span>{{ user.Ad }}</span>
    </div>
</template>
<script>
export default {
    props: {
        user: {
            type: Object,
            required: true
        }
    }
};
</script>
