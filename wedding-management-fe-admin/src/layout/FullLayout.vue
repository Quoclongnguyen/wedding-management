<script setup>
import Sidebar from './Sidebar.vue'; // Import Sidebar component
import Header from './Header.vue';   // Import Header component


</script>

<template>
    <main>
        <div class="pageWrapper d-lg-flex">
           <!----sidebar-->
            <aside className="sidebarArea shadow" id="sidebarArea">
                <Sidebar />
            </aside>
              <!----Content Area-->
            <div className="contentArea">
                  <!----header-->
                <Header />
                  <!----Middle Content-->
                <Container className="p-4 wrapper" fluid>
                    <router-view />
                </Container>
            </div>
        </div>

    </main>

</template>

