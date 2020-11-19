<template>
    <span>
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
            <v-list>
                <template>
                    <v-expansion-panels accordion focusable>
                        <v-expansion-panel
                            v-for="(item, index) in items"
                            :key="index"
                            :class="{ 'blue lighten-2': true }"
                        >
                            <v-expansion-panel-header>
                                <v-icon>{{ item.icon }}</v-icon>
                                {{ item.title }}
                            </v-expansion-panel-header>
                            <v-expansion-panel-content>
                                {{ item.content }}
                            </v-expansion-panel-content>
                        </v-expansion-panel>
                    </v-expansion-panels>
                    <v-divider :key="`divider-${index}`"></v-divider>
                </template>
            </v-list>
        </v-navigation-drawer>
        <v-app-bar :clipped-left="clipped" fixed app>
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
            <v-btn icon @click.stop="fixed = !fixed">
                <v-icon>mdi-minus</v-icon>
            </v-btn>
            <v-toolbar-title v-text="appTitle" />
            <v-spacer />
            <!-- <v-btn icon>
        <v-icon>mdi-menu</v-icon>
      </v-btn> -->
            <v-btn flat class="hidden-sm-and-down">SIGN IN</v-btn>
            <v-btn flat color="blue lighten-3" class="hidden-sm-and-down"
                >JOIN</v-btn
            >
        </v-app-bar>
        <v-toolbar app color="blue darken-4" dark>
            <v-toolbar-side-icon
                class="hidden-md-and-up"
                @click="drawer = !drawer"
            ></v-toolbar-side-icon>
            <v-spacer class="hidden-md-and-up"></v-spacer>
            <v-toolbar-title>{{ appTitle }}</v-toolbar-title>
            <v-btn flat class="hidden-sm-and-down" icon>
                <v-icon>mdi-menu</v-icon>
            </v-btn>
            <v-spacer class="hidden-sm-and-down"></v-spacer>
            <v-btn flat class="hidden-sm-and-down">SIGN IN</v-btn>
            <v-btn color="brown lighten-3" class="hidden-sm-and-down"
                >JOIN</v-btn
            >
        </v-toolbar>
        <v-footer :absolute="!fixed" app>
            <span
                >Student Notes &copy; {{ new Date().getFullYear() }} All rights
                reserved</span
            >
        </v-footer>
    </span>
</template>

<script>
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
            ]
        };
    }
};
</script>

<style scoped></style>
