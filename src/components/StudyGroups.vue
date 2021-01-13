<template>
    <div class="q-pa-md">
        <!-- <v-row>
            <v-btn text @click="addNotes = !addNotes">
                <v-icon>mdi-plus</v-icon>
                Add notes</v-btn
            >
        </v-row>

        <v-spacer />
        <template v-if="studyGroups.length === 0">
            <v-row>
                <v-btn text>
                    <v-icon>mdi-plus</v-icon>
                    Create study group</v-btn
                >
            </v-row>
        </template>
        <template v-else>
            <v-row>
                <v-btn text @click="viewGroups = !viewGroups">
                    <v-icon>mdi-account-group-outline</v-icon>
                    View study groups</v-btn
                >
            </v-row>
        </template> -->
        <!-- <template v-if="!viewGroups"> -->
        <v-card-title>
            Your study groups for
            {{ course.CourseName + ' - ' + course.CourseTag }}
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
            title="Study Groups"
            :items="studyGroups"
            :headers="headers"
            :search="search"
            item-key="StudyGroupId"
            :options.sync="pagination"
            :rows-per-page-options="[300, 200, 100, 50, 10]"
            table-style="overflow-y:hidden;"
            show-expand
        >
            <template #expanded-item="studyGroups">
                <td :colspan="studyGroups.headers.length">
                    <StudyGroupStudents :studyGroup="studyGroups.item" />
                </td>
            </template>
            <!-- <template
                    v-slot:item.data-table-expand="{ expand, isExpanded }"
                >
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
                </template> -->
            <!-- <template v-slot:item.NoteDate="{ item }">
                    <span>{{ dateConverter(item.NoteDate) }}</span>
                </template>
                <template v-slot:item.action="{ item }">
                    <v-icon small @click="deleteNote(item)">
                        mdi-delete
                    </v-icon>
                </template> -->
            <template v-slot:item.delete="{ item }">
                <v-icon small @click="deleteGroup(item)">
                    mdi-delete
                </v-icon>
            </template>
        </v-data-table>
        <!-- </template> -->
        <!-- <v-dialog v-model="addNotes">
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
        </v-dialog> -->
    </div>
</template>

<script>
import axios from 'axios';
import StudyGroupStudents from '@/components/StudyGroupStudents';

export default {
    name: 'StudyGroups',
    components: {
        StudyGroupStudents
    },
    props: {
        studyGroups: {
            type: Array,
            required: true
        },
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
                    value: 'StudyGroupId',
                    sortable: true
                },
                {
                    text: 'Name',
                    value: 'StudyGroupName',
                    sortable: true
                },
                {
                    text: 'Description',
                    value: 'StudyGroupDescription',
                    sortable: true
                },
                { text: 'Delete', value: 'delete', sortable: false }
            ]
            // notes: [],
            // errors: [],
            // addNotes: false,
            // content: '`Hello world!`',
            // newNoteTitle: '',
            // studyGroups: [],
            // viewGroups: false
        };
    },
    mounted() {
        // this.getNotes();
        // this.getCourseStudyGroups();
    },
    methods: {
        // save(note) {
        //     console.log('Saved note...', note.NoteContent);
        //     axios({
        //         method: 'put',
        //         url:
        //             'http://localhost:8000/api/student/' +
        //             this.$store.state.userId +
        //             '/course/' +
        //             this.course?.CourseId +
        //             '/note/' +
        //             note.NoteId,
        //         data: {
        //             NoteContent: note.NoteContent
        //         },
        //         headers: {
        //             'Content-Type': 'application/json'
        //         }
        //     });
        // },
        // async addNote(content) {
        //     this.addNotes = false;
        //     await axios({
        //         method: 'post',
        //         url: 'http://localhost:8000/api/note',
        //         data: {
        //             NoteTitle: this.newNoteTitle,
        //             NoteContent: content,
        //             CourseId: this.course.CourseId,
        //             StudentId: this.$store.state.userId
        //         },
        //         headers: {
        //             'Content-Type': 'application/json'
        //         }
        //     });
        //     this.newNoteTitle = '';
        //     this.getNotes();
        // },
        // getNotes() {
        //     axios
        //         .get(
        //             'http://localhost:8000/api/student/' +
        //                 this.$store.state.userId +
        //                 '/course/' +
        //                 this.course?.CourseId +
        //                 '/notes'
        //         )
        //         .then(response => {
        //             return (this.notes = response.data);
        //         })
        //         .catch(e => {
        //             this.errors.push(e);
        //         });
        // },
        // getCourseStudyGroups() {
        //     axios
        //         .get(
        //             'http://localhost:8000/api/course/' +
        //                 this.course?.CourseId +
        //                 '/studyGroups'
        //         )
        //         .then(response => {
        //             return (this.studyGroups = response.data);
        //         })
        //         .catch(e => {
        //             this.errors.push(e);
        //         });
        // },
        // async deleteNote(note) {
        //     await axios({
        //         method: 'delete',
        //         url:
        //             'http://localhost:8000/api/student/' +
        //             this.$store.state.userId +
        //             '/course/' +
        //             this.course?.CourseId +
        //             '/note/' +
        //             note.NoteId,
        //         headers: {
        //             'Content-Type': 'application/json'
        //         }
        //     });
        //     this.getNotes();
        // },
        // dateConverter(date) {
        //     return new String(date).replace('T', ' ').split('.')[0];
        // }
        async deleteGroup(studyGroup) {
            await axios({
                method: 'delete',
                url:
                    'http://localhost:8000/api/studyGroup/' +
                    studyGroup?.StudyGroupId,
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            this.$emit('onDelete');
        }
    }
};
</script>
