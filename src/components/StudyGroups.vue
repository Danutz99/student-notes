<template>
    <div class="q-pa-md">
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
            <template v-slot:item.delete="{ item }">
                <v-icon small @click="deleteGroup(item)">
                    mdi-delete
                </v-icon>
            </template>
        </v-data-table>
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
        };
    },
    mounted() {},
    methods: {
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
