<script setup lang="ts">

interface BookDetail {
    name: string
    author: string
    isbn: string
    info: string
    situation: boolean
    picAdd: string
}

let a : BookDetail = {
    name: "Fresh Cream",
    author: "Cream",
    isbn: "T4988 005 00760 5",
    info: "Cream debut album released in 1967, featuring I Feel Free.",
    situation: true,
    picAdd: "https://i.discogs.com/-MFOcWZEds4m0aIBEwrdBZYVLItKac3trqugpxK5YoA/rs:fit/g:sm/q:90/h:600/w:600/czM6Ly9kaXNjb2dz/LWRhdGFiYXNlLWlt/YWdlcy9SLTE3NTE4/ODMtMTUzODEyOTkx/My0zNDkxLmpwZWc.jpeg"
}
</script>

<template>
    <a-card class="card">
        <div class="upper">
            <div class="uLeft">
                <img style="max-width: 100px;align: center;" alt="example" :src="a.picAdd"/>
            </div>
            <div class="uRight">
                <ul style="align: center;">
                    <li>bookName: {{ a.name }}</li>
                    <li>author: {{ a.author }}</li>
                    <li>isbn: {{ a.isbn }}</li>
                    <li>info: {{ a.info }}</li>
                </ul>
            </div>
        </div>
        <div class="lower">
            <p>situation: {{ a.situation ? "OK" : "NOPE" }}</p>
        </div>
    </a-card>
</template>

<style scoped>

.card {
    flex-wrap: wrap;
}

.card .upper {
    height: 95%
}

.card .upper .uLeft {
    width: 30%;
    align-items: flex-start;
    display: inline-flex;
}

.card .upper .uRight {
    width: 70%;
    height: 100%;
    align-items: flex-start;
    display: inline-block;
}

.card .lower {
    height: 5%;
    text-align: center;
}

</style>