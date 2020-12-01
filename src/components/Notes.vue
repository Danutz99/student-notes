<template>
    <div class="q-pa-md">
        <v-card-title>
            Your notes for {{ course.CourseName }}
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
            title="Notes"
            :items="notes"
            :headers="headers"
            :search="search"
            item-key="NoteId"
            :options.sync="pagination"
            :rows-per-page-options="[300, 200, 100, 50, 10]"
            table-style="overflow-y:hidden;"
            show-expand
        >
            <template #expanded-item="notes">
                <td :colspan="notes.headers.length">
                    <div class="container">
                        <v-md-editor
                            v-model="notes.item.NoteContent"
                            height="400px"
                            @save="save(notes.item)"
                        ></v-md-editor>
                        <!-- <vue-simple-markdown :source="notes.item.NoteContent"></vue-simple-markdown> -->
                    </div>
                    <!-- {{ notes.item.NoteContent }} -->
                </td>
            </template>
        </v-data-table>
        <!-- <v-dialog v-model="dialog" max-width="300">
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
        </v-dialog> -->
    </div>
</template>

<script>
import axios from 'axios';

export default {
    name: 'Notes',
    props: {
        course: {
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
                    value: 'NoteId',
                    sortable: true
                }
            ],
            notes: [],
            errors: [],
            selectedCourse: {},
            dialog: false,
            source: '`Hello world!`'
        };
    },
    mounted() {
        axios
            .get(
                'http://localhost:8000/api/student/' +
                    this.$store.state.userId +
                    '/course/' +
                    this.course?.CourseId +
                    '/notes'
            )
            .then(response => {
                return (this.notes = response.data);
            })
            .catch(e => {
                this.errors.push(e);
            });
    },
    methods: {
        // onClick(course) {
        //     this.selectedCourse = course;
        //     this.dialog = true;
        // },
        // addCourse() {
        //     axios({
        //         method: 'post',
        //         url: 'http://localhost:8000/api/courseStudent',
        //         data: {
        //             CourseId: this.selectedCourse.CourseId,
        //             StudentId: this.$store.state.userId
        //         },
        //         headers: {
        //             'Content-Type': 'application/json'
        //         }
        //     });
        //     this.dialog = false;
        // }
        save(note) {
            console.log('Saved note...', note.NoteContent);
            axios({
                method: 'put',
                url:
                    'http://localhost:8000/api/student/' +
                    this.$store.state.userId +
                    '/course/' +
                    this.course?.CourseId +
                    '/note/' +
                    note.NoteId,
                data: {
                    NoteContent: note.NoteContent
                },
                headers: {
                    'Content-Type': 'application/json'
                }
            });
        }
    }
};
</script>
