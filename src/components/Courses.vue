<template>
    <div class="q-pa-md">
        <v-card-title>
            Available Courses
            <v-spacer></v-spacer>
            <v-text-field
                v-model="search"
                append-icon="mdi-magnify"
                label="Search"
                single-line
                hide-details
            ></v-text-field>
        </v-card-title>
        <v-data-table
            title="Available Courses"
            :items="courses"
            :headers="headers"
            :search="search"
            item-key="CourseId"
            :options.sync="pagination"
            :rows-per-page-options="[300, 200, 100, 50, 10]"
            table-style="overflow-y:hidden;"
            @click:row="onClick"
        >
        </v-data-table>
        <v-dialog v-model="dialog" max-width="300">
            <v-row justify="center">
                <v-card>
                    <v-card-title class="headline">
                        Add {{ selectedCourse.CourseName }} to my courses?
                    </v-card-title>
                    <v-card-actions>
                        <v-spacer></v-spacer>
                        <v-btn
                            color="green darken-1"
                            text
                            @click="dialog = false"
                        >
                            No
                        </v-btn>
                        <v-btn color="green darken-1" text @click="addCourse()">
                            Yes
                        </v-btn>
                    </v-card-actions>
                </v-card>
            </v-row>
        </v-dialog>
    </div>
</template>

<script>
import axios from 'axios';

export default {
    name: 'Courses',
    data() {
        return {
            search: '',

            pagination: {
                rowsPerPage: 0
            },
            headers: [
                {
                    text: 'Name',
                    value: 'CourseName',
                    sortable: true
                },
                {
                    text: 'Tag',
                    value: 'CourseTag',
                    sortable: true
                }
            ],
            courses: [],
            errors: [],
            selectedCourse: {},
            dialog: false
        };
    },
    mounted() {
        axios
            .get('http://localhost:8000/api/courses')
            .then(response => {
                return (this.courses = response.data);
            })
            .catch(e => {
                this.errors.push(e);
            });
    },
    methods: {
        onClick(course) {
            this.selectedCourse = course;
            this.dialog = true;
        },
        addCourse() {
            axios({
                method: 'post',
                url: 'http://localhost:8000/api/courseStudent',
                data: {
                    CourseId: this.selectedCourse.CourseId,
                    StudentId: this.$store.state.userId
                },
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            this.dialog = false;
        }
    }
};
</script>
