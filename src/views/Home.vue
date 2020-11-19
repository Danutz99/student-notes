<template>
    <span>
        <Home></Home>
        <home-details></home-details>
        <Resources></Resources>
    </span>
</template>

<script>
import Home from '@/components/Home';
import HomeDetails from '@/components/HomeDetails';
import Resources from '@/components/Resources';

export default {
    name: 'home',
    components: {
        Home,
        HomeDetails,
        Resources
    }
};
</script>