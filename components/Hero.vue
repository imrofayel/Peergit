<template>

  <div class="sm:max-w-2xl mx-auto px-4 sm:px-0 py-6"><Header/>

  <div class="w-full flex flex-col items-center justify-center">

    <h1 class="instrument-italic pt-12 text-5xl text-center">a GitHub <u class="instrument-italic decoration-3 decoration-wavy underline-offset-4 decoration-[#3951ca]">Peer</u> for you.</h1>

    <div class="flex mt-2 gap-3 w-full items-center justify-center">
      <input class="inline-flex items-center justify-center text-base ring-offset-white transition-colors focus-visible:outline-none focus-visible:ring-0 p-3 py-2.5 rounded-2xl disabled:pointer-events-none disabled:opacity-50 shadow-xs mt-8 gap-1 border border-neutral-200 bg-white hover:bg-neutral-50">

      <UiButton class="rounded-2xl mt-8 text-lg gap-1 cursor-pointer" variant="default" size="lg">
      Start</UiButton>
    </div>

  </div></div>
</template>