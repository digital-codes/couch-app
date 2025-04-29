<template>
  <UApp>

    <h1>Hello App!</h1>

    <UBadge icon="i-lucide-rocket" size="xl" color="primary" variant="solid">Badge</UBadge>

    <p>
      <strong>Current route path:</strong> {{ $route.fullPath }}
    </p>
    <nav>
      <RouterLink to="/">Go to Home</RouterLink>
      <RouterLink to="/about">Go to About</RouterLink>
    </nav>
    <main>
      <RouterView @count="handleCount" />
    </main>
  </UApp>
</template>

<script setup lang="ts">
//import { RouterLink, RouterView } from 'vue-router';

// pouchdb
// https://terreii.github.io/use-pouchdb/docs/introduction/pouchdb_couchdb

import PouchDB from 'pouchdb-browser';
import { ref, onMounted, onUnmounted } from 'vue';

const dbName = "http://localhost:5984/"
const userName = "jan"
const userPwd = "apple"

const dbUrl = new URL(dbName)
dbUrl.pathname += getUserDatabaseName(userName)
dbUrl.username = userName
dbUrl.password = userPwd

console.log('Database URL:', dbUrl.toString());

const docId = "counter5"

const localDb = ref<PouchDB.Database | null>(null);
const docRev = ref('');

let syncHandler: PouchDB.Replication.Sync<{}> | null = null


function getUserDatabaseName(name:string, prefix = 'userdb-') {
  const encoder = new TextEncoder()
  const buffy = encoder.encode(name)
  const bytes = Array.from(buffy).map(byte =>
    byte.toString(16).padStart(2, '0')
  )
  return prefix + bytes.join('')
}


onMounted(async () => {

  localDb.value = new PouchDB('localdb', {
    auto_compaction: true,
  });
  // setup sync
  syncHandler = localDb.value.sync(dbUrl.toString(), {
    live: true,
    retry: true,
  }).on('change', (info:any) => {
    console.log('Sync change:', info)
  }).on('error', (err) => {
    console.error('Sync error:', err)
  })
    .on('paused', (info) => {
      console.log('Replication paused:', info);
    })
    .on('denied', (info) => {
      console.error('Replication denied:', info);
    })
    .on('complete', (info) => {
      console.log('Replication complete:', info);
    })
  // 

  try {
    const info = await localDb.value.info()
    console.log('Local database info:', info);
    // repliate from if empty
    if (info.doc_count === 0) {
      console.log('Local database is empty, starting replication...');
      localDb.value.replicate.from(dbUrl.toString(), {
        live: true,
        retry: true,
      })
    } else {
      const doc = await localDb.value.get(docId);
      docRev.value = doc._rev;
      console.log('Document retrieved:', doc);
    }
  } catch (error) {
    console.error('Error getting local database info:', error);
  };

  const db = new PouchDB(dbUrl.toString());
  db.info().then((info) => {
    console.log('Database info:', info);
  }).catch((error) => {
    console.error('Error getting database info:', error);
  });
});

const handleCount = async (count: number) => {
  console.log('Count from child component:', count);
  if (!syncHandler) {
    console.error('Sync handler is not initialized');
  }
  try {
    let response
    if (docRev.value === '') {
      response = await localDb.value?.put({
        _id: docId,
        value: count,
      })
    } else {
      response = await localDb.value?.put({
        _id: docId,
        value: count,
        _rev: docRev.value,
      })
    }
    console.log('Document saved:', response);
    if (response?.ok) {
      docRev.value = response.rev;
    }
    const doc = await localDb.value?.get(docId);
    console.log('Document retrieved:', doc);
    console.log('Document revision:', doc?._rev);
  } catch (err) {
    console.error(err)
  }
};


// Clean up on component unmount
onUnmounted(() => {
  if (syncHandler) {
    syncHandler.cancel()
  }
})


</script>


<style scoped>
.logo {
  height: 6em;
  padding: 1.5em;
  will-change: filter;
  transition: filter 300ms;
}

.logo:hover {
  filter: drop-shadow(0 0 2em #646cffaa);
}

.logo.vue:hover {
  filter: drop-shadow(0 0 2em #42b883aa);
}
</style>
