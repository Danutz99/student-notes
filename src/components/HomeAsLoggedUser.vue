<template>
    <v-container>
        <template
            v-if="
                Object.keys(getCurrentCourse).length === 0 &&
                    getCurrentCourse.constructor === Object
            "
        >
            <template v-if="!getLoadCourses">
                <v-row>
                    <v-btn text @click="setLoadCourses">
                        <v-icon>mdi-plus</v-icon>
                        Add books and courses</v-btn
                    >
                </v-row>
                <v-spacer />
                <v-row>
                    <v-btn text>
                        <v-icon>mdi-plus</v-icon>
                        Create study group</v-btn
                    >
                </v-row>
            </template>
            <template v-if="getLoadCourses">
                <Courses />
            </template>
            <template v-if="!getLoadCourses">
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
        return {};
    },
    computed: {
        getCurrentCourse() {
            return this.$store?.state?.currentCourse;
        },
        getLoadCourses() {
            return this.$store?.state?.loadCourses;
        }
    },
    methods: {
        async setLoadCourses() {
            await this.$store.dispatch(
                'updateLoadCourses',
                !this.getLoadCourses
            );
        }
    }
};
</script>
