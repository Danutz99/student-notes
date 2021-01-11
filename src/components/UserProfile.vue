<template>
    <div>
        <v-avatar size="40">
            <img v-if="user.fL" alt="Avatar" :src="user.fL" />
        </v-avatar>
        <span>{{ user.Ed }}</span>
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
