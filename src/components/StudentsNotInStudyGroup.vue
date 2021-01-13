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
            v-model="selected"
            show-select
        >
            <!-- <template v-slot:item.remove="{ item }">
                <v-icon small @click="removeStudent(item)">
                    mdi-delete
                </v-icon>
            </template> -->
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
                // {
                //     text: 'Remove',
                //     value: 'remove',
                //     sortable: true
                // }
            ],
            students: [],
            selected: []
        };
    },
    mounted() {
        this.getGroupExternalStudents();
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
        onInvite() {
            this.$emit('close');
        }
        // async removeStudent(student) {
        //     await axios({
        //         method: 'delete',
        //         url:
        //             'http://localhost:8000/api/studyGroup/' +
        //             this.studyGroup?.StudyGroupId +
        //             '/students/' +
        //             student?.StudentId,
        //         headers: {
        //             'Content-Type': 'application/json'
        //         }
        //     });
        //     this.getGroupStudents();
        // }
    }
};
</script>
