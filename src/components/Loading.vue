<template>
    <div class="loading">
        <transition name="fade" mode="out-in">
            <div v-if="!isLoaded" class="loading__progress">
                LOADING... {{ progress }}%
            </div>
            <div v-else class="loading__enter" @click="clickHandler">START</div>
        </transition>
    </div>
</template>

<script>
export default {
    props: {
        progress: {
            type: Number,
            isRequired: true,
            default: 0,
        },
    },
    computed: {
        isLoaded() {
            return this.progress === 100
        },
    },
    methods: {
        clickHandler() {
            this.$emit('start')
        },
    },
}
</script>

<style scoped>
.loading {
    position: absolute;
    width: 100%;
    height: 100%;
    top: 0;
    left: 0;
    background: black;
    color: white;
    display: flex;
    align-items: center;
    justify-content: center;
}

.loading__enter {
    cursor: pointer;
    font-weight: bold;
    font-size: 20px;
    width: 80%;
    height: 80%;

    display: flex;
    justify-content: center;
    align-items: center;

    animation-name: beat;
    animation-duration: 2s;
    animation-iteration-count: infinite;
}

@keyframes beat {
    0% {
        transform: scale(1);
        opacity: 1;
    }
    50% {
        transform: scale(1.1);
        opacity: 0.9;
    }
    100% {
        transform: scale(1);
        opacity: 1;
    }
}
</style>
