<template>
    <v-container>
        <template v-if="!loadCourses">
            <v-btn text @click="load()">
                <v-icon>mdi-plus</v-icon>
                Add books and courses</v-btn
            >
        </template>
        <template v-if="loadCourses">
            <Courses />
        </template>
        <template v-if="!loadCourses">
            <Resources></Resources>
        </template>
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
