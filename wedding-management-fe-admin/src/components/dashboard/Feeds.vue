<template>
  <div class="card">
    <div class="card-body">
      <h5 class="card-title">Feeds</h5>
      <h6 class="card-subtitle mb-2 text-muted">Widget you can use</h6>
      <ul class="list-group list-group-flush mt-4">
        <li
          v-for="(feed, index) in feedData"
          :key="index"
          class="list-group-item d-flex align-items-center p-3 border-0"
        >
          <button
            class="btn rounded-circle me-3 btn-sm"
            :class="'btn-' + feed.color"
            type="button"
          >
            <i :class="feed.icon"></i>
          </button>
          {{ feed.title }}
          <small class="ms-auto text-muted text-small">
            {{ feed.date }}
          </small>
        </li>
      </ul>
    </div>
  </div>
</template>

<script setup>


import Feeds from '@/components/dashboard/Feeds.vue';

const feedData = [
  {
    title: "Cras justo odio",
    icon: "bi bi-bell",
    color: "primary",
    date: "6 minute ago",
  },
  {
    title: "New user registered.",
    icon: "bi bi-person",
    color: "info",
    date: "6 minute ago",
  },
  {
    title: "Server #1 overloaded.",
    icon: "bi bi-hdd",
    color: "danger",
    date: "6 minute ago",
  },
  {
    title: "New order received.",
    icon: "bi bi-bag-check",
    color: "success",
    date: "6 minute ago",
  },
  {
    title: "Cras justo odio",
    icon: "bi bi-bell",
    color: "dark",
    date: "6 minute ago",
  },
  {
    title: "Server #1 overloaded.",
    icon: "bi bi-hdd",
    color: "warning",
    date: "6 minute ago",
  },
];
</script>