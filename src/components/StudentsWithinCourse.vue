<template>
    <div class="q-pa-md">
        <v-card-title>
            Students
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
            title="Students"
            :items="students"
            :headers="headers"
            :search="search"
            item-key="StudentId"
            :options.sync="pagination"
            :rows-per-page-options="[300, 200, 100, 50, 10]"
            table-style="overflow-y:hidden;"
            v-model="selectedStudents"
            show-select
        >
        </v-data-table>
        <div class="text-right">
            <template>
                <v-row>
                    <v-col cols="10">
                        <v-btn color="blue darken-1" text @click="onShare">
                            Share
                        </v-btn>
                    </v-col>
                    <v-spacer />
                    <v-col class="text-right">
                        <v-btn color="red darken-1" text @click="onCancel">
                            Cancel
                        </v-btn>
                    </v-col>
                </v-row>
            </template>
        </div>
    </div>
</template>

<script>
import axios from 'axios';

export default {
    name: 'StudentsWithinCourse',
    props: {
        note: {
            type: Object,
            required: true
        }
    },
    data() {
        return {
            search: '',

            pagination: {
                rowsPerPage: 0
            },
            headers: [
                {
                    text: 'Id',
                    value: 'StudentId',
                    sortable: true
                },
                {
                    text: 'Name',
                    value: 'StudentName',
                    sortable: true
                },
                {
                    text: 'Email',
                    value: 'StudentEmail',
                    sortable: true
                }
            ],
            students: [],
            selectedStudents: []
        };
    },
    mounted() {
        this.getStudentsWithinCourse();
    },
    methods: {
        getStudentsWithinCourse() {
            axios
                .get(
                    'http://localhost:8000/api/course/' +
                        +this.note?.CourseId +
                        '/students'
                )
                .then(response => {
                    return (this.students = response.data?.Students.filter(
                        x => x.StudentId !== this.$store.state.userId
                    ));
                })
                .catch(e => {
                    this.errors.push(e);
                });
        },
        onCancel() {
            this.$emit('close');
            this.selectedStudents = [];
        },
        onShare() {
            this.$emit('close');
            let notesToShare = this.selectedStudents.map(x => {
                return {
                    NoteTitle: this.note?.NoteTitle,
                    NoteContent: this.note?.NoteContent,
                    StudentId: x.StudentId,
                    CourseId: this.note?.CourseId
                };
            });
            axios({
                method: 'post',
                url: 'http://localhost:8000/api/notes',
                data: notesToShare,
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            this.selectedStudents = [];
        }
    }
};
</script>
