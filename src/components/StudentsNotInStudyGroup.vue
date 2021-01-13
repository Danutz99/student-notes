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
                        <v-btn color="blue darken-1" text @click="onInvite">
                            Invite
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
    name: 'StudentsNotInStudyGroup',
    props: {
        studyGroup: {
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
            selectedStudents: [],
            loggedInStudent: {}
        };
    },
    mounted() {
        this.getGroupExternalStudents();
        this.getLoggedInStudent();
    },
    methods: {
        getGroupExternalStudents() {
            axios
                .get(
                    'http://localhost:8000/api/studyGroup/' +
                        +this.studyGroup?.StudyGroupId +
                        '/students/external'
                )
                .then(response => {
                    return (this.students = response.data);
                })
                .catch(e => {
                    this.errors.push(e);
                });
        },
        onCancel() {
            this.$emit('close');
        },
        async getLoggedInStudent() {
            await axios
                .get(
                    'http://localhost:8000/api/student/' +
                        this.$store.state.userId
                )
                .then(response => {
                    this.loggedInStudent = response.data;
                })
                .catch(e => {
                    this.errors.push(e);
                });
        },
        onInvite() {
            this.$emit('close');
            this.selectedStudents = this.selectedStudents.map(x => {
                return {
                    StudentId: x.StudentId,
                    InviterId: this.$store.state.userId,
                    InviterName: this.loggedInStudent?.StudentName,
                    StudyGroupId: this.studyGroup?.StudyGroupId,
                    StudyGroupName: this.studyGroup?.StudyGroupName
                };
            });
            axios({
                method: 'post',
                url: 'http://localhost:8000/api/invitation',
                data: this.selectedStudents,
                headers: {
                    'Content-Type': 'application/json'
                }
            });
        }
    }
};
</script>
