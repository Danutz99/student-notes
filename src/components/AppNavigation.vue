<template>
    <span>
        <template v-if="loggedIn">
            <v-navigation-drawer
                app
                v-model="drawer"
                class="white lighten-2"
                dark
                disable-resize-watcher
                :mini-variant="miniVariant"
                :clipped="clipped"
                permanent
            >
                <template>
                    <UserProfile :user="googleUser" />
                </template>
                <v-list>
                    <template>
                        <v-expansion-panels accordion focusable>
                            <v-expansion-panel
                                v-for="(item, index) in items"
                                :key="index"
                                :class="{ 'blue lighten-2': true }"
                                @click="getUserCourses"
                            >
                                <v-expansion-panel-header>
                                    <v-icon>{{ item.icon }}</v-icon>
                                    {{ item.title }}
                                </v-expansion-panel-header>
                                <v-expansion-panel-content>
                                    <template
                                        v-if="
                                            userCourses.length != 0 &&
                                                item.title === 'Courses'
                                        "
                                    >
                                        <v-list>
                                            <v-list-item
                                                v-for="(course,
                                                i) in userCourses"
                                                :key="i"
                                                @click="handleCourse(course)"
                                            >
                                                <v-list-item-content>
                                                    <v-list-item-title
                                                        v-text="
                                                            course.CourseName +
                                                                ' - ' +
                                                                course.CourseTag
                                                        "
                                                    ></v-list-item-title>
                                                </v-list-item-content>
                                            </v-list-item>
                                        </v-list>
                                    </template>
                                    <template v-else>
                                        {{ item.content }}
                                    </template>
                                </v-expansion-panel-content>
                            </v-expansion-panel>
                        </v-expansion-panels>
                        <!-- <v-divider :key="`divider-${index}`"></v-divider> -->
                    </template>
                </v-list>
            </v-navigation-drawer>
        </template>

        <v-app-bar :clipped-left="clipped" fixed color="white" app>
            <template v-if="loggedIn">
                <v-btn icon @click.stop="miniVariant = !miniVariant">
                    <v-icon
                        >mdi-{{
                            `chevron-${miniVariant ? 'right' : 'left'}`
                        }}</v-icon
                    >
                </v-btn>
                <v-btn icon @click.stop="clipped = !clipped">
                    <v-icon>mdi-application</v-icon>
                </v-btn>
            </template>
            <v-btn icon @click.stop="fixed = !fixed">
                <v-icon>mdi-minus</v-icon>
            </v-btn>
            <v-toolbar-title v-text="appTitle" />
            <v-spacer />
            <!-- <v-btn icon>
        <v-icon>mdi-menu</v-icon>
      </v-btn> -->
            <template v-if="!loggedIn">
                <v-btn text class="hidden-sm-and-down" @click="logIn()"
                    >LOG IN</v-btn
                >
            </template>
            <template v-if="!loggedIn">
                <v-dialog v-model="dialog" max-width="300">
                    <v-row justify="center">
                        <v-card height="300">
                            <v-card-title class="headline">
                                Sign in
                            </v-card-title>
                            <v-card-actions>
                                <GoogleLogin
                                    :params="params"
                                    :renderParams="renderParams"
                                    :onSuccess="onSuccess"
                                    :onFailure="onFailure"
                                    >Login</GoogleLogin
                                >
                            </v-card-actions>
                        </v-card>
                    </v-row>
                </v-dialog>
            </template>
            <template v-else>
                <!-- <GoogleLogin
                    :params="params"
                    :logoutButton="true"
                    @click="logOut()"
                    >Logout</GoogleLogin
                > -->
                <v-btn text @click="logOut()">Logout</v-btn>
            </template>
            <!-- <v-btn text color="blue lighten-3" class="hidden-sm-and-down"
                >JOIN</v-btn
            > -->
        </v-app-bar>
        <!-- <v-toolbar app color="blue darken-4" dark> -->
        <!-- <v-toolbar-side-icon
                class="hidden-md-and-up"
                @click="drawer = !drawer"
            ></v-toolbar-side-icon> -->
        <!-- <v-spacer class="hidden-md-and-up"></v-spacer>
            <v-toolbar-title>{{ appTitle }}</v-toolbar-title>
            <v-btn text class="hidden-sm-and-down" icon>
                <v-icon>mdi-menu</v-icon>
            </v-btn>
            <v-spacer class="hidden-sm-and-down"></v-spacer> -->
        <!-- <v-btn text class="hidden-sm-and-down">SIGN IN</v-btn>
            <v-btn color="brown lighten-3" class="hidden-sm-and-down"
                >JOIN</v-btn
            > -->
        <!-- </v-toolbar> -->
        <v-footer :absolute="!fixed" app>
            <span
                >Student Notes &copy; {{ new Date().getFullYear() }} All rights
                reserved</span
            >
        </v-footer>
    </span>
