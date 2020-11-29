<template>
    <div class="q-pa-md">
        <v-card-title>
            Available Courses
            <v-spacer></v-spacer>
        </v-card-title>
        <v-data-table
            title="Available Courses"
            :items="courses"
            :headers="headers"
            item-key="CourseId"
            :options.sync="pagination"
            :rows-per-page-options="[300, 200, 100, 50, 10]"
            table-style="overflow-y:hidden;"
            show-expand
        >
            <template #expanded-item="courses">
                <td :colspan="courses.headers.length">
                    {{ courses.item }}
                </td>
            </template>
        </v-data-table>
    </div>
</template>

<script>
import axios from 'axios';

export default {
    name: 'Courses',
    data() {
        return {
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
            errors: []
        };
    },
    mounted() {
        axios
            .get('http://localhost:8000/api/courses')
            .then(response =>
                // JSON responses are automatically parsed.
                {
                    return (this.courses = response.data);
                }
            )
            .catch(e => {
                this.errors.push(e);
            });
    },
    methods: {}
};
</script>
