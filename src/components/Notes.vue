<template>
    <div class="q-pa-md">
        <template v-if="!viewGroups">
            <v-row>
                <v-btn text @click="addNotes = !addNotes">
                    <v-icon>mdi-plus</v-icon>
                    Add notes</v-btn
                >
            </v-row>
        </template>

        <v-spacer />
        <v-row>
            <template v-if="studyGroups.length === 0 || viewGroups">
                <v-btn text @click="createStudyGroup = !createStudyGroup">
                    <v-icon>mdi-plus</v-icon>
                    Create study group</v-btn
                >
            </template>

            <template v-else>
                <v-btn text @click="viewGroups = !viewGroups">
                    <v-icon>mdi-account-group-outline</v-icon>
                    View study groups</v-btn
                >
            </template>
        </v-row>
        <template>
            <v-row>
                <template v-if="viewGroups">
                    <v-btn text @click="viewGroups = !viewGroups">
                        <v-icon>mdi-close</v-icon>
                        Close</v-btn
                    >
                </template>
            </v-row>
        </template>
        <template v-if="!viewGroups">
            <v-card-title>
                Your notes for
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
                <template
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
                </template>
                <template v-slot:item.NoteDate="{ item }">
                    <span>{{ dateConverter(item.NoteDate) }}</span>
                </template>
                <template v-slot:item.remove="{ item }">
                    <v-icon small @click="deleteNote(item)">
                        mdi-delete
                    </v-icon>
                </template>
                <template v-slot:item.share="{ item }">
                    <v-icon small @click="shareNote(item)">
                        mdi-share-variant-outline
                    </v-icon>
                </template>
            </v-data-table>
        </template>
        <template v-else>
            <StudyGroups
                :studyGroups="studyGroups"
                :course="course"
                @onDelete="getCourseStudyGroups()"
            />
        </template>
        <v-dialog v-model="addNotes">
            <v-row justify="center">
                <v-card width="800">
                    <v-card-title class="headline">
                        Create new note for
                        {{ course.CourseName + ' - ' + course.CourseTag }}
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
        <v-dialog v-model="createStudyGroup">
            <v-row justify="center">
                <v-card width="800">
                    <v-card-title class="headline">
                        Create new study group for
                        {{ course.CourseName + ' - ' + course.CourseTag }}
                    </v-card-title>
                    <v-card-actions>
                        <v-container>
                            <v-row>
                                <div class="container">
                                    <v-text-field
                                        v-model="studyGroupName"
                                        label="Name"
                                        clearable
                                    />
                                    <v-text-field
                                        v-model="studyGroupDescription"
                                        label="Description"
                                        clearable
                                    />
                                </div>
                            </v-row>
                            <v-spacer></v-spacer>
                            <v-row>
                                <v-btn
                                    color="blue darken-1"
                                    text
                                    @click="createNewStudyGroup()"
                                >
                                    Create
                                </v-btn>
                                <v-btn
                                    color="red darken-1"
                                    text
                                    @click="createStudyGroup = false"
                                >
                                    Cancel
                                </v-btn>
                            </v-row>
                        </v-container>
                    </v-card-actions>
                </v-card>
            </v-row>
        </v-dialog>
        <v-dialog v-model="share">
            <v-row justify="center">
                <v-card width="450">
                    <v-card-title class="headline">
                        Share with
                    </v-card-title>
                    <v-card-actions>
                        <v-container>
                            <v-row>
                                <div class="container">
                                    <v-btn
                                        color="blue darken-1"
                                        text
                                        @click="
                                            shareWithCourseCollegues = true;
                                            share = false;
                                        "
                                    >
                                        Your collegues
                                    </v-btn>
                                    <v-btn
                                        color="blue darken-1"
                                        text
                                        @click="
                                            shareWithCourseStudyGroups = true;
                                            share = false;
                                        "
                                    >
                                        Your study groups
                                    </v-btn>
                                </div>
                            </v-row>
                        </v-container>
                    </v-card-actions>
                </v-card>
            </v-row>
        </v-dialog>
        <v-dialog v-model="shareWithCourseCollegues">
            <v-row justify="center">
                <v-card width="800">
                    <v-card-title class="headline">
                        Share
                        {{ noteToShare.NoteTitle }} note
                    </v-card-title>
                    <v-card-actions>
                        <v-container>
                            <v-row>
                                <div class="container">
                                    <StudentsWithinCourse
                                        :note="noteToShare"
                                        @close="
                                            shareWithCourseCollegues = false
                                        "
                                    />
                                </div>
                            </v-row>
                        </v-container>
                    </v-card-actions>
                </v-card>
            </v-row>
        </v-dialog>
        <v-dialog v-model="shareWithCourseStudyGroups">
            <v-row justify="center">
                <v-card width="800">
                    <v-card-title class="headline">
                        Share
                        {{ noteToShare.NoteTitle }} note
                    </v-card-title>
                    <v-card-actions>
                        <v-container>
                            <v-row>
                                <div class="container">
                                    <StudyGroupsWithinCourse
                                        :note="noteToShare"
                                        @close="
                                            shareWithCourseStudyGroups = false
                                        "
                                    />
                                </div>
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
import StudyGroups from '@/components/StudyGroups';
import StudentsWithinCourse from '@/components/StudentsWithinCourse';
import StudyGroupsWithinCourse from '@/components/StudyGroupsWithinCourse';

export default {
    name: 'Notes',
    components: {
        StudyGroups,
        StudentsWithinCourse,
        StudyGroupsWithinCourse
    },
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
                { text: 'Remove', value: 'remove', sortable: false },
                { text: 'Share', value: 'share', sortable: false }
            ],
            notes: [],
            errors: [],
            addNotes: false,
            content: '`Hello world!`',
            newNoteTitle: '',
            studyGroups: [],
            viewGroups: false,
            createStudyGroup: false,
            studyGroupName: '',
            studyGroupDescription: '',
            noteToShare: {},
            share: false,
            shareWithCourseCollegues: false,
            shareWithCourseStudyGroups: false
        };
    },
    mounted() {
        this.getNotes();
        this.getCourseStudyGroups();
    },
    methods: {
        save(note) {
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
            this.getCourseStudyGroups();
            this.getNotes();
        },
        async createNewStudyGroup() {
            this.createStudyGroup = false;
            let studyGroupId = null;
            await axios({
                method: 'post',
                url: 'http://localhost:8000/api/studyGroups',
                data: {
                    StudyGroupName: this.studyGroupName,
                    StudyGroupDescription: this.studyGroupDescription,
                    CourseId: this.course.CourseId
                },
                headers: {
                    'Content-Type': 'application/json'
                }
            })
                .then(response => {
                    studyGroupId = response.data.StudyGroupId;
                })
                .catch(error => {
                    console.log(error);
                });
            await axios({
                method: 'post',
                url: 'http://localhost:8000/api/studyGroupStudent',
                data: {
                    StudyGroupId: studyGroupId,
                    StudentId: this.$store.state.userId
                },
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            this.studyGroupName = '';
            this.studyGroupDescription = '';
            this.getCourseStudyGroups();
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
        getCourseStudyGroups() {
            axios
                .get(
                    'http://localhost:8000/api/course/' +
                        this.course?.CourseId +
                        '/studyGroups'
                )
                .then(response => {
                    return (this.studyGroups = response.data);
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
        },
        shareNote(note) {
            this.noteToShare = note;
            this.share = true;
        }
    }
};
</script>
