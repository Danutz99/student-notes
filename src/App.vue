<template>
    <v-app>
        <AppNavigation></AppNavigation>
        <v-main transition="slide-x-transition">
            <router-view></router-view>
        </v-main>
    </v-app>
</template>

<script>
import AppNavigation from '@/components/AppNavigation';
// import HomeAsLoggedUser from '@/components/HomeAsLoggedUser';
export default {
    name: 'App',
    components: {
        AppNavigation
        // HomeAsLoggedUser
    }
};
</script>

<style></style>
