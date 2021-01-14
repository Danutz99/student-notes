<template>
    <div class="q-pa-md">
        <v-card-title>
            Study groups
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
            title="Study groups"
            :items="studyGroups"
            :headers="headers"
            :search="search"
            item-key="StudyGroupId"
            :options.sync="pagination"
            :rows-per-page-options="[300, 200, 100, 50, 10]"
            table-style="overflow-y:hidden;"
            v-model="selectedGroups"
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
                }
            ],
            studyGroups: [],
            selectedGroups: []
        };
    },
    mounted() {
        this.getStudyGroupsWithinCourse();
    },
    methods: {
        getStudyGroupsWithinCourse() {
            const userId = this.$store.state.userId;
            axios
                .get(
                    'http://localhost:8000/api/student/' +
                        userId +
                        '/course/' +
                        this.note?.CourseId +
                        '/studyGroups'
                )
                .then(response => {
                    return (this.studyGroups = response.data);
                })
                .catch(e => {
                    this.errors.push(e);
                });
        },
        onCancel() {
            this.$emit('close');
            this.selectedGroups = [];
        },
        onShare() {
            this.$emit('close');
            axios({
                method: 'post',
                url: 'http://localhost:8000/api/note/studyGroups',
                data: {
                    noteToShare: this.note,
                    studyGroups: this.selectedGroups
                },
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            this.selectedGroups = [];
        }
    }
};
</script>
