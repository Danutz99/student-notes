<template>
    <div>
        <v-row>
            <v-col cols="2">
                <v-avatar size="40">
                    <img v-if="user.fL" alt="Avatar" :src="user.fL" />
                </v-avatar>
            </v-col>
            <v-col cols="6">
                {{ user.Ed }}
            </v-col>
            <v-col cols="4">
                <v-badge
                    :content="invitations.length"
                    :value="invitations.length"
                    color="red"
                    overlap
                >
                    <v-icon
                        color="blue"
                        large
                        @click="showNotifications = !showNotifications"
                    >
                        mdi-bell
                    </v-icon>
                </v-badge>
            </v-col>
        </v-row>
        <template v-if="invitations.length != 0">
            <v-dialog v-model="showNotifications">
                <v-row justify="center">
                    <v-card width="700">
                        <v-card-title class="headline">
                            Study groups invitations
                        </v-card-title>
                        <v-card-actions>
                            <v-container>
                                <v-list>
                                    <v-list-item
                                        v-for="(invitation, i) in invitations"
                                        :key="i"
                                    >
                                        <v-list-item-content>
                                            <v-row>
                                                <v-col cols="8">
                                                    <v-list-item-title
                                                        v-text="
                                                            'Invitation to ' +
                                                                invitation.StudyGroupName +
                                                                ' from ' +
                                                                invitation.InviterName
                                                        "
                                                    ></v-list-item-title>
                                                </v-col>
                                                <v-col cols="2">
                                                    <v-btn
                                                        text
                                                        color="blue darken-1"
                                                        @click="
                                                            onJoin(invitation)
                                                        "
                                                        >Join</v-btn
                                                    >
                                                </v-col>
                                                <v-col cols="2">
                                                    <v-btn
                                                        text
                                                        color="red darken-1"
                                                        @click="
                                                            onDecline(
                                                                invitation
                                                            )
                                                        "
                                                        >Decline</v-btn
                                                    >
                                                </v-col>
                                            </v-row>
                                        </v-list-item-content>
                                    </v-list-item>
                                </v-list>
                            </v-container>
                        </v-card-actions>
                    </v-card>
                </v-row>
            </v-dialog>
        </template>
    </div>
</template>
<script>
import axios from 'axios';

export default {
    props: {
        user: {
            type: Object,
            required: true
        }
    },
    data() {
        return {
            errors: [],
            invitations: [],
            showNotifications: false,
            studyGroup: {}
        };
    },
    mounted() {
        this.getInvitations();
    },
    methods: {
        getInvitations() {
            axios
                .get(
                    'http://localhost:8000/api/student/' +
                        this.$store.state.userId +
                        '/invitation'
                )
                .then(response => {
                    return (this.invitations = response.data);
                })
                .catch(e => {
                    this.errors.push(e);
                });
        },
        async removeInvitation(invitation) {
            await axios({
                method: 'delete',
                url:
                    'http://localhost:8000/api/invitation/' +
                    invitation?.InvitationId,
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            this.getInvitations();
            if (this.invitations.length === 0) this.showNotifications = false;
        },
        async onDecline(invitation) {
            await this.removeInvitation(invitation);
        },
        async onJoin(invitation) {
            await axios({
                method: 'post',
                url: 'http://localhost:8000/api/studyGroupStudent',
                data: {
                    StudyGroupId: invitation?.StudyGroupId,
                    StudentId: invitation?.StudentId
                },
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            await axios
                .get(
                    'http://localhost:8000/api/studyGroup/' +
                        invitation?.StudyGroupId
                )
                .then(response => {
                    return (this.studyGroup = response.data);
                })
                .catch(e => {
                    this.errors.push(e);
                });
            await axios({
                method: 'post',
                url: 'http://localhost:8000/api/courseStudent',
                data: {
                    CourseId: this.studyGroup?.CourseId,
                    StudentId: invitation?.StudentId
                },
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            await this.removeInvitation(invitation);
        }
    }
};
</script>
