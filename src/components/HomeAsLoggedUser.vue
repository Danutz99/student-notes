<template>
    <v-container>
        <v-btn text @click="load()">
            <v-icon>mdi-plus</v-icon>
            Add books and courses</v-btn
        >
        <template v-if="loadCourses">
            <Courses />
        </template>
        <Resources></Resources>
    </v-container>
</template>
<script>
import Resources from '@/components/Resources';
import Courses from '@/components/Courses';

export default {
    name: 'HomeAsLoggedUser',
    components: {
        Resources,
        Courses
    },
    data() {
        return {
            loadCourses: false
        };
    },
    methods: {
        load() {
            this.loadCourses = true;
        }
    }
};
</script>