</template>

<script>
import GoogleLogin from 'vue-google-login';
import UserProfile from '../components/UserProfile.vue';
import axios from 'axios';

export default {
    name: 'AppNavigation',
    data() {
        return {
            appTitle: 'Student Notes',
            drawer: false,
            miniVariant: false,
            clipped: false,
            fixed: false,
            rightDrawer: false,
            items: [
                {
                    title: 'Courses',
                    icon: 'mdi-folder',
                    content: 'No course added for now.'
                },
                {
                    title: 'Books',
                    icon: 'mdi-book-open',
                    content: 'No book added for now.'
                },
                {
                    title: 'To Study',
                    icon: 'mdi-file',
                    content: 'No resource added to study for now.'
                },
                {
                    title: 'Recents',
                    icon: 'mdi-timelapse',
                    content: 'No recent viewed resources.'
                },
                { title: 'Uploads', icon: 'mdi-upload', content: 'No uploads.' }
            ],
            params: {
                client_id:
                    '761938028069-n402gl1os21gh2ibre7sp858av4s02kf.apps.googleusercontent.com'
            },
            renderParams: {
                width: 250,
                height: 50,
                longtitle: true
            },
            loggedIn: false,
            googleUser: {},
            dialog: false,
            userCourses: []
        };
    },
    methods: {
        onSuccess(googleUser) {
            this.loggedIn = true;
            this.googleUser = googleUser.getBasicProfile();
            console.log(googleUser);
            // This only gets the user information: id, name, imageUrl and email
            console.log(googleUser.getBasicProfile());
            let profile = googleUser.getBasicProfile();
            this.dialog = false;
            console.log('ID: ' + profile.getId());
            console.log('Full Name: ' + profile.getName());
            console.log('Given Name: ' + profile.getGivenName());
            console.log('Family Name: ' + profile.getFamilyName());
            console.log('Image URL: ' + profile.getImageUrl());
            console.log('Email: ' + profile.getEmail());

            // use vuex to store user inforamtion
            this.$store.dispatch('updateUserInfo', profile.getId());

            // save login status in localstorage
            localStorage.setItem('login', true);
            this.insertUserIfNotExists(profile);

            // redirect to user page
            this.$router.push('/user').catch(() => {});
        },
        async insertUserIfNotExists(user) {
            let existingUser = null;
            await axios
                .get('http://localhost:8000/api/student' + '/' + user.getId())
                .then(response => {
                    existingUser = response.data;
                })
                .catch(e => {
                    this.errors.push(e);
                });
            console.log('Existing user', existingUser);
            if (existingUser === null)
                axios({
                    method: 'post',
                    url: 'http://localhost:8000/api/student',
                    data: {
                        StudentId: user.getId(),
                        StudentName: user.getName(),
                        StudentEmail: user.getEmail()
                    },
                    headers: {
                        'Content-Type': 'application/json'
                    }
                });
            // this.getUserCourses();
        },
        getUserCourses() {
            const userId = this.$store?.state?.userId;
            axios
                .get('http://localhost:8000/api/student/' + userId + '/courses')
                .then(response => {
                    return (this.userCourses = response.data.Courses);
                })
                .catch(e => {
                    this.errors.push(e);
                });
        },
        onFailure() {
            console.log('failure....');
            this.dialog = false;
        },
        logIn() {
            this.dialog = true;
        },
        logOut() {
            this.loggedIn = false;
            localStorage.removeItem('login');
            location.reload();
            // this.$router.push('/login').catch(() => {});
        },
        handleCourse(course) {
            this.$store.dispatch('updateCurrentCourse', {});
            this.$store.dispatch('updateCurrentCourse', course);
        }
    },
    components: {
        GoogleLogin,
        UserProfile
    }
};
</script>

<style scoped></style>
