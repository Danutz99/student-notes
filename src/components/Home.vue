<template>
    <v-container fluid fill-height class="home" style="max-height: 100vh;">
        <v-layout justify-center align-center column pa-5>
            <div class="display-4 font-weight-black white--text text-xs-center">USEFUL MANAGER</div>
            <div class="display-4 font-weight-black white--text text-xs-center mb-3">FOR YOUR NOTES</div>
            <div class="display-1 font-weight-bold white--text text-xs-center">Forget about the pen and the paper, use this app at it's best for your learning needs.</div>
        </v-layout>
    </v-container>
</template>

<script>
export default {
    name: 'Home'
};
</script>

<style scoped>
.home {
    background: url('https://akm-img-a-in.tosshub.com/indiatoday/images/story/202003/learn-3653430_960_720.jpeg?Nlno_3vJQfw7GC0HrYJDiWNzrrTWSxGC&size=770:433');
    background-size: cover;
    width: 100%;
    height: 100%;
}
</style>