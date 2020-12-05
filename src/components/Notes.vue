<template>
    <div class="q-pa-md">
        <v-btn text @click="addNotes = !addNotes">
            <v-icon>mdi-plus</v-icon>
            Add notes</v-btn
        >
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
                    </div>
                </td>
            </template>
            <template v-slot:item.data-table-expand="{ expand, isExpanded }">
                <v-col class="text-right">
                    <v-btn
                        v-if="!isExpanded"
                        icon
                        title="edit"
                        @click="expand(!isExpanded)"
                    >
                        <v-icon>mdi-pencil</v-icon>
                    </v-btn>
                    <v-btn
                        v-if="isExpanded"
                        icon
                        title="cancel"
                        @click="expand(!isExpanded)"
                    >
                        <v-icon>mdi-close-circle</v-icon>
                    </v-btn>
                </v-col>
            </template>
            <template v-slot:item.NoteDate="{ item }">
                <span>{{ dateConverter(item.NoteDate) }}</span>
            </template>
            <template v-slot:item.action="{ item }">
                <v-icon small @click="deleteNote(item)">
                    mdi-delete
                </v-icon>
            </template>
        </v-data-table>
        <v-dialog v-model="addNotes">
            <v-row justify="center">
                <v-card width="800">
                    <v-card-title class="headline">
                        Create new note for {{ course.CourseName }}
                    </v-card-title>
                    <v-card-actions>
                        <v-container>
                            <v-row>
                                <div class="container">
                                    <v-text-field
                                        v-model="newNoteTitle"
                                        label="Title"
                                    />
                                    <v-md-editor
                                        v-model="content"
                                        height="400px"
                                        @save="addNote(content)"
                                    ></v-md-editor>
                                </div>
                            </v-row>
                            <v-spacer></v-spacer>
                            <v-row>
                                <v-btn
                                    color="green darken-1"
                                    text
                                    @click="addNotes = false"
                                >
                                    Cancel
                                </v-btn>
                            </v-row>
                        </v-container>
                    </v-card-actions>
                </v-card>
            </v-row>
        </v-dialog>
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
                },
                {
                    text: 'Title',
                    value: 'NoteTitle',
                    sortable: true
                },
                {
                    text: 'Date',
                    value: 'NoteDate',
                    sortable: true
                },
                { text: 'Action', value: 'action', sortable: false }
            ],
            notes: [],
            errors: [],
            addNotes: false,
            content: '`Hello world!`',
            newNoteTitle: ''
        };
    },
    mounted() {
        this.getNotes();
    },
    methods: {
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
        },
        async addNote(content) {
            this.addNotes = false;
            await axios({
                method: 'post',
                url: 'http://localhost:8000/api/note',
                data: {
                    NoteTitle: this.newNoteTitle,
                    NoteContent: content,
                    CourseId: this.course.CourseId,
                    StudentId: this.$store.state.userId
                },
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            this.newNoteTitle = '';
            this.getNotes();
        },
        getNotes() {
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
        async deleteNote(note) {
            await axios({
                method: 'delete',
                url:
                    'http://localhost:8000/api/student/' +
                    this.$store.state.userId +
                    '/course/' +
                    this.course?.CourseId +
                    '/note/' +
                    note.NoteId,
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            this.getNotes();
        },
        dateConverter(date) {
            return new String(date).replace('T', ' ').split('.')[0];
        }
    }
};
</script>
