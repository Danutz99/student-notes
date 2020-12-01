<template>
    <v-container>
        <template
            v-if="
                Object.keys(getCurrentCourse).length === 0 &&
                    getCurrentCourse.constructor === Object
            "
        >
            <template v-if="!loadCourses">
                <v-btn text @click="loadCourses = !loadCourses">
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
        </template>
        <template v-else>
            <Notes :course="getCurrentCourse" />
        </template>
    </v-container>
</template>
<script>
import Resources from '@/components/Resources';
import Courses from '@/components/Courses';
import Notes from '@/components/Notes';

export default {
    name: 'HomeAsLoggedUser',
    components: {
        Resources,
        Courses,
        Notes
    },
    data() {
        return {
            loadCourses: false
        };
    },
    computed: {
        getCurrentCourse() {
            return this.$store?.state?.currentCourse;
        }
    },
    methods: {
        load() {
            this.loadCourses = true;
        }
    }
};
</script>
